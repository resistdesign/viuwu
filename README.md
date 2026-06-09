# Viuwu

**Do you. Viuwu.**

Viuwu is a TV-first video guide where saved searches become channels. It replaces passive,
algorithmic browsing with a guide each person names, orders, and controls.

## Quick Start

Requires Node.js 22+ and npm 10+.

```bash
npm install
npm run dev:site
```

Open the printed local URL to view the landing site.

For the Android TV app:

```bash
npm run dev:tv
npm run prebuild:tv --workspace @viuwu/tv
npm run android --workspace @viuwu/tv
```

The Android command requires Android Studio and an Android TV emulator or device.

## Quality Commands

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

## Repository

- `apps/tv`: Expo SDK 56 app using the React Native TV fork.
- `apps/site`: Vite-built static landing site deployed to GitHub Pages.
- `packages/core`: provider-neutral guide model and first-milestone fixtures.
- `packages/brand`: shared visual tokens and source brand assets.
- `docs`: product, architecture, decisions, progress, and GitHub operations.

## Contribution Flow

Create a focused branch from `main`, keep documentation current, run `npm run check`, and
open a pull request. See [AGENTS.md](AGENTS.md) for the full working agreement.
