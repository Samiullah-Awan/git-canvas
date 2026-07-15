# GitCanvas 🎨

> A premium, interactive contribution grid poster generator that turns GitHub activity profiles into beautiful visual art.

GitCanvas allows developers to visualize their coding milestones in a high-resolution portrait print format. Customize themes, geometry, grids, statistics indicators, and shapes to create unique wallpapers or wall-art templates.

---

## Features

- ✨ **Dynamic Visual Art Preview**: Real-time rendering of customizable, portrait-aspect-ratio poster prints.
- 🎨 **Harmonious Neon & Organic Themes**:
  - **Forest Green (Classic)**: Standard green node scaling with deep dark wood vibes.
  - **Vaporwave (Retro-Neon)**: Retro 80s aesthetics featuring electric cyan, neon magenta, and hot pink glows.
  - **Sunset Glow (Warm)**: High contrast yellow, warm orange, and crimson gradients.
  - **Cyberpunk (High Contrast)**: Industrial black backgrounds with high-contrast electric blue and vibrant yellow nodes.
  - **Aurora Borealis (Cosmic)**: Deep space slate blues blended with cosmic emerald green nodes.
- 📐 **Shape Geometry Controls**:
  - *Square*, *Rounded Rectangle*, *Circle*, and *Diamond* shapes.
  - Granular control over node size, grid padding/gap, corner radius, and neon glow intensities.
- 🧪 **Deterministic Seeded Generative Patterns**:
  - Changing usernames dynamically seeds a custom Mulberry32 PRNG to construct a unique, deterministic contribution signature!
  - 5 customizable generative models: *Dynamic Waves*, *Diagonal Energy*, *Center Burst*, *Weekend Retreat*, and *Stochastic Noise*.
- 📊 **Poster Legends & Statistics**: Includes real-time computed data tables showing total commits, active ratios, and longest consecutive contribution streaks, embedded cleanly on the grid poster.
- ⬇️ **High-Resolution Vector Export**: Downloader for scalable vector format (SVG) and 2x pixel-density rasterized image format (PNG) suitable for high-quality printing.

---

## Project Structure

```bash
git-canvas/
├── index.html        # Interactive controller panel UI and poster canvas workspace
├── styles.css        # Premium styles, glassmorphic inputs, and ambient neon backdrops
├── app.js            # Seeded PRNG, SVG compiler, and PNG rasterizer logic
├── package.json      # Vite project config
├── .gitignore        # Node modules and build output exclusions
└── README.md         # Documentation
```

---

## Getting Started

Follow these simple steps to run the application locally:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Installation

1. Open a terminal in the project directory:
   ```powershell
   cd C:\Projects\git-canvas
   ```

2. Install dependencies (Vite):
   ```powershell
   npm install
   ```

3. Launch the local development server:
   ```powershell
   npm run dev
   ```

4. Open the displayed URL (typically `http://localhost:5173`) in your browser to start generating artwork!

---

## Exporting & Printing

- **SVG (Vector)**: The download is standard XML vectors. It preserves typography imports and inline grid geometry, making it infinitely scalable for large canvas poster prints.
- **PNG (High-Res)**: Uses an offscreen 2x scaled HTML5 canvas element with high quality image-smoothing to render crisp rasterized image exports at 2000px × 2800px.
