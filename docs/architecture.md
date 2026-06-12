# Architecture

## Boundaries

The npm-workspace monorepo has two applications and two shared packages:

- `apps/tv` owns native presentation, remote focus, and screen navigation.
- `apps/site` owns public product communication and GitHub Pages output.
- `packages/core` owns YouTube guide entities, guide construction, and fixtures.
- `packages/brand` owns color, spacing, radius, and asset conventions.

Applications may depend on shared packages. Shared packages do not depend on applications.

## Domain Model

`SavedSearch` stores user intent. `SearchChannel` gives that intent a place and state in the guide.
`VideoItem` identifies a YouTube result. `GuideRow` combines a channel with results, and `UserGuide`
is the ordered home experience. Persistence should store stable user intent and YouTube video
identifiers, not raw API responses.

## TV App

Expo SDK 56 supplies the build system. `react-native-tvos` supplies Android TV and Apple TV focus
support, and `@react-native-tvos/config-tv` applies native project changes during prebuild.
Generated native folders remain untracked.

Tagged releases regenerate the Android project in GitHub Actions and sign the APK with a dedicated
release key stored only in repository secrets. This keeps the native project reproducible while
preserving a stable Android upgrade identity.

The app requires a YouTube account on first launch. Google's TV device authorization flow stores
tokens in the platform secure store and refreshes an existing session at startup. Guide content is
still fixture-backed until YouTube search and playback are connected.

## Site And Delivery

The landing site is a small Vite TypeScript application with no runtime framework. Vite outputs
static files to `apps/site/dist`. GitHub Actions validates the monorepo and deploys that directory
to Pages on changes to `main`.
