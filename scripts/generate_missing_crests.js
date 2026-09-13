import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/universities');

const missingLogos = {
  uor: {
    code: 'UOR',
    name: 'RUHUNA',
    sub: 'UNIVERSITY OF RUHUNA',
    color: '#003366',
    gold: '#DAA520',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#003366" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#DAA520" stroke-width="3"/>
      <!-- Stupa / Dagoba & Traditional Sun Motif -->
      <path d="M100,35 L100,50 M100,50 C80,65 72,85 72,115 L128,115 C128,85 120,65 100,50 Z" fill="#003366"/>
      <circle cx="100" cy="35" r="4" fill="#DAA520"/>
      <rect x="68" y="115" width="64" height="12" rx="4" fill="#DAA520"/>
      <!-- University Name Arced -->
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#003366" text-anchor="middle" letter-spacing="1">UNIVERSITY OF RUHUNA</text>
    `
  },
  eusl: {
    code: 'EUSL',
    name: 'EASTERN',
    sub: 'EASTERN UNIVERSITY, SRI LANKA',
    color: '#1A365D',
    gold: '#D69E2E',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#1A365D" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#D69E2E" stroke-width="3"/>
      <!-- Rising Sun & Waves -->
      <path d="M50,110 Q100,95 150,110 Q100,125 50,110 Z" fill="#3182CE"/>
      <path d="M55,122 Q100,110 145,122 Q100,134 55,122 Z" fill="#2B6CB0"/>
      <circle cx="100" cy="80" r="24" fill="#ECC94B"/>
      <!-- Sun rays -->
      <path d="M100,42 L100,52 M128,52 L121,60 M72,52 L79,60 M140,80 L130,80 M60,80 L70,80" stroke="#D69E2E" stroke-width="4" stroke-linecap="round"/>
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#1A365D" text-anchor="middle" letter-spacing="1">EASTERN UNIVERSITY</text>
    `
  },
  seusl: {
    code: 'SEUSL',
    name: 'SOUTH EASTERN',
    sub: 'SOUTH EASTERN UNIVERSITY',
    color: '#065F46',
    gold: '#D97706',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#065F46" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#D97706" stroke-width="3"/>
      <!-- Arch & Book -->
      <path d="M70,120 L70,80 C70,55 100,42 100,42 C100,42 130,55 130,80 L130,120 Z" fill="none" stroke="#065F46" stroke-width="6"/>
      <path d="M78,95 Q100,90 100,105 Q100,90 122,95 L122,118 Q100,112 100,125 Q100,112 78,118 Z" fill="#059669"/>
      <circle cx="100" cy="65" r="7" fill="#D97706"/>
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="10.5" fill="#065F46" text-anchor="middle" letter-spacing="1">SOUTH EASTERN UNIV.</text>
    `
  },
  wusl: {
    code: 'WUSL',
    name: 'WAYAMBA',
    sub: 'WAYAMBA UNIVERSITY',
    color: '#1E3A8A',
    gold: '#2563EB',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#1E3A8A" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#2563EB" stroke-width="3"/>
      <!-- Paddy Sheaf & Palm Leaves -->
      <path d="M100,40 L100,125" stroke="#1E3A8A" stroke-width="5" stroke-linecap="round"/>
      <path d="M78,65 C90,60 95,75 100,80 C95,85 85,75 78,65 Z" fill="#3B82F6"/>
      <path d="M122,65 C110,60 105,75 100,80 C105,85 115,75 122,65 Z" fill="#3B82F6"/>
      <path d="M78,92 C90,87 95,98 100,102 C95,108 85,98 78,92 Z" fill="#2563EB"/>
      <path d="M122,92 C110,87 105,98 100,102 C105,108 115,98 122,92 Z" fill="#2563EB"/>
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#1E3A8A" text-anchor="middle" letter-spacing="1">WAYAMBA UNIVERSITY</text>
    `
  },
  ousl: {
    code: 'OUSL',
    name: 'OPEN UNIVERSITY',
    sub: 'OPEN UNIVERSITY OF SRI LANKA',
    color: '#1E40AF',
    gold: '#EAB308',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#1E40AF" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#EAB308" stroke-width="3"/>
      <!-- Open Torch & Globe -->
      <ellipse cx="100" cy="90" rx="30" ry="16" fill="none" stroke="#3B82F6" stroke-width="3.5"/>
      <circle cx="100" cy="90" r="30" fill="none" stroke="#3B82F6" stroke-width="3"/>
      <polygon points="94,85 106,85 103,122 97,122" fill="#EAB308"/>
      <path d="M100,55 C92,67 88,75 100,83 C112,75 108,67 100,55 Z" fill="#EF4444"/>
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="10.5" fill="#1E40AF" text-anchor="middle" letter-spacing="1">OPEN UNIVERSITY OF SL</text>
    `
  },
  uvpa: {
    code: 'UVPA',
    name: 'VISUAL & PERFORMING',
    sub: 'UNIV. OF VISUAL & PERFORMING ARTS',
    color: '#831843',
    gold: '#F59E0B',
    svgContent: `
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#831843" stroke-width="6"/>
      <circle cx="100" cy="100" r="80" fill="none" stroke="#F59E0B" stroke-width="3"/>
      <!-- Ves Thattuwa Crown & Geta Beraya Drum -->
      <polygon points="100,45 116,72 100,67 84,72" fill="#F59E0B"/>
      <path d="M70,82 C85,75 115,75 130,82 C120,92 80,92 70,82 Z" fill="#831843"/>
      <ellipse cx="78" cy="110" rx="8" ry="11" fill="#F59E0B"/>
      <ellipse cx="122" cy="110" rx="8" ry="11" fill="#F59E0B"/>
      <path d="M78,99 Q100,93 122,99 L122,121 Q100,127 78,121 Z" fill="#831843" stroke="#F59E0B" stroke-width="2.5"/>
      <text x="100" y="152" font-family="'Inter', sans-serif" font-weight="900" font-size="10" fill="#831843" text-anchor="middle" letter-spacing="1">VISUAL & PERFORMING</text>
    `
  }
};

for (const [key, data] of Object.entries(missingLogos)) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  ${data.svgContent}
</svg>`;
  const target = path.join(outDir, `${key}.svg`);
  fs.writeFileSync(target, svg.trim(), 'utf8');
  console.log(`Generated circular crest: ${target}`);
}
