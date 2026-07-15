/* -------------------------------------------------------------
 * git-canvas — Interactive Logic & Canvas Generator
 * ------------------------------------------------------------- */

// Theme configurations
const THEMES = {
  forest: {
    bgStart: '#040d06',
    bgEnd: '#091f0f',
    gridBg: 'rgba(9, 31, 15, 0.4)',
    border: '#143c1f',
    textMain: '#e2f0d9',
    textMuted: '#6f9c75',
    colors: [
      '#132418', // level 0
      '#0e6229', // level 1
      '#17a241', // level 2
      '#39d353', // level 3
      '#7bf28d'  // level 4
    ],
    glow: '#39d353',
    glowColor: 'rgba(57, 211, 83, 0.45)',
    accent: '#39d353',
    glowLeft: 'rgba(16, 185, 129, 0.15)',
    glowRight: 'rgba(57, 211, 83, 0.15)'
  },
  vaporwave: {
    bgStart: '#110523',
    bgEnd: '#05010a',
    gridBg: 'rgba(26, 8, 48, 0.3)',
    border: '#f43f5e',
    textMain: '#ff7bf2',
    textMuted: '#06b6d4',
    colors: [
      '#1b1030', // level 0
      '#4c1d95', // level 1
      '#c084fc', // level 2
      '#06b6d4', // level 3
      '#f43f5e'  // level 4
    ],
    glow: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.55)',
    accent: '#f43f5e',
    glowLeft: 'rgba(192, 132, 252, 0.2)',
    glowRight: 'rgba(6, 182, 212, 0.2)'
  },
  sunset: {
    bgStart: '#1d0a11',
    bgEnd: '#070204',
    gridBg: 'rgba(40, 16, 26, 0.3)',
    border: '#ea580c',
    textMain: '#fde047',
    textMuted: '#f43f5e',
    colors: [
      '#241219', // level 0
      '#991b1b', // level 1
      '#dc2626', // level 2
      '#ea580c', // level 3
      '#fbbf24'  // level 4
    ],
    glow: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.5)',
    accent: '#fbbf24',
    glowLeft: 'rgba(239, 68, 68, 0.2)',
    glowRight: 'rgba(249, 115, 22, 0.2)'
  },
  cyberpunk: {
    bgStart: '#000000',
    bgEnd: '#06060c',
    gridBg: 'rgba(16, 16, 24, 0.75)',
    border: '#facc15',
    textMain: '#00f5ff',
    textMuted: '#facc15',
    colors: [
      '#0d0d12', // level 0
      '#004b57', // level 1
      '#00a3b8', // level 2
      '#00f5ff', // level 3
      '#facc15'  // level 4
    ],
    glow: '#00f5ff',
    glowColor: 'rgba(0, 245, 255, 0.65)',
    accent: '#facc15',
    glowLeft: 'rgba(250, 204, 21, 0.15)',
    glowRight: 'rgba(0, 245, 255, 0.2)'
  },
  aurora: {
    bgStart: '#020617',
    bgEnd: '#0b1329',
    gridBg: 'rgba(15, 23, 42, 0.45)',
    border: '#10b981',
    textMain: '#e2e8f0',
    textMuted: '#38bdf8',
    colors: [
      '#0e1424', // level 0
      '#1b2d48', // level 1
      '#047857', // level 2
      '#10b981', // level 3
      '#34d399'  // level 4
    ],
    glow: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.55)',
    accent: '#34d399',
    glowLeft: 'rgba(52, 211, 153, 0.2)',
    glowRight: 'rgba(56, 189, 248, 0.2)'
  }
};

// Application State
const state = {
  username: 'octocat',
  title: 'CODE SCAPE',
  subtitle: '52 WEEKS OF CREATIVE CONTEXT',
  theme: 'vaporwave',
  shape: 'round',
  pattern: 'dynamic',
  cellSize: 14,
  cellGap: 4,
  cornerRadius: 3,
  glowIntensity: 60,
  showStats: true,
  showGrid: true,
  // Mock dataset: 53 columns (weeks), each with 7 items (days)
  contributions: [],
  metrics: {
    totalCommits: 0,
    activeDays: 0,
    longestStreak: 0
  }
};

// Seedable Pseudo-Random Number Generator (Mulberry32 + MurmurHash3 seed)
function hashCode(str) {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = hash << 13 | hash >>> 19;
  }
  return hash;
}

