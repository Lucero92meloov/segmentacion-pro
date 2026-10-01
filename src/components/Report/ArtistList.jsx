import React from 'react';
import { UserCheck } from 'lucide-react';

export default function ArtistList({ artists = [], derivedColors }) {
  if (!artists || artists.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {artists.map((artist, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-[1.3px] font-poppins"
          style={{
            backgroundColor: derivedColors.cardBgSecondary,
            borderColor: derivedColors.cardBorderSecondary
          }}
        >
          <UserCheck
            className="w-4 h-4 flex-shrink-0"
            style={{ color: derivedColors.secondary }}
            strokeWidth={1.8}
          />
          <span
            className="text-[16.5px] font-medium"
            style={{ color: derivedColors.text }}
          >
            {artist}
          </span>
        </div>
      ))}
    </div>
  );
}
