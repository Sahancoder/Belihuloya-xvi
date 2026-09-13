import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  requireInput?: string; // If set, user must type this exact string
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  requireInput,
  onConfirm,
  onCancel,
}) => {
  const [typedInput, setTypedInput] = React.useState('');

  if (!isOpen) return null;

  const isConfirmDisabled = requireInput ? typedInput.trim() !== requireInput : false;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          btn: 'bg-red-600 hover:bg-red-500 text-white',
          border: 'border-red-500/50',
          icon: 'text-red-400',
        };
      case 'warning':
        return {
          btn: 'bg-amber-600 hover:bg-amber-500 text-white',
          border: 'border-amber-500/50',
          icon: 'text-amber-400',
        };
      case 'primary':
      default:
        return {
          btn: 'bg-cyan-600 hover:bg-cyan-500 text-white',
          border: 'border-cyan-500/50',
          icon: 'text-cyan-400',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md bg-broadcast-card border ${styles.border} rounded-2xl p-6 shadow-2xl space-y-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-slate-900 ${styles.icon}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
            <span className="text-xs text-slate-400">Action requires confirmation</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>

        {requireInput && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">
              Type <strong className="text-red-400 select-all">{requireInput}</strong> to confirm:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={requireInput}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-red-500"
              autoFocus
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${styles.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
