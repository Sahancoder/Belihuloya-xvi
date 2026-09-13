import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/universities');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const tournamentDir = path.resolve('public/tournament');
if (!fs.existsSync(tournamentDir)) {
  fs.mkdirSync(tournamentDir, { recursive: true });
}

// Copy tournament logo if available
const origLogo = path.resolve('public/tournament logo/WhatsApp_Image_2026-09-05_at_12.08.10-removebg-preview.png');
const targetLogo = path.resolve('public/tournament/belihuloya-xvi-logo.png');
if (fs.existsSync(origLogo) && !fs.existsSync(targetLogo)) {
  fs.copyFileSync(origLogo, targetLogo);
  console.log('Copied tournament logo to public/tournament/belihuloya-xvi-logo.png');
}

const logos = {
  susl: {
    code: 'SUSL',
    name: 'SABARAGAMUWA',
    sub: 'UNIVERSITY OF SRI LANKA',
    bg: '#7B1113',
    accent: '#F59E0B',
    secondary: '#FBBF24',
    symbol: `
      <!-- Adam's Peak & Sunburst Motif -->
      <polygon points="100,55 145,130 55,130" fill="#F59E0B" opacity="0.9"/>
      <polygon points="100,70 135,130 65,130" fill="#7B1113"/>
      <circle cx="100" cy="50" r="14" fill="#FBBF24"/>
      <!-- Sun rays -->
      <path d="M100,28 L100,38 M115,32 L108,39 M122,48 L112,50 M78,48 L88,50 M85,32 L92,39" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <!-- Gem facets -->
      <polygon points="100,85 118,102 100,120 82,102" fill="#FBBF24" opacity="0.95"/>
    `
  },
  uoc: {
    code: 'UOC',
    name: 'COLOMBO',
    sub: 'UNIVERSITY OF COLOMBO',
    bg: '#800000',
    accent: '#EAB308',
    secondary: '#CA8A04',
    symbol: `
      <!-- Radiant Lotus Motif & Sacred Flame -->
      <circle cx="100" cy="95" r="32" fill="#EAB308" opacity="0.2"/>
      <path d="M100,60 C90,80 75,95 65,115 C85,118 95,110 100,125 C105,110 115,118 135,115 C125,95 110,80 100,60 Z" fill="#EAB308"/>
      <circle cx="100" cy="85" r="10" fill="#800000"/>
      <path d="M100,50 L100,56 M118,58 L113,63 M82,58 L87,63" stroke="#EAB308" stroke-width="3" stroke-linecap="round"/>
    `
  },
  uop: {
    code: 'UOP',
    name: 'PERADENIYA',
    sub: 'UNIVERSITY OF PERADENIYA',
    bg: '#0F2C59',
    accent: '#F59E0B',
    secondary: '#D97706',
    symbol: `
      <!-- Punkalasa (Vessel of Abundance) -->
      <path d="M85,125 C80,115 75,100 82,90 C88,82 92,80 100,80 C108,80 112,82 118,90 C125,100 120,115 115,125 Z" fill="#F59E0B"/>
      <!-- Lotus leaves blooming from vessel -->
      <path d="M100,50 C95,65 92,72 100,80 C108,72 105,65 100,50 Z" fill="#FCD34D"/>
      <path d="M82,62 C78,72 88,78 96,80 C90,72 88,65 82,62 Z" fill="#F59E0B"/>
      <path d="M118,62 C122,72 112,78 104,80 C110,72 112,65 118,62 Z" fill="#F59E0B"/>
      <rect x="86" y="125" width="28" height="6" rx="3" fill="#D97706"/>
    `
  },
  usj: {
    code: 'USJ',
    name: 'JAYEWARDENEPURA',
    sub: 'UNIV. OF SRI JAYEWARDENEPURA',
    bg: '#064E3B',
    accent: '#FACC15',
    secondary: '#EAB308',
    symbol: `
      <!-- Traditional Oil Lamp & Flame -->
      <path d="M100,48 C94,62 92,70 100,78 C108,70 106,62 100,48 Z" fill="#FACC15"/>
      <circle cx="100" cy="66" r="4" fill="#EF4444"/>
      <path d="M75,95 C75,85 125,85 125,95 C125,108 112,118 100,118 C88,118 75,108 75,95 Z" fill="#FACC15"/>
      <rect x="94" y="118" width="12" height="15" fill="#EAB308"/>
      <rect x="80" y="133" width="40" height="5" rx="2" fill="#FACC15"/>
    `
  },
  uok: {
    code: 'UOK',
    name: 'KELANIYA',
    sub: 'UNIVERSITY OF KELANIYA',
    bg: '#581C87',
    accent: '#FBBF24',
    secondary: '#F59E0B',
    symbol: `
      <!-- Hansa / Sacred Swan & Ola Leaf Scroll -->
      <path d="M75,115 C75,85 100,75 110,65 C118,57 125,60 120,70 C115,80 105,88 100,95 C115,95 128,105 125,120 C110,125 90,125 75,115 Z" fill="#FBBF24"/>
      <circle cx="118" cy="65" r="2.5" fill="#581C87"/>
      <!-- Scroll -->
      <rect x="70" y="125" width="60" height="7" rx="3.5" fill="#F59E0B"/>
    `
  },
  uom: {
    code: 'UOM',
    name: 'MORATUWA',
    sub: 'UNIVERSITY OF MORATUWA',
    bg: '#0F172A',
    accent: '#38BDF8',
    secondary: '#94A3B8',
    symbol: `
      <!-- Engineering Cog & Anchor / Compass -->
      <circle cx="100" cy="95" r="26" stroke="#38BDF8" stroke-width="6" fill="none" stroke-dasharray="14 5"/>
      <circle cx="100" cy="95" r="14" fill="#38BDF8"/>
      <polygon points="100,55 106,75 100,72 94,75" fill="#38BDF8"/>
      <polygon points="100,135 106,115 100,118 94,115" fill="#38BDF8"/>
      <polygon points="60,95 80,89 77,95 80,101" fill="#38BDF8"/>
      <polygon points="140,95 120,89 123,95 120,101" fill="#38BDF8"/>
    `
  },
  uoj: {
    code: 'UOJ',
    name: 'JAFFNA',
    sub: 'UNIVERSITY OF JAFFNA',
    bg: '#701A75',
    accent: '#F59E0B',
    secondary: '#FCD34D',
    symbol: `
      <!-- Sacred Nandi & Vilakku Lamp -->
      <ellipse cx="100" cy="105" rx="30" ry="18" fill="#F59E0B"/>
      <circle cx="120" cy="85" r="14" fill="#F59E0B"/>
      <path d="M125,75 L132,66 M115,75 L110,66" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/>
      <path d="M80,105 C75,90 70,80 65,75" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/>
      <!-- Glowing Star -->
      <polygon points="100,45 103,53 111,53 105,58 107,66 100,61 93,66 95,58 89,53 97,53" fill="#FCD34D"/>
    `
  },
  uor: {
    code: 'UOR',
    name: 'RUHUNA',
    sub: 'UNIVERSITY OF RUHUNA',
    bg: '#1E3A8A',
    accent: '#FACC15',
    secondary: '#F59E0B',
    symbol: `
      <!-- Ruhuna Lion Crest & Dagoba Dome -->
      <path d="M100,52 C88,72 84,95 84,120 L116,120 C116,95 112,72 100,52 Z" fill="#FACC15"/>
      <circle cx="100" cy="48" r="4" fill="#FACC15"/>
      <rect x="80" y="120" width="40" height="6" rx="2" fill="#F59E0B"/>
      <circle cx="100" cy="85" r="8" fill="#1E3A8A"/>
    `
  },
  eusl: {
    code: 'EUSL',
    name: 'EASTERN',
    sub: 'EASTERN UNIVERSITY, SRI LANKA',
    bg: '#172554',
    accent: '#38BDF8',
    secondary: '#FBBF24',
    symbol: `
      <!-- Rising Sun over Eastern Ocean -->
      <path d="M60,115 Q100,105 140,115 Q100,125 60,115 Z" fill="#38BDF8"/>
      <path d="M65,125 Q100,118 135,125 Q100,132 65,125 Z" fill="#38BDF8" opacity="0.6"/>
      <circle cx="100" cy="88" r="22" fill="#FBBF24"/>
      <path d="M100,55 L100,63 M125,68 L119,74 M75,68 L81,74 M132,88 L124,88 M68,88 L76,88" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
    `
  },
  seusl: {
    code: 'SEUSL',
    name: 'SOUTH EASTERN',
    sub: 'SOUTH EASTERN UNIVERSITY',
    bg: '#064E3B',
    accent: '#10B981',
    secondary: '#F59E0B',
    symbol: `
      <!-- Islamic Arch & Book of Knowledge -->
      <path d="M75,125 L75,90 C75,70 100,60 100,60 C100,60 125,70 125,90 L125,125 Z" fill="none" stroke="#F59E0B" stroke-width="4"/>
      <!-- Open Book -->
      <path d="M82,105 Q100,100 100,115 Q100,100 118,105 L118,122 Q100,117 100,128 Q100,117 82,122 Z" fill="#10B981"/>
      <circle cx="100" cy="78" r="5" fill="#F59E0B"/>
    `
  },
  rusl: {
    code: 'RUSL',
    name: 'RAJARATA',
    sub: 'RAJARATA UNIVERSITY',
    bg: '#7F1D1D',
    accent: '#F59E0B',
    secondary: '#FCD34D',
    symbol: `
      <!-- Anuradhapura Moonstone & Pillar -->
      <path d="M68,115 C68,85 132,85 132,115 Z" fill="#F59E0B" opacity="0.9"/>
      <rect x="94" y="60" width="12" height="55" fill="#FCD34D"/>
      <polygon points="100,48 112,60 88,60" fill="#F59E0B"/>
      <rect x="75" y="115" width="50" height="6" rx="2" fill="#B45309"/>
    `
  },
  wusl: {
    code: 'WUSL',
    name: 'WAYAMBA',
    sub: 'WAYAMBA UNIVERSITY',
    bg: '#1E3A8A',
    accent: '#60A5FA',
    secondary: '#F3F4F6',
    symbol: `
      <!-- Wayamba Golden Sheaf & Palm -->
      <path d="M100,50 L100,125" stroke="#F3F4F6" stroke-width="4" stroke-linecap="round"/>
      <path d="M80,75 C90,70 95,85 100,90 C95,95 85,85 80,75 Z" fill="#60A5FA"/>
      <path d="M120,75 C110,70 105,85 100,90 C105,95 115,85 120,75 Z" fill="#60A5FA"/>
      <path d="M82,100 C92,95 97,105 100,110 C95,115 87,108 82,100 Z" fill="#60A5FA"/>
      <path d="M118,100 C108,95 103,105 100,110 C105,115 113,108 118,100 Z" fill="#60A5FA"/>
    `
  },
  uwu: {
    code: 'UWU',
    name: 'UVA WELLASSA',
    sub: 'UVA WELLASSA UNIVERSITY',
    bg: '#78350F',
    accent: '#F59E0B',
    secondary: '#FBBF24',
    symbol: `
      <!-- Crystal / Minerals & Mountain Peak -->
      <polygon points="100,48 128,85 100,125 72,85" fill="#F59E0B"/>
      <polygon points="100,48 114,85 100,125" fill="#FBBF24"/>
      <polygon points="100,65 118,85 100,105 82,85" fill="#78350F" opacity="0.4"/>
    `
  },
  ousl: {
    code: 'OUSL',
    name: 'OPEN UNIVERSITY',
    sub: 'OPEN UNIVERSITY OF SRI LANKA',
    bg: '#1E40AF',
    accent: '#FACC15',
    secondary: '#60A5FA',
    symbol: `
      <!-- Open Torch & Globe Latitude Rings -->
      <ellipse cx="100" cy="95" rx="28" ry="16" fill="none" stroke="#60A5FA" stroke-width="3"/>
      <circle cx="100" cy="95" r="28" fill="none" stroke="#60A5FA" stroke-width="2.5"/>
      <polygon points="95,90 105,90 102,125 98,125" fill="#FACC15"/>
      <path d="M100,62 C92,72 90,80 100,88 C110,80 108,72 100,62 Z" fill="#FACC15"/>
      <circle cx="100" cy="78" r="4" fill="#EF4444"/>
    `
  },
  uvpa: {
    code: 'UVPA',
    name: 'VISUAL & PERFORMING',
    sub: 'UNIV. OF VISUAL & PERFORMING ARTS',
    bg: '#831843',
    accent: '#F472B6',
    secondary: '#FCD34D',
    symbol: `
      <!-- Ves Thattuwa Dancer Crown / Headdress -->
      <polygon points="100,48 115,75 100,70 85,75" fill="#FCD34D"/>
      <path d="M70,85 C85,78 115,78 130,85 C120,95 80,95 70,85 Z" fill="#F472B6"/>
      <!-- Drum / Geta Beraya -->
      <ellipse cx="78" cy="115" rx="8" ry="12" fill="#FCD34D"/>
      <ellipse cx="122" cy="115" rx="8" ry="12" fill="#FCD34D"/>
      <path d="M78,103 Q100,97 122,103 L122,127 Q100,133 78,127 Z" fill="#831843" stroke="#FCD34D" stroke-width="3"/>
    `
  }
};

