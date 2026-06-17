# Physics Simulations Lab

Interactive 2D physics simulations built with React, TypeScript, and Vite.

## Features

- **Rolling Motion**: Observe objects rolling down inclines with different shapes
- **Ballistic Pendulum**: Watch projectile collision and momentum transfer
- **Kater Pendulum**: Measure gravitational acceleration with reversible pendulum

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
physics-simulations/
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── RollingMotion.tsx
│   │   ├── BallisticPendulum.tsx
│   │   └── KaterPendulum.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Slider.tsx
│   ├── lib/
│   │   └── physics.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Color Palette

- Space Cadet: #1D2951
- Tan: #D4A96A
- Slate Grey: #708090
- Coffee: #6F4E37
- Caput Mortuum: #592720

## Technologies

- React 19
- TypeScript
- Vite
- Canvas API
