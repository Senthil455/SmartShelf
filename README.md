# SmartShelf

Monorepo scaffold with a Vite + React client and an Express + SQLite server stub.

## Structure

- `client/` — Vite + React 19 + TypeScript starter (`src/App.tsx`, `src/main.tsx`)
  - `src/components/`, `src/pages/`, `src/context/`, `src/services/`, `src/types/` exist as empty placeholders
  - Scripts: `dev`, `build`, `lint`, `preview`
- `server/` — Express 5 + `better-sqlite3` dependencies declared, `src/` entries currently empty placeholders
- `package.json` — root workspace manifest (no orchestration scripts)

## Prerequisites

- Node.js 18+ (24.x recommended)
- npm 9+

## Setup

```bash
npm --prefix client install
npm --prefix server install
```

## Run

```bash
# client dev server
npm --prefix client run dev

# production build
npm --prefix client run build
```

Server has no runnable entrypoint yet (`server/src/index.js` is empty).

## Status

Early scaffold: client renders the default Vite template; server routes, DB layer, and client feature modules are unimplemented stubs.
