import { useCallback, useEffect, useState } from 'react';

export interface UploadedMedia {
  name: string;
  size: number;
  url: string;
  type: 'video' | 'image';
  /** Shipped in public/media (cannot be deleted from the panel). */
  bundled?: boolean;
}

/**
 * Interval media: files in public/media plus uploads saved by the local server
 * (see server/syncPlugin.ts). On static hosting only public/media is available.
 */
export const useMediaLibrary = () => {
  const [files, setFiles] = useState<UploadedMedia[]>([]);
  const [available, setAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/media', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setFiles(await res.json());
      setAvailable(true);
    } catch {
      setAvailable(false);
      try {
        const res = await fetch('/media/manifest.json', { cache: 'no-store' });
        setFiles(res.ok ? await res.json() : []);
      } catch {
        setFiles([]);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: { 'X-File-Name': encodeURIComponent(file.name), 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!res.ok) throw new Error(await res.text());
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (name: string) => {
      await fetch(`/api/media/${encodeURIComponent(name)}`, { method: 'DELETE' }).catch(() => undefined);
      await refresh();
    },
    [refresh]
  );

  return { files, available, uploading, error, upload, remove, refresh };
};
