import React, { useRef } from 'react';
import { Clapperboard, Eye, Film, ImageIcon, Music, Play, Sparkles, Square, Trash2, Upload, VolumeX } from 'lucide-react';
import { IntervalSelection } from '../../types/match';
import { BUILT_IN_MEDIA } from '../../data/event';
import { useMatchStore } from '../../store/matchStore';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';

interface IntervalMediaPanelProps {
  previewMedia: IntervalSelection | null;
  onPreview: (selection: IntervalSelection | null) => void;
}

const formatSize = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`);

export const IntervalMediaPanel: React.FC<IntervalMediaPanelProps> = ({ previewMedia, onPreview }) => {
  const status = useMatchStore((s) => s.status);
  const interval = useMatchStore((s) => s.interval);
  const music = useMatchStore((s) => s.intervalMusic);
  const musicOutput = useMatchStore((s) => s.musicOutput);
  const { setInterval, playInterval, setStatus, setIntervalMusic, setMusicOutput } = useMatchStore.getState();
  const { files, available, uploading, error, upload, remove } = useMediaLibrary();
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadedNames = new Set(files.map((f) => f.name));

  /** Built-in item → uploaded MP4 with the matching name if present, else the animated screen. */
  const resolveBuiltIn = (id: string): IntervalSelection => {
    const item = BUILT_IN_MEDIA.find((m) => m.id === id);
    const file = item?.videoFile && uploadedNames.has(item.videoFile) ? files.find((f) => f.name === item.videoFile) : undefined;
    return { id, mediaUrl: file?.url ?? null };
  };

  const select = (selection: IntervalSelection) => {
    setInterval(selection);
    if (previewMedia) onPreview(selection);
  };

  const onAir = status === 'INTERVAL';

  const row = (selection: IntervalSelection, title: string, subtitle: string, icon: React.ReactNode, extra?: React.ReactNode) => {
    const selected = interval.id === selection.id;
    return (
      <li key={selection.id} className="group relative">
        <button
          type="button"
          onClick={() => select(selection)}
          aria-pressed={selected}
          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
            selected ? 'border-ops-cyan bg-ops-cyan/[0.08]' : 'border-transparent bg-ops-inset hover:border-white/15'
          }`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? 'bg-ops-cyan/20 text-ops-cyan' : 'bg-white/5 text-ops-muted'}`}>
            {icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-white">{title}</span>
            <span className="block truncate text-[11px] text-ops-dim">{subtitle}</span>
          </span>
          {selected && onAir && <span className="rounded bg-ops-gold px-1.5 py-0.5 text-[9px] font-black tracking-wider text-[#2A1E03]">ON AIR</span>}
          {extra}
        </button>
      </li>
    );
  };

  return (
    <section aria-label="Interval media" className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">
          <Clapperboard className="h-4 w-4 text-ops-gold" />
          4. Interval / Break Media
        </h2>
        <button
          type="button"
          onClick={() => setIntervalMusic(!music)}
          aria-pressed={music}
          className={`btn h-8 border px-2.5 text-[11px] ${music ? 'border-ops-green/40 bg-ops-green/10 text-ops-green' : 'border-white/10 bg-ops-inset text-ops-dim'}`}
          title="Loop Driving.wav on the overlay during INTERVAL (uploaded videos use their own audio)"
        >
          {music ? <Music className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          Music {music ? 'On' : 'Off'}
        </button>
      </div>

      <ul className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
        {BUILT_IN_MEDIA.map((m) => {
          const sel = resolveBuiltIn(m.id);
          const icon = sel.mediaUrl ? <Film className="h-4 w-4" /> : m.kind === 'image' ? <ImageIcon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />;
          const subtitle = sel.mediaUrl ? `MP4 · ${m.videoFile} · Loop` : `${m.subtitle} · Loop`;
          return row(sel, m.title, subtitle, icon);
        })}
        {files.map((f) =>
          row(
            { id: `upload:${f.name}`, mediaUrl: f.url },
            f.name,
            `${f.bundled ? 'public/media' : 'Uploaded'} ${f.type} · ${formatSize(f.size)} · Loop`,
            f.type === 'video' ? <Film className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />,
            !f.bundled && <span
              role="button"
              tabIndex={0}
              aria-label={`Delete ${f.name}`}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${f.name}?`)) remove(f.name);
              }}
              className="rounded-md p-1.5 text-ops-dim opacity-0 transition hover:bg-ops-red/15 hover:text-ops-red group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </span>
          )
        )}
      </ul>

      <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr] gap-2">
        {onAir && interval.id ? (
          <button type="button" onClick={() => setStatus('LIVE')} className="btn h-12 border border-white/20 bg-white/10 text-[13px] text-white hover:bg-white/15">
            <Square className="h-4 w-4 fill-current" />
            Stop → Live
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playInterval(interval);
              onPreview(null);
            }}
            className="btn h-12 bg-gradient-to-b from-ops-gold to-[#E0A92A] text-[13px] text-[#2A1E03] hover:from-[#FFD466]"
          >
            <Play className="h-4 w-4 fill-current" />
            Play Loop
          </button>
        )}
        <button
          type="button"
          onClick={() => onPreview(previewMedia ? null : interval)}
          aria-pressed={!!previewMedia}
          className={`btn h-12 border text-[12px] ${previewMedia ? 'border-ops-gold/60 bg-ops-gold/10 text-ops-gold' : 'border-white/10 bg-ops-inset text-ops-muted hover:text-white'}`}
        >
          <Eye className="h-4 w-4" />
          {previewMedia ? 'Close' : 'Preview'}
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} disabled={!available || uploading} className="btn-ghost h-12 text-[12px]">
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = '';
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ops-dim">Music plays from</span>
        <div role="radiogroup" aria-label="Music output" className="flex rounded-lg border border-white/10 bg-ops-inset p-0.5">
          {(
            [
              ['overlay', 'OBS overlay'],
              ['control', 'This laptop (control panel)'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={musicOutput === id}
              onClick={() => setMusicOutput(id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${musicOutput === id ? 'bg-white text-ops-bg' : 'text-ops-muted hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-ops-dim">
        {!available
          ? 'Hosted mode: Upload is off. Put MP4 files in public/media and redeploy.'
          : error
            ? <span className="text-ops-red">{error}</span>
            : 'Tip: upload susl-logo.mp4, belihuloya-logo.mp4 or sponsors.mp4 to replace those animations with your video.'}
      </p>
    </section>
  );
};
