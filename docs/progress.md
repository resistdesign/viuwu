# Progress

## Current Status

The YouTube-only Android TV application is functional end to end on physical hardware.

## Completed

- Product brief and editable source brand assets captured on `main`.
- Public GitHub repository created.
- Monorepo architecture and working agreement defined.
- Shared YouTube guide domain package and brand tokens implemented.
- Landing site and TV app source implemented.
- CI, GitHub Pages workflow, Pages environment, and `main` branch protection configured.
- Production domain `viuwu.resist.design` configured with a committed deployment `CNAME` and HTTPS.
- Landing site deployed successfully at `https://viuwu.resist.design/`; HTTP redirects to HTTPS.
- Formatting, linting, type checks, core tests, site build, responsive browser review, and Android
  TV native prebuild completed.
- Preview APK built, installed, launched, and visually verified on a Philips 4K Android 11 TV at
  `192.168.1.170`.
- YouTube-only first-launch gate, secure token storage, refresh, and disconnect behavior
  implemented.
- Signed `0.1.1` APK built and installed on the physical TV; missing-credential gate visually
  verified at 1920x1080.
- Google TV OAuth client ID configured in a git-ignored local environment file and GitHub Actions.
- Google's device endpoint accepted the credential, and the signed app displayed a live activation
  code on the physical TV.
- First-launch authorization now displays a QR code that opens Google's device page with the
  current code prefilled; the manual URL and code remain as fallback.
- Removed all fixture data and fixture exports from the applications and core package.
- Added persisted user-created channels and production empty, loading, and API error states.
- Live YouTube Data API search results, thumbnails, creators, durations, and publish ages now fill
  the guide.
- Selecting a result opens the official YouTube TV application, with browser fallback when YouTube
  is unavailable.
- Signed `0.2.0` production candidate installed on the physical TV. Live search, persisted channel
  state, direct YouTube TV launch, and playback were verified end to end.
- YouTube channel search now evaluates 25 recent relevance-ranked candidates, filters likely Shorts
  and tiny videos, uses duration fallbacks to preserve useful rows, and exposes test-covered ranking
  logic plus development diagnostics.
- Android TV launch branding now uses the Viuwu icon on the splash screen and the full logo for the
  launcher artwork.
- Signed `0.2.0` release published through the tag-driven GitHub Actions workflow.
- Signed `0.2.1` release published and installed on the physical TV. Search ranking, persisted
  channels, YouTube session continuity, and long-form guide results were verified.

## Active

- Publish and install `0.2.2` with the TV banner applied directly to the Leanback activity for
  launcher compatibility.

## Next

- Add channel editing and reordering.
- Add pagination controls for deeper result browsing.
- Monitor YouTube Data API quota consumption in production.

## Known Blockers

- Expo Doctor reports the core `react-native` package nested under
  `@react-native-tvos/virtualized-lists`; Android TV prebuild succeeds and this is tracked as an
  upstream TV-fork packaging warning.

## Handoff

Start with `AGENTS.md`, then inspect this file, `docs/decisions.md`, the current branch, and the
active pull request.
