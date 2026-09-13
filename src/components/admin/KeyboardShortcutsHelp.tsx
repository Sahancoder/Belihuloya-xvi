import React from 'react';
import { Keyboard } from 'lucide-react';

export const KeyboardShortcutsHelp: React.FC = () => {
  const shortcuts = [
    { key: '1 - 5', action: '+1 to +5 Runs' },
    { key: 'B', action: '+1 Ball' },
    { key: 'O', action: '+1 Out' },
    { key: 'U', action: 'Undo Last Action' },
  ];

  return (
    <div className="bg-[#091426] border border-[#18CFF2]/20 rounded-2xl p-4 md:p-5 shadow-[0_8px_28px_rgba(0,0,0,0.20)] space-y-3 select-none font-display">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Keyboard className="w-4 h-4 text-[#18CFF2]" />
        <h3 className="font-extrabold text-sm tracking-wider text-white uppercase font-display">
          KEYBOARD SHORTCUTS (QUICK SCORING)
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {shortcuts.map((sc) => (
          <div
            key={sc.key}
            className="flex items-center gap-2 bg-[#050B1B] border border-white/10 rounded-lg p-2"
          >
            <kbd className="px-2 py-0.5 bg-[#111D31] border border-white/20 rounded text-[#18CFF2] font-mono font-bold text-xs shadow-sm">
              {sc.key}
            </kbd>
            <span className="text-[11px] font-semibold text-[#A7B2C7]">
              {sc.action}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#6F809B] italic">
        * Dangerous actions (Reset, End Innings) have no single-key shortcuts to prevent accidental clicks. Shortcuts are automatically paused when typing in input boxes.
      </p>
    </div>
  );
};
