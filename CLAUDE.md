# CFA Master — CFA Study Dashboard

## Overview
A CFA Level 1 study dashboard built with React Router v7 (SSR mode) deployed on Cloudflare Workers. Features module-based study tracking, quizzes with score history, flashcards, practice exams, and formula sheets.

## Tech Stack
- **Framework**: React Router v7 (SSR, `ssr: true` in `react-router.config.js`)
- **Runtime**: Cloudflare Workers via `@cloudflare/vite-plugin`
- **Styling**: Tailwind CSS v4 (Vite plugin)
- **Auth & DB**: Firebase Auth (Google + Email/Password) + Firestore
- **Icons**: Lucide React
- **Node**: v22+ required (see `.nvmrc`)

## Key Architecture
- `workers/app.ts` — Cloudflare Worker entry point
- `app/entry.server.tsx` — SSR handler using `renderToReadableStream` (Web Streams API)
- `app/lib/firebase.js` — Firebase client config (hardcoded, not env vars — client keys are public by design)
- `app/context/AuthContext.jsx` — Firebase auth state + Firestore user data persistence
- `app/context/ThemeContext.jsx` — Dark/light theme with Firestore persistence
- `app/routes/` — File-based routing

## Important Constraints
- **Use `firebase/firestore/lite`** everywhere, NOT `firebase/firestore`. The full SDK uses protobufjs which calls `eval()` — blocked by Workers runtime.
- **`nodejs_compat`** flag is required in `wrangler.jsonc` for Firebase to work on Workers.
- **`workers_dev: true`** in `wrangler.jsonc` keeps the `*.workers.dev` URL active alongside custom domains.
- Both `package-lock.json` and `bun.lock` must be committed — Cloudflare Workers Builds CI uses bun.

## Commands
```sh
npm run dev        # Local dev server (uses Cloudflare Workers miniflare)
npm run build      # Production build
npm run preview    # Build + local preview via wrangler
npm run deploy     # Build + deploy to Cloudflare Workers
```

## Deployment
- **Auto-deploy** enabled: push to `master` triggers Cloudflare Workers Builds
- **URLs**: cfa-master.saleeh.workers.dev, cfa-master.com, www.cfa-master.com
- **GitHub**: github.com/SALORG/cfa-app

## Dev Environment
- tmux session `cfa-dev`: window 0 = dev server, window 1 = cloudflared tunnel
- Activate Node 22 before running commands: `source ~/.nvm/nvm.sh && nvm use 22`
