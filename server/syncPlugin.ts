import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';

/**
 * Local-only sync + media endpoints, mounted on the Vite dev and preview servers.
 *
 *   GET  /api/state          latest match state (JSON)
 *   POST /api/state          publish match state, pushed to every /api/events client
 *   GET  /api/events         Server-Sent Events stream of state updates
 *   GET  /api/media          list interval media (uploads + files in public/media)
 *   POST /api/media          upload a file (raw body, X-File-Name header)
 *   DELETE /api/media/:name  delete an uploaded file
 *   GET  /uploads/:name      stream an uploaded file (supports Range for video)
 *
 * State is also written to disk so a server restart keeps the score.
 */

const ROOT = process.cwd();
const UPLOAD_DIR = path.join(ROOT, 'media-uploads');
/** Media shipped with the site (works on static hosting such as Vercel). */
const PUBLIC_MEDIA_DIR = path.join(ROOT, 'public', 'media');
const STATE_FILE = path.join(ROOT, '.match-state.json');
const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;

const MIME: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const safeName = (raw: string) =>
  path
    .basename(raw)
    .replace(/[^\w.\- ]+/g, '_')
    .trim();

const readBody = (req: IncomingMessage, limit: number) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const mediaType = (name: string) => (MIME[path.extname(name).toLowerCase()]?.startsWith('video') ? 'video' : 'image');

const listDir = (dir: string, urlPrefix: string, bundled: boolean) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => MIME[path.extname(name).toLowerCase()])
    .map((name) => ({
      name,
      size: fs.statSync(path.join(dir, name)).size,
      url: `${urlPrefix}${encodeURIComponent(name)}`,
      type: mediaType(name),
      bundled,
    }));
};

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const createMiddleware = (): Connect.NextHandleFunction => {
  let latest: string | null = null;
  try {
    latest = fs.readFileSync(STATE_FILE, 'utf8');
  } catch {
    /* no saved state yet */
  }
  const clients = new Set<ServerResponse>();

  return async (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const route = url.pathname;
    // Lets the client tell this local sync server apart from static hosting.
    if (route.startsWith('/api/')) res.setHeader('X-Score-Sync', '1');

    try {
      if (route === '/api/events') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-store',
          Connection: 'keep-alive',
        });
        res.write('retry: 1000\n\n');
        clients.add(res);
        const ping = setInterval(() => res.write(': ping\n\n'), 15000);
        req.on('close', () => {
          clearInterval(ping);
          clients.delete(res);
        });
        return;
      }

      if (route === '/api/state') {
        if (req.method === 'GET' || req.method === 'HEAD') {
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Content-Type', 'application/json');
          res.end(latest ?? 'null');
          return;
        }
        if (req.method === 'POST') {
          const body = (await readBody(req, 5 * 1024 * 1024)).toString('utf8');
          const parsed = JSON.parse(body);
          const current = latest ? JSON.parse(latest) : null;
          if (!current || Number(parsed.updatedAt) >= Number(current.updatedAt)) {
            latest = body;
            fs.promises.writeFile(STATE_FILE, body).catch(() => undefined);
            for (const client of clients) client.write(`data: ${body}\n\n`);
          }
          sendJson(res, 200, { ok: true });
          return;
        }
      }

      if (route === '/api/media' && req.method === 'GET') {
        sendJson(res, 200, [...listDir(PUBLIC_MEDIA_DIR, '/media/', true), ...listDir(UPLOAD_DIR, '/uploads/', false)]);
        return;
      }

      if (route === '/api/media' && req.method === 'POST') {
        const name = safeName(decodeURIComponent(String(req.headers['x-file-name'] ?? '')));
        if (!name || !MIME[path.extname(name).toLowerCase()]) {
          sendJson(res, 400, { error: 'Only MP4/WEBM/MOV video or PNG/JPG/WEBP/GIF images are allowed.' });
          return;
        }
        const body = await readBody(req, MAX_UPLOAD_BYTES);
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        await fs.promises.writeFile(path.join(UPLOAD_DIR, name), body);
        sendJson(res, 200, { ok: true, name });
        return;
      }

      if (route.startsWith('/api/media/') && req.method === 'DELETE') {
        const name = safeName(decodeURIComponent(route.slice('/api/media/'.length)));
        await fs.promises.unlink(path.join(UPLOAD_DIR, name)).catch(() => undefined);
        sendJson(res, 200, { ok: true });
        return;
      }

      if (route.startsWith('/uploads/') && (req.method === 'GET' || req.method === 'HEAD')) {
        const name = safeName(decodeURIComponent(route.slice('/uploads/'.length)));
        const file = path.join(UPLOAD_DIR, name);
        if (!fs.existsSync(file)) {
          res.statusCode = 404;
          res.end();
          return;
        }
        const { size } = fs.statSync(file);
        const type = MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
        const range = /bytes=(\d*)-(\d*)/.exec(String(req.headers.range ?? ''));
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', type);

        if (range) {
          const start = range[1] ? Number(range[1]) : 0;
          const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
          if (start > end || start >= size) {
            res.statusCode = 416;
            res.setHeader('Content-Range', `bytes */${size}`);
            res.end();
            return;
          }
          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
          res.setHeader('Content-Length', end - start + 1);
          if (req.method === 'HEAD') return void res.end();
          fs.createReadStream(file, { start, end }).pipe(res);
          return;
        }

        res.setHeader('Content-Length', size);
        if (req.method === 'HEAD') return void res.end();
        fs.createReadStream(file).pipe(res);
        return;
      }
    } catch (err) {
      sendJson(res, 500, { error: err instanceof Error ? err.message : 'Server error' });
      return;
    }

    next();
  };
};

export const scoreSyncPlugin = (): Plugin => ({
  name: 'belihuloya-score-sync',
  configureServer(server) {
    server.middlewares.use(createMiddleware());
  },
  configurePreviewServer(server) {
    server.middlewares.use(createMiddleware());
  },
  // Static builds have no /api/media, so ship the list of public/media files as JSON.
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'media/manifest.json',
      source: JSON.stringify(listDir(PUBLIC_MEDIA_DIR, '/media/', true)),
    });
  },
});
