# Residential Master Planning Simulator (v0.9)

Predictive design and yield analysis for residential master planners.

## Tech
- Next.js 14 + React 18 + TypeScript
- Pure TypeScript calc engine (frontage‑weighted road estimator with k)
- Client‑side XLSX (SheetJS) and PDF (pdf-lib) exports

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run in dev

```bash
npm run dev
# open http://localhost:3000
```

3. Build for production

```bash
npm run build
npm start
```

## Project Notes
- Place your logo at `public/kolabs-logo-black.png` (optional `public/kolabs-logo-white.png` as fallback).
- Header shows: title, byline (`v0.9 by Kolabs.Design × HDA × AIM`), and tagline.
- Scenario data persists in `localStorage` (no backend required for MVP).
- Exports:
  - Single Scenario: PDF (branded header), XLSX (Summary + Units/Areas/Efficiency/Assumptions)
  - Comparison: select up to 3 saved scenarios, export to PDF/XLSX

## GitHub: New Repo + First Push

1. Initialize Git

```bash
git init
git add .
git commit -m "feat: MVP simulator v0.9 with exports and comparison"
```

2. Create a new repo on GitHub (via web UI) and copy the remote URL (e.g. `https://github.com/your-org/resiplot.git`).

3. Add remote and push

```bash
git branch -M main
git remote add origin https://github.com/your-org/resiplot.git
git push -u origin main
```

Alternatively, using GitHub CLI (if installed and authenticated):

```bash
gh repo create your-org/resiplot --private --source=. --push --branch=main
```

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run built app
- `npm run clean` – remove `.next` build cache
- `npm run typecheck` – strict type checking

## Folder Structure (high-level)
- `src/app/` – Next.js app router pages/components
- `src/components/` – UI components
- `src/lib/calc/` – calculation types + solver
- `src/lib/export/` – PDF/XLSX export helpers
- `src/lib/persistence/` – localStorage helpers

## License
Internal project (no license specified). Add a license if you plan to open source.

