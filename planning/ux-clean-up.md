# Viuwu Search Quality Cleanup Plan for Codex

## Goal

Improve Viuwu channel rows so they feel like real TV-worthy saved-search channels.

Current behavior works, but results can be low quality because the app asks YouTube for only a small number of newest matches and does not filter out Shorts or tiny throwaway videos.

The goal is:

> recent and relevant real videos, not Shorts/slop.

## Current Code Findings

In `apps/tv/src/services/youtubeData.ts`, `searchChannel()` currently calls YouTube search with:

```ts
order: 'date'
maxResults: '8'
type: 'video'
safeSearch: 'moderate'
q: channel.query
```

Then it fetches video details for duration, but only stores formatted duration.

Current problems:

* only 8 candidates are requested
* newest-only can be low relevance
* Shorts are not filtered
* very short videos are not filtered
* duration is formatted but not used as quality signal
* no channel-level quality preferences exist yet
* no retry/fallback strategy exists if filtering removes too many results

## UX Goal

Each channel row should feel like:

* real videos
* useful TV browsing
* relevant to the saved search
* recent enough
* mostly not Shorts
* enough results to fill the row

Avoid showing rows full of:

* Shorts
* 8-second clips
* barely-related results
* low-quality newest-only matches
* empty rows caused by over-filtering

## Search Strategy

Update YouTube loading to fetch more candidates than displayed.

Suggested first pass:

* request `maxResults: 25` or `50`
* filter candidates locally
* display the best 8-12 results per row

This gives Viuwu enough candidates to reject junk.

## YouTube API Improvements

Use `videos.list` with more detail fields.

Fetch:

```ts
part: 'contentDetails,snippet,statistics'
```

Use this to inspect:

* duration
* title
* channel title
* published date
* thumbnails
* view count if available

Keep API quota in mind.

## Duration Filtering

Parse ISO 8601 duration into seconds.

Add helper:

```ts
parseDurationSeconds(duration: string): number
```

Filter out likely Shorts / tiny videos.

Suggested defaults:

* minimum duration: `180` seconds
* maximum duration: optional, maybe none for now
* reject videos under 3 minutes by default

This should be configurable later.

Maybe allow an internal constant:

```ts
const MIN_TV_WORTHY_SECONDS = 180;
```

## Shorts Filtering

Filter likely Shorts using multiple signals:

* duration under 60 seconds
* title contains `#shorts`
* title contains `shorts`
* thumbnail/result patterns if useful
* maybe vertical format is not available from API, so do not rely on it

For now:

```ts
isLikelyShort(video) =
  durationSeconds < 60 ||
  title.toLowerCase().includes('#shorts')
```

Then apply stronger TV-worthy filter:

```ts
durationSeconds >= 180
```

## Relevance Strategy

The current `order: 'date'` prioritizes freshness too hard.

Test these strategies:

### Option A: Relevance first

```ts
order: 'relevance'
publishedAfter: recent cutoff
```

This may produce better rows.

### Option B: Date first with filtering

```ts
order: 'date'
```

Then filter shorts and tiny videos.

### Option C: Hybrid fallback

1. Try recent relevance search.
2. If too few results, try date search.
3. If still too few, relax duration threshold.

Preferred implementation:

* start with a hybrid but keep it simple
* document behavior in `docs/search-quality.md`

## Suggested First Implementation

For each channel:

1. Search YouTube with `order: 'relevance'`, `maxResults: '25'`
2. Optionally include `publishedAfter` for recent results, maybe last 12 months
3. Fetch video details
4. Parse durations
5. Filter out likely Shorts
6. Filter out videos under 3 minutes
7. Sort by a reasonable score
8. Display top 8-12

Scoring can be simple:

* newer is better
* exact query/title matches are better
* higher view count is better if available
* longer than minimum is acceptable, but do not over-reward huge duration

Do not over-engineer this yet.

## Scoring Helper

Create a small helper, maybe:

```text
apps/tv/src/services/youtubeRanking.ts
```

It can expose:

```ts
rankYouTubeVideos(query, videos)
```

Initial scoring idea:

* * title contains full query
* * title contains query terms
* * published within 30/90/365 days
* * has medium/high thumbnail
* * view count logarithmic bonus
* * under 3 minutes
* * likely Shorts
* * title contains `#shorts`

Keep it readable and testable.

## Channel Settings Future-Proofing

Do not build a huge settings UI yet, but structure code so later channels can support:

* minimum duration
* freshness window
* include/exclude Shorts
* result sort preference
* blocked words
* required words

For now, use global defaults.

## Empty Row Behavior

If strict filtering removes everything, do not show a useless blank row.

Fallback behavior:

1. Try strict TV-worthy results.
2. If fewer than 4 results, relax minimum duration to 90 seconds.
3. If still fewer than 4, show best available non-Short results.
4. If still empty, show a compact “No strong matches yet” state.

This prevents channels from feeling broken.

## Data Model Updates

Update `VideoItem` if useful:

```ts
durationSeconds?: number;
publishedAt?: string;
viewCount?: number;
isLikelyShort?: boolean;
qualityReason?: string;
```

Keep UI simple. These fields are mostly for ranking/debugging.

## Debugging / Dev Visibility

Add lightweight debug logging or dev-only metadata so we can tell why videos were rejected.

Do not show this to users by default.

Maybe add internal comments or a temporary console summary:

```text
channel: papercraft video games
candidates: 25
shorts rejected: 9
too short rejected: 7
displayed: 8
```

## Docs

Create:

```text
docs/search-quality.md
```

Include:

* current YouTube search strategy
* Shorts filtering rules
* minimum duration rule
* fallback behavior
* known limitations
* future tuning ideas

Also update:

```text
docs/progress.md
docs/decisions.md
```

## Manual Test Checklist

Test with saved searches like:

* `paper craft video games`
* `godot 4 tutorial`
* `minecraft build ideas`
* `blender geometry nodes`
* `cozy game devlog`

Verify:

* rows have enough thumbnails
* Shorts are mostly gone
* videos feel TV-worthy
* results are still recent enough
* refresh works
* empty states are graceful
* API errors still show cleanly
* cache invalidates when ranking/search behavior changes

## Acceptance Criteria

Done when:

* Viuwu fetches more candidates than it displays
* obvious Shorts are filtered out
* very short videos are filtered out
* rows show higher-quality real videos
* rows usually have enough results
* fallback behavior prevents accidental empty channels
* search/ranking logic is isolated and readable
* docs explain the strategy
* tests are added for duration parsing and ranking/filtering
* CI passes
