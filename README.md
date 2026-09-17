# CYCLONEX

CYCLONEX is a Next.js-based cyclone monitoring and forecasting dashboard built for monitoring active tropical systems, reviewing historical season data, and exploring AI-assisted satellite analysis.

The app presents a dark-mode operations dashboard with a global cyclone map, tracked systems, forecast information, alert summaries, and analysis workflows designed for meteorological or disaster-response use cases.

## Overview

This project is a front-end prototype and demo platform with mock meteorological data. It is designed to demonstrate:

- real-time style cyclone tracking across multiple basins
- dashboard-based overview of active systems
- detailed cyclones pages with stats, track history, and forecast paths
- alert and warning summaries
- historical season review
- satellite image analysis workflow with generated mock model outputs
- 3D globe visualization for geographic context

## Key Features

### Dashboard and tracking

- Active cyclone overview with selectable systems
- Global visualization using CesiumJS and Resium
- Cyclone cards with wind speed, pressure, category, and status
- Search and filtering by basin or name

### Cyclone detail views

- Current position, wind/pressure metrics, and system metadata
- Forecast cone and track progression
- Forecast confidence markers and current status indicators

### Alerts and warnings

- Severity-based alert feed
- Active warning summaries tied to tracked storms
- Visual status indicators for threat levels

### Historical analysis

- Seasonal archive view
- Basin comparison and historical trend summaries
- Table-driven review of past cyclone events

### AI-style analysis workflow

- Image upload interface for satellite analysis
- Generated cropped cyclone region and pseudo-heatmap overlay
- Estimated intensity, category, pressure, confidence, and model metadata

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CesiumJS / Resium
- MapLibre GL
- Recharts
- Framer Motion
- Lucide React
- Tailwind CSS

## Project Structure

```bash
.
├── app/
│   ├── (app)/
│   │   ├── about/
│   │   ├── alerts/
│   │   ├── analysis/
│   │   ├── cyclones/
│   │   ├── dashboard/
│   │   ├── history/
│   │   └── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── alerts/
│   ├── cyclone/
│   ├── globe/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── api.ts
│   ├── constants.ts
│   ├── mock-data.ts
│   └── utils.ts
├── public/
│   └── cesium/
├── types/
│   └── cyclone.ts
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

## Data Model and API Layer

The app currently uses a mock API layer in `lib/api.ts` backed by sample datasets in `lib/mock-data.ts`.

This means:

- cyclone entries are synthetic but realistic
- alerts are predefined for demo purposes
- AI predictions and satellite analysis results are generated locally
- no live weather provider integration is required to run the app

The project is structured to make it easy to replace the mock API layer with a real backend or external meteorological feeds in the future.

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, yarn, or Bun

### Install dependencies

```bash
npm install
# or
bun install
```

### Run the app

```bash
npm run dev
# or
bun run dev
```

Then open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev     # starts the app in development mode
npm run build   # builds the production bundle
npm run start   # runs the production build
npm run lint    # runs ESLint
```

## Notes

- This project intentionally uses the custom webpack dev command from `package.json` because Cesium assets require extra handling.
- The UI is built as a demonstration/portfolio-style application and not yet connected to a live real-time weather data source.
- Most data is intentionally static/mock to support local development and presentation workflows.

## Future Enhancements

Possible next steps for the project include:

- live API integration with JTWC, NHC, IMD, or NOAA feeds
- real ML/forecast model integration for cyclone intensity and track prediction
- user authentication and saved alert preferences
- persistent database storage for historical and operational records
- deployment to a production environment with monitoring and observability
