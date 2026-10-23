# HydraSense frontend (React + Vite)

The React single-page app for HydraSense. It renders the five screens from the
SRS (Home, Dashboard, Historical Data, Predictions, About) and reads all data
from the FastAPI backend over HTTP.

The pages were initially ported from the Stitch references in
`../stitch_pixel_perfect_ui_clone`; they now share one layout, header and
design tokens so the app looks like a single product.

## Run

```bash
npm install
npm run dev      # http://localhost:5173, /api proxied to 127.0.0.1:8000
npm run build    # production build in dist/
npm run preview  # serve the built app
```

Start the backend first (see the root README). Override the API base with
`VITE_API_BASE` when the API is not reachable through the dev proxy.

## Routes

| Screen | Route | Component |
| --- | --- | --- |
| Home | `/` | `src/pages/Home.jsx` |
| Dashboard | `/dashboard` | `src/pages/Dashboard.jsx` |
| Historical Data | `/historical-data` | `src/pages/HistoricalData.jsx` |
| Predictions | `/predictions` | `src/pages/Predictions.jsx` |
| About | `/about` | `src/pages/About.jsx` |

Unknown paths redirect to Home. `src/App.jsx` resets scroll on navigation.

## Shared chrome

- `src/components/SiteLayout.jsx` — page background, content width
  (`max-w-[1280px]`), spacing and the header slot used by every page.
- `src/components/SiteHeader.jsx` — brand mark, the desktop navigation with one
  active style, and the location control that links to the dashboard filters.
- `src/components/MobileNav.jsx` — bottom navigation for widths below `md`,
  where the desktop header navigation is hidden.

Pages only render their own sections; they must not add another `<header>` or a
page-level background.

## Shared visual tokens

- Brand blue: `brand-600` (`#0066ff`), hover `brand-700` (`#0052cc`).
- Cards: `rounded-2xl border border-slate-200 bg-white shadow-sm`.
- Filter labels: `text-xs font-semibold uppercase tracking-wide text-slate-600`.
- Filter controls: full-width `rounded-xl` border, `px-4 py-2.5`, brand focus ring.
- Page titles: `text-3xl font-bold tracking-tight text-slate-900` with a
  `mt-1.5 text-sm text-slate-500` subtitle.

`tailwind.config.js` defines the `brand` palette and the Inter font stack.
`src/index.css` only keeps the Home hero gradient.

## Data flow

`src/api.js` is the only place that talks to the backend:

- `listLocations`, `listStations`, `checkHealth` load filters and status.
- `getHistoricalReadings` powers the Historical tab and the dashboard chart.
- `makePrediction` returns the per-horizon forecast.
- `formatDate` / `formatLevel` keep display formatting consistent.

## Components

- `GroundwaterChart.jsx` — Chart.js line chart; observed and predicted series
  are visually distinct and the depth axis is inverted.
- `StationMap.jsx` — Google Maps embed for the selected station, with an
  explicit fallback when coordinates are unavailable.

## Reference screens

`scripts/port-reference-pages.mjs` is the one-off converter used for the
original port (it regenerates pages from the Stitch `code.html` files and would
overwrite the current, API-connected versions). It is kept for traceability
only; do not re-run it on the live pages.
