# Architecture

## Boundaries

The npm-workspace monorepo has two applications and two shared packages:

- `apps/tv` owns native presentation, remote focus, and screen navigation.
- `apps/site` owns public product communication and GitHub Pages output.
- `packages/core` owns entities, provider contracts, guide construction, and fixtures.
- `packages/brand` owns color, spacing, radius, and asset conventions.

Applications may depend on shared packages. Shared packages do not depend on applications.

## Domain Model

`SavedSearch` stores user intent. `SearchChannel` gives that intent a place and state in the guide.
`VideoProvider` describes a source without leaking a vendor API into the model. `VideoItem` is the
normalized result. `GuideRow` combines a channel with results, and `UserGuide` is the ordered home
experience.

Live providers will implement a search adapter that normalizes vendor results before guide
construction. Persistence should store stable user intent and provider identifiers, not raw API
responses.

## TV App

Expo SDK 56 supplies the build system. `react-native-tvos` supplies Android TV and Apple TV focus
support, and `@react-native-tvos/config-tv` applies native project changes during prebuild.
Generated native folders remain untracked.

The first milestone uses local screen state and mock data. Screen, navigation, guide-row, and
focusable-card boundaries are already separated for later routing and data integration.

## Site And Delivery

The landing site is a small Vite TypeScript application with no runtime framework. Vite outputs
static files to `apps/site/dist`. GitHub Actions validates the monorepo and deploys that directory
to Pages on changes to `main`.
