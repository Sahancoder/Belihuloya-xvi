import React from 'react';
import { University } from '../../types/university';
import { SafeImage } from './SafeImage';

interface TeamLogoProps {
  team: University;
  /** Diameter in px. */
  size: number;
  className?: string;
}

/** University crest on a white disc; falls back to the short code if the file is missing. */
export const TeamLogo: React.FC<TeamLogoProps> = ({ team, size, className = '' }) => (
  <div
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
    style={{ width: size, height: size, padding: Math.round(size * 0.1), fontSize: Math.max(9, Math.round(size * 0.22)) }}
  >
    <SafeImage
      key={team.logoPath}
      src={team.logoPath}
      alt={team.name}
      fallbackText={team.code}
      fallbackBg={team.primaryColor}
      className="h-full w-full object-contain"
      draggable={false}
    />
  </div>
);