for (const [key, data] of Object.entries(logos)) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bgGrad_${key}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${data.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${data.bg}" stop-opacity="0.95"/>
    </radialGradient>
    <linearGradient id="shieldGrad_${key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${data.accent}"/>
      <stop offset="100%" stop-color="${data.secondary}"/>
    </linearGradient>
    <filter id="glow_${key}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Outer Shield Crest -->
  <path d="M100,10 C155,10 178,25 178,65 C178,135 125,178 100,190 C75,178 22,135 22,65 C22,25 45,10 100,10 Z"
        fill="url(#bgGrad_${key})"
        stroke="url(#shieldGrad_${key})"
        stroke-width="5"
        filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))" />

  <!-- Inner Inset Shield Border -->
  <path d="M100,18 C148,18 168,32 168,68 C168,128 122,168 100,178 C78,168 32,128 32,68 C32,32 52,18 100,18 Z"
        fill="none"
        stroke="${data.accent}"
        stroke-width="1.5"
        stroke-dasharray="4 2"
        opacity="0.6"/>

  <!-- University Specific Emblems -->
  ${data.symbol}

  <!-- Banner Base -->
  <path d="M42,150 L158,150 L146,170 L54,170 Z" fill="#0B132B" stroke="${data.accent}" stroke-width="1.5"/>

  <!-- University Short Code -->
  <text x="100" y="165" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    ${data.code}
  </text>
</svg>`;

  const filePath = path.join(outDir, `${key}.svg`);
  fs.writeFileSync(filePath, svg.trim(), 'utf8');
  console.log(`Generated: ${filePath}`);
}

console.log('All 15 university crests generated successfully!');
