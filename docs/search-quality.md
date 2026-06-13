# YouTube Search Quality

Viuwu treats each saved channel as a user-owned YouTube search. The guide favors recent, relevant
videos that work well on a TV instead of simply showing the newest uploads.

## Search Strategy

For each enabled channel, Viuwu:

1. Requests 25 YouTube search candidates ordered by relevance.
2. Limits candidates to uploads from the previous 12 months.
3. Loads content details, canonical snippets, and statistics for those candidates.
4. Ranks candidates locally and displays at most 10 videos.

The app performs one quota-expensive `search.list` request per channel refresh. Filtering and
fallbacks happen locally so quality improvements do not multiply search quota usage.

Guide results remain cached for 15 minutes. The cache key is versioned whenever search or ranking
behavior changes.

## Ranking Signals

The initial scoring model intentionally stays small and testable:

- Full-query matches in the title receive the strongest relevance bonus.
- Individual query-term matches receive a proportional bonus.
- Uploads from the last 30, 90, and 365 days receive decreasing freshness bonuses.
- View count contributes a capped logarithmic bonus.
- A usable thumbnail contributes a small bonus.

YouTube's relevance ordering is preserved as the tie-breaker.

## Shorts And Duration Rules

A video is treated as a likely Short when:

- its duration is under 60 seconds, or
- its title contains `short`, `shorts`, or a matching hashtag.

Likely Shorts are excluded from every result tier. The preferred TV-worthy minimum duration is
three minutes.

## Fallback Behavior

To keep strict filtering from producing accidental empty rows:

1. Use videos at least three minutes long when four or more qualify.
2. Relax the minimum to 90 seconds when four or more qualify.
3. Otherwise show the best available non-Short videos.
4. Show `No strong matches yet.` only when no non-Short candidates remain.

Development builds log candidate, rejection, quality-tier, and displayed-result counts per channel.
This metadata is not shown in the TV interface.

## Known Limitations

- The YouTube Data API does not expose video orientation, so vertical videos cannot be detected
  directly.
- Title-based Shorts detection can reject a long-form video discussing Shorts.
- View counts are a popularity signal, not a guarantee of quality.
- The 12-month window may be too narrow for archival subjects.
- Ranking uses global defaults; per-channel quality controls are not yet exposed.

## Future Tuning

Potential channel-level controls include minimum duration, freshness window, Shorts inclusion,
sort preference, blocked words, and required words. Changes should be driven by observed guide
quality and quota measurements rather than adding settings preemptively.
