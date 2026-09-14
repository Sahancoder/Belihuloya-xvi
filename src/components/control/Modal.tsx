import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export type ModalTone = 'cyan' | 'red' | 'gold' | 'green';

const toneBorder: Record<ModalTone, string> = {
  cyan: 'border-ops-cyan/40',
  red: 'border-ops-red/50',
  gold: 'border-ops-gold/50',
  green: 'border-ops-green/50',
};

interface ModalProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tone?: ModalTone;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({ title, subtitle, icon, tone = 'cyan', onClose, children, footer, width = 'max-w-md' }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020A16]/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${width} rounded-2xl border ${toneBorder[tone]} bg-ops-panel shadow-[0_24px_60px_rgba(0,0,0,0.5)]`}
      >
        <div className="flex items-start gap-3 border-b border-white/[0.07] px-5 py-4">
          {icon}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-white">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-ops-muted">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-ops-dim hover:bg-white/5 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        <div className="flex justify-end gap-2.5 border-t border-white/[0.07] px-5 py-3.5">{footer}</div>
      </div>
    </div>
  );
};