function getPRNG(seedStr) {
  let seed = hashCode(seedStr);
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate Mock Contribution Data
function generateMockData() {
  const prng = getPRNG(state.username + '-' + state.pattern);
  const cols = 53;
  const rows = 7;
  const grid = [];
  let totalCommits = 0;
  let activeDays = 0;
  
  // Array of days to compute streak later
  const flatDays = [];

  for (let c = 0; c < cols; c++) {
    const week = [];
    for (let r = 0; r < rows; r++) {
      let val = 0;
      
      switch (state.pattern) {
        case 'dynamic': {
          const wave1 = Math.sin(c * 0.16) * Math.cos(r * 0.45);
          const wave2 = Math.cos(c * 0.08 + r * 0.25) * 0.7;
          const noise = prng() * 0.4;
          val = (wave1 + wave2 + noise + 1.2) / 3.0; // Normalized 0..1
          break;
        }
        case 'stripes': {
          const diag = Math.sin((c + r) * 0.35) * 1.1;
          const noise = prng() * 0.5;
          val = (diag + noise + 1.0) / 2.6;
          break;
        }
        case 'burst': {
          const dx = (c - 26) / 26;
          const dy = (r - 3) / 3;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const burst = Math.max(0, 1.25 - dist * 1.6);
          const noise = prng() * 0.45;
          val = (burst + noise) / 1.7;
          break;
        }
        case 'weekend': {
          const isWeekend = (r === 0 || r === 6);
          const base = isWeekend ? 0.05 : 0.6;
          const noise = prng() * 0.55;
          val = base + noise;
          break;
        }
        case 'random':
        default: {
          val = prng();
          break;
        }
      }

      // Clamp value
      val = Math.max(0, Math.min(1, val));
      
      // Determine commit intensity level 0..4
      let level = 0;
      if (val > 0.8) level = 4;
      else if (val > 0.55) level = 3;
      else if (val > 0.32) level = 2;
      else if (val > 0.12) level = 1;

      // Calculate mock commit count
      let commits = 0;
      if (level === 1) commits = Math.floor(prng() * 2) + 1; // 1..2
      else if (level === 2) commits = Math.floor(prng() * 3) + 3; // 3..5
      else if (level === 3) commits = Math.floor(prng() * 3) + 6; // 6..8
      else if (level === 4) commits = Math.floor(prng() * 6) + 9; // 9..14

      totalCommits += commits;
      if (commits > 0) activeDays++;
      
      week.push({ level, commits });
      flatDays.push(commits > 0);
    }
    grid.push(week);
  }

  // Calculate longest streak
  let maxStreak = 0;
  let currentStreak = 0;
  for (let active of flatDays) {
    if (active) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  state.contributions = grid;
  state.metrics = {
    totalCommits,
    activeDays,
    longestStreak: maxStreak
  };

  // Update DOM indicators
  document.getElementById('display-commits').innerText = totalCommits.toLocaleString();
  document.getElementById('display-days').innerText = `${activeDays} / 371`;
  document.getElementById('display-streak').innerText = `${maxStreak} days`;
}

// Generate the Poster SVG Content
function generateSVGString() {
  const theme = THEMES[state.theme];
  const posterW = 1000;
  const posterH = 1400;
  
  // Calculate Grid sizes
  const gridColCount = 53;
  const gridRowCount = 7;
  const gridW = gridColCount * state.cellSize + (gridColCount - 1) * state.cellGap;
  const gridH = gridRowCount * state.cellSize + (gridRowCount - 1) * state.cellGap;
  
  // Center coordinates for Grid
  const gridX = (posterW - gridW) / 2;
  const gridY = 520; // Pushed down to leave room for artwork/header

  // Glow filter configuration
  const glowDev = (state.glowIntensity / 100) * 4;
  const hasGlow = state.glowIntensity > 0;

  let nodesSVG = '';

  for (let c = 0; c < gridColCount; c++) {
    for (let r = 0; r < gridRowCount; r++) {
      const cell = state.contributions[c][r];
      const color = theme.colors[cell.level];
      
      const x = gridX + c * (state.cellSize + state.cellGap);
      const y = gridY + r * (state.cellSize + state.cellGap);

      // Node styling & attributes
      let filterAttr = '';
      if (hasGlow && cell.level >= 3) {
        filterAttr = 'filter="url(#glow-filter)"';
      }

      // Draw depending on shape
      if (state.shape === 'circle') {
        const cx = x + state.cellSize / 2;
        const cy = y + state.cellSize / 2;
        const radius = state.cellSize / 2;
        nodesSVG += `      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" ${filterAttr} />\n`;
      } 
      else if (state.shape === 'diamond') {
        const cx = x + state.cellSize / 2;
        const cy = y + state.cellSize / 2;
        const half = state.cellSize / 2;
        const p1 = `${cx},${y}`; // Top
        const p2 = `${x + state.cellSize},${cy}`; // Right
        const p3 = `${cx},${y + state.cellSize}`; // Bottom
        const p4 = `${x},${cy}`; // Left
        nodesSVG += `      <polygon points="${p1} ${p2} ${p3} ${p4}" fill="${color}" ${filterAttr} />\n`;
      } 
      else if (state.shape === 'round') {
        const rad = Math.min(state.cornerRadius, state.cellSize / 2);
        nodesSVG += `      <rect x="${x}" y="${y}" width="${state.cellSize}" height="${state.cellSize}" rx="${rad}" ry="${rad}" fill="${color}" ${filterAttr} />\n`;
      } 
      else { // square
        nodesSVG += `      <rect x="${x}" y="${y}" width="${state.cellSize}" height="${state.cellSize}" fill="${color}" ${filterAttr} />\n`;
      }
    }
  }

  // Draw Legend items
  const legendItemW = state.cellSize;
  const legendGap = state.cellGap;
  const legendW = 5 * legendItemW + 4 * legendGap + 120; // 5 blocks + spaces + labels text
  const legendX = (posterW - legendW) / 2;
  const legendY = gridY + gridH + 60;

  let legendSVG = '';
  if (state.showStats) {
    legendSVG = `
    <!-- Color Legend -->
    <g transform="translate(${legendX}, ${legendY})">
      <text x="0" y="${legendItemW - 3}" font-family="'Inter', sans-serif" font-size="12" fill="${theme.textMuted}" opacity="0.8">Less</text>
      <g transform="translate(45, 0)">
    `;
    
    for (let l = 0; l < 5; l++) {
      const lx = l * (legendItemW + legendGap);
      const color = theme.colors[l];
      let filterAttr = '';
      if (hasGlow && l >= 3) {
        filterAttr = 'filter="url(#glow-filter)"';
      }

      if (state.shape === 'circle') {
        legendSVG += `        <circle cx="${lx + legendItemW/2}" cy="${legendItemW/2}" r="${legendItemW/2}" fill="${color}" ${filterAttr} />\n`;
      } else if (state.shape === 'diamond') {
        const cx = lx + legendItemW/2;
        const cy = legendItemW/2;
        const half = legendItemW/2;
        legendSVG += `        <polygon points="${cx},0 ${lx + legendItemW},${cy} ${cx},${legendItemW} ${lx},${cy}" fill="${color}" ${filterAttr} />\n`;
      } else if (state.shape === 'round') {
        const rad = Math.min(state.cornerRadius, legendItemW / 2);
        legendSVG += `        <rect x="${lx}" y="0" width="${legendItemW}" height="${legendItemW}" rx="${rad}" ry="${rad}" fill="${color}" ${filterAttr} />\n`;
      } else {
        legendSVG += `        <rect x="${lx}" y="0" width="${legendItemW}" height="${legendItemW}" fill="${color}" ${filterAttr} />\n`;
      }
    }

    legendSVG += `
      </g>
      <text x="${45 + 5 * legendItemW + 4 * legendGap + 15}" y="${legendItemW - 3}" font-family="'Inter', sans-serif" font-size="12" fill="${theme.textMuted}" opacity="0.8">More</text>
    </g>
    `;
  }

  // Draw Statistics Grid
  let statsSVG = '';
  if (state.showStats) {
    const statsY = legendY + 80;
    const colOffset = 250;
    const startX = (posterW - colOffset * 2) / 2;

    statsSVG = `
    <!-- Poster Statistics -->
    <g transform="translate(0, ${statsY})">
      <!-- Divider -->
      <line x1="150" y1="0" x2="850" y2="0" stroke="${theme.border}" stroke-width="1" opacity="0.3" />
      
      <!-- Stat 1 -->
      <g transform="translate(${startX}, 50)">
        <text x="0" y="0" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="36" font-weight="700" fill="${theme.accent}">${state.metrics.totalCommits.toLocaleString()}</text>
        <text x="0" y="24" text-anchor="middle" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="${theme.textMuted}" letter-spacing="1">TOTAL COMMITS</text>
      </g>
      
      <!-- Stat 2 -->
      <g transform="translate(${startX + colOffset}, 50)">
        <text x="0" y="0" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="36" font-weight="700" fill="${theme.textMain}">${state.metrics.activeDays}</text>
        <text x="0" y="24" text-anchor="middle" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="${theme.textMuted}" letter-spacing="1">ACTIVE DAYS</text>
      </g>
      
      <!-- Stat 3 -->
      <g transform="translate(${startX + colOffset * 2}, 50)">
        <text x="0" y="0" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="36" font-weight="700" fill="${theme.accent}">${state.metrics.longestStreak} Days</text>
        <text x="0" y="24" text-anchor="middle" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="${theme.textMuted}" letter-spacing="1">LONGEST STREAK</text>
      </g>
    </g>
    `;
  }

  // Draw background grid pattern
  let decorativeGrid = '';
  if (state.showGrid) {
    decorativeGrid = `
    <!-- Decorative Grid Overlay -->
    <g opacity="0.04" stroke="${theme.textMain}" stroke-width="1">
      <path d="M 50,0 L 50,1400 M 100,0 L 100,1400 M 150,0 L 150,1400 M 200,0 L 200,1400 M 250,0 L 250,1400 M 300,0 L 300,1400 M 350,0 L 350,1400 M 400,0 L 400,1400 M 450,0 L 450,1400 M 500,0 L 500,1400 M 550,0 L 550,1400 M 600,0 L 600,1400 M 650,0 L 650,1400 M 700,0 L 700,1400 M 750,0 L 750,1400 M 800,0 L 800,1400 M 850,0 L 850,1400 M 900,0 L 900,1400 M 950,0 L 950,1400" />
      <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 0,400 L 1000,400 M 0,500 L 1000,500 M 0,600 L 1000,600 M 0,700 L 1000,700 M 0,800 L 1000,800 M 0,900 L 1000,900 M 0,1000 L 1000,1000 M 0,1100 L 1000,1100 M 0,1200 L 1000,1200 M 0,1300 L 1000,1300" />
    </g>
    `;
  }

  // Draw Artwork Accent in Header (abstract vector mesh or lines)
  const artworkSVG = `
  <!-- Abstract Header Artwork -->
  <g opacity="0.12" stroke="url(#accent-gradient)" stroke-width="1.5" fill="none">
    <path d="M 75,340 Q 250,220 500,340 T 925,340" />
    <path d="M 75,355 Q 250,235 500,355 T 925,355" />
    <path d="M 75,370 Q 250,250 500,370 T 925,370" />
  </g>
  `;

  // Return full composite SVG string
  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${posterW} ${posterH}" width="${posterW}" height="${posterH}">
  <defs>
    <!-- Fonts import -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&amp;family=Inter:wght@400;500;600;700&amp;family=Fira+Code:wght@400;500&amp;display=swap');
      
      .text-title {
        font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
        font-weight: 700;
        fill: ${theme.textMain};
      }
      .text-subtitle {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-weight: 500;
        fill: ${theme.textMuted};
      }
      .text-mono {
        font-family: 'Fira Code', 'Courier New', monospace;
      }
    </style>

    <!-- Background Gradient -->
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}" />
      <stop offset="100%" stop-color="${theme.bgEnd}" />
    </linearGradient>

    <!-- Accent Gradient -->
    <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="50%" stop-color="${theme.textMain}" />
      <stop offset="100%" stop-color="${theme.colors[1]}" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glowDev}" result="blur1" />
      <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Background -->
  <rect width="${posterW}" height="${posterH}" fill="url(#bg-gradient)" />
  
  ${decorativeGrid}

  <!-- Double Border Frame -->
  <rect x="30" y="30" width="${posterW - 60}" height="${posterH - 60}" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.15" />
  <rect x="40" y="40" width="${posterW - 80}" height="${posterH - 80}" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.25" />

  <!-- Poster Header -->
  <g transform="translate(0, 0)">
    <!-- Main Title -->
    <text x="75" y="145" class="text-title" font-size="54" letter-spacing="-1.5">${state.title.toUpperCase()}</text>
    
    <!-- Subtitle -->
    <text x="75" y="195" class="text-subtitle" font-size="14" letter-spacing="4" opacity="0.85">${state.subtitle.toUpperCase()}</text>
    
    <!-- Decorative Line -->
    <line x1="75" y1="230" x2="350" y2="230" stroke="${theme.accent}" stroke-width="3" />

    <!-- User Identity Block -->
    <g transform="translate(${posterW - 75}, 145)">
      <text x="0" y="0" text-anchor="end" class="text-mono" font-size="12" fill="${theme.textMuted}" opacity="0.7">GENERATED FOR // </text>
      <text x="0" y="24" text-anchor="end" class="text-mono" font-size="20" font-weight="500" fill="${theme.accent}">@${state.username.toLowerCase()}</text>
      
      <text x="0" y="60" text-anchor="end" class="text-mono" font-size="10" fill="${theme.textMuted}" opacity="0.5">DATE OF RECORD: 2026-07-15</text>
    </g>
  </g>

  ${artworkSVG}

  <!-- Contributions Grid Card Panel -->
  <g transform="translate(0, 0)">
    <!-- Grid Panel Background Card -->
    <rect x="${gridX - 40}" y="${gridY - 40}" width="${gridW + 80}" height="${gridH + 80}" fill="${theme.gridBg}" rx="16" ry="16" stroke="${theme.border}" stroke-width="1.5" />
    
    <!-- Left Hand Weekday Indicator Labels -->
    <g transform="translate(${gridX - 65}, ${gridY + state.cellSize/2})" font-family="'Inter', sans-serif" font-size="10" fill="${theme.textMuted}" opacity="0.6" text-anchor="middle">
      <text x="0" y="${1 * (state.cellSize + state.cellGap) + 3}">Mon</text>
      <text x="0" y="${3 * (state.cellSize + state.cellGap) + 3}">Wed</text>
      <text x="0" y="${5 * (state.cellSize + state.cellGap) + 3}">Fri</text>
    </g>

    <!-- Grid Nodes -->
    <g>
${nodesSVG}    </g>
  </g>

  ${legendSVG}

  ${statsSVG}

  <!-- Footer Watermark / Metadata -->
  <g transform="translate(0, ${posterH - 75})">
    <line x1="75" y1="0" x2="${posterW - 75}" y2="0" stroke="${theme.border}" stroke-width="1" opacity="0.2" />
    <text x="75" y="30" class="text-mono" font-size="10" fill="${theme.textMuted}" opacity="0.5">GIT-CANVAS POSTER DESIGN SERIES // VOL. 01</text>
    <text x="${posterW - 75}" y="30" text-anchor="end" class="text-mono" font-size="10" fill="${theme.textMuted}" opacity="0.5">CREATIVE CODE LABS // ALL RIGHTS RESERVED</text>
  </g>

</svg>
`;
}

// Render SVG inside the preview pane
function updatePreview() {
  const container = document.getElementById('canvas-container');
  const svgString = generateSVGString();
  container.innerHTML = svgString;

  // Dynamically update ambient glow colors of the UI based on selected theme
  const root = document.documentElement;
  const themeConfig = THEMES[state.theme];
  root.style.setProperty('--glow-left', themeConfig.glowLeft);
  root.style.setProperty('--glow-right', themeConfig.glowRight);
  root.style.setProperty('--primary', themeConfig.colors[3]);
  root.style.setProperty('--primary-glow', themeConfig.glowColor);
  root.style.setProperty('--border-focus', themeConfig.accent);
}

// Download SVG Trigger
function downloadSVG() {
  const svgString = generateSVGString();
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.username.toLowerCase()}-git-canvas.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download PNG Trigger via high-res canvas
function downloadPNG() {
  const svgEl = document.querySelector('#canvas-container svg');
  if (!svgEl) return;

  const svgString = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function() {
    // Canvas dimensions matched to SVG resolution, multiplied by 2x for printing crispness
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = 1000 * scale;
    canvas.height = 1400 * scale;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear and draw SVG onto canvas
    ctx.fillStyle = THEMES[state.theme].bgEnd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Trigger download
    canvas.toBlob(function(blob) {
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${state.username.toLowerCase()}-git-canvas.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');

    URL.revokeObjectURL(url);
  };
  
  img.src = url;
}

// Setup all interactive listeners and bindings
function init() {
  // Bind Cache Elements
  const inputUsername = document.getElementById('input-username');
  const inputTitle = document.getElementById('input-title');
  const inputSubtitle = document.getElementById('input-subtitle');
  
  const selectTheme = document.getElementById('select-theme');
  const selectShape = document.getElementById('select-shape');
  const selectPattern = document.getElementById('select-pattern');
  
  const sliderSize = document.getElementById('slider-size');
  const sliderGap = document.getElementById('slider-gap');
  const sliderRadius = document.getElementById('slider-radius');
  const sliderGlow = document.getElementById('slider-glow');
  
  const checkStats = document.getElementById('check-stats');
  const checkGrid = document.getElementById('check-grid');
  
  const btnRegenerate = document.getElementById('btn-regenerate');
  const btnDownloadSVG = document.getElementById('btn-download-svg');
  const btnDownloadPNG = document.getElementById('btn-download-png');
  
  const radiusGroup = document.getElementById('radius-group');

  // Sync initial DOM settings with state
  state.username = inputUsername.value;
  state.title = inputTitle.value;
  state.subtitle = inputSubtitle.value;
  state.theme = selectTheme.value;
  state.shape = selectShape.value;
  state.pattern = selectPattern.value;
  state.cellSize = parseInt(sliderSize.value);
  state.cellGap = parseInt(sliderGap.value);
  state.cornerRadius = parseInt(sliderRadius.value);
  state.glowIntensity = parseInt(sliderGlow.value);
  state.showStats = checkStats.checked;
  state.showGrid = checkGrid.checked;

  // Toggle radius controller visibility depending on shape
  const updateRadiusControl = () => {
    if (state.shape === 'round') {
      radiusGroup.style.display = 'flex';
    } else {
      radiusGroup.style.display = 'none';
    }
  };
  updateRadiusControl();

  // Set Slider label updates
  const updateLabel = (id, text) => {
    document.getElementById(id).innerText = text;
  };
  
  updateLabel('val-size', `${state.cellSize}px`);
  updateLabel('val-gap', `${state.cellGap}px`);
  updateLabel('val-radius', `${state.cornerRadius}px`);
  updateLabel('val-glow', `${state.glowIntensity}%`);

  // Event bindings
  inputUsername.addEventListener('input', (e) => {
    state.username = e.target.value.trim() || 'username';
    generateMockData();
    updatePreview();
  });

  inputTitle.addEventListener('input', (e) => {
    state.title = e.target.value || 'TITLE';
    updatePreview();
  });

  inputSubtitle.addEventListener('input', (e) => {
    state.subtitle = e.target.value || 'SUBTITLE';
    updatePreview();
  });

  selectTheme.addEventListener('change', (e) => {
    state.theme = e.target.value;
    updatePreview();
  });

  selectShape.addEventListener('change', (e) => {
    state.shape = e.target.value;
    updateRadiusControl();
    updatePreview();
  });

  selectPattern.addEventListener('change', (e) => {
    state.pattern = e.target.value;
    generateMockData();
    updatePreview();
  });

  sliderSize.addEventListener('input', (e) => {
    state.cellSize = parseInt(e.target.value);
    updateLabel('val-size', `${state.cellSize}px`);
    updatePreview();
  });

  sliderGap.addEventListener('input', (e) => {
    state.cellGap = parseInt(e.target.value);
    updateLabel('val-gap', `${state.cellGap}px`);
    updatePreview();
  });

  sliderRadius.addEventListener('input', (e) => {
    state.cornerRadius = parseInt(e.target.value);
    updateLabel('val-radius', `${state.cornerRadius}px`);
    updatePreview();
  });

  sliderGlow.addEventListener('input', (e) => {
    state.glowIntensity = parseInt(e.target.value);
    updateLabel('val-glow', `${state.glowIntensity}%`);
    updatePreview();
  });

  checkStats.addEventListener('change', (e) => {
    state.showStats = e.target.checked;
    updatePreview();
  });

  checkGrid.addEventListener('change', (e) => {
    state.showGrid = e.target.checked;
    updatePreview();
  });

  btnRegenerate.addEventListener('click', () => {
    // Add a fast spin animation to the button icon
    const icon = btnRegenerate.querySelector('svg');
    icon.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      icon.style.transition = 'none';
      icon.style.transform = 'rotate(0deg)';
    }, 500);

    generateMockData();
    updatePreview();
  });

  btnDownloadSVG.addEventListener('click', downloadSVG);
  btnDownloadPNG.addEventListener('click', downloadPNG);

  // Generate initial contributions and preview render
  generateMockData();
  updatePreview();
}

// Kickstart initialization on load
window.addEventListener('DOMContentLoaded', init);
