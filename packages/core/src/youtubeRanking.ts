import type { VideoItem } from './types';

export const MIN_TV_WORTHY_SECONDS = 180;
export const RELAXED_MIN_SECONDS = 90;
export const MIN_STRONG_RESULTS = 4;
export const MAX_CHANNEL_RESULTS = 10;

export type YouTubeQualityTier = 'strict' | 'relaxed' | 'non-short' | 'empty';

export interface YouTubeSelection {
  videos: VideoItem[];
  tier: YouTubeQualityTier;
  diagnostics: {
    candidates: number;
    likelyShorts: number;
    underStrictMinimum: number;
    displayed: number;
  };
}

export function parseDurationSeconds(duration: string): number {
  const match = duration.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;

  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);
  return days * 86_400 + hours * 3_600 + minutes * 60 + seconds;
}

export function isLikelyYouTubeShort(title: string, durationSeconds: number): boolean {
  return durationSeconds < 60 || /(?:#|\b)shorts?\b/i.test(title);
}

function normalizedTerms(query: string) {
  return query
    .toLocaleLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((term) => term.length > 1);
}

function publishedAgeDays(publishedAt: string | undefined, now: number) {
  if (!publishedAt) return Number.POSITIVE_INFINITY;
  const publishedTime = Date.parse(publishedAt);
  if (!Number.isFinite(publishedTime)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (now - publishedTime) / 86_400_000);
}

export function scoreYouTubeVideo(query: string, video: VideoItem, now = Date.now()): number {
  const title = video.title.toLocaleLowerCase();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const terms = normalizedTerms(query);
  const matchedTerms = terms.filter((term) => title.includes(term)).length;
  const ageDays = publishedAgeDays(video.publishedAt, now);
  let score = 0;

  if (normalizedQuery && title.includes(normalizedQuery)) score += 45;
  if (terms.length > 0) score += (matchedTerms / terms.length) * 30;
  if (ageDays <= 30) score += 20;
  else if (ageDays <= 90) score += 14;
  else if (ageDays <= 365) score += 7;

  if (video.viewCount && video.viewCount > 0) {
    score += Math.min(18, Math.log10(video.viewCount + 1) * 3);
  }
  if (video.thumbnailUrl) score += 2;

  return score;
}

export function rankYouTubeVideos(
  query: string,
  videos: VideoItem[],
  now = Date.now(),
): VideoItem[] {
  return videos
    .map((video, index) => ({
      index,
      score: scoreYouTubeVideo(query, video, now),
      video,
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ video }) => video);
}

export function selectYouTubeVideos(
  query: string,
  videos: VideoItem[],
  now = Date.now(),
): YouTubeSelection {
  const ranked = rankYouTubeVideos(query, videos, now);
  const nonShort = ranked.filter((video) => !video.isLikelyShort);
  const strict = nonShort.filter((video) => (video.durationSeconds ?? 0) >= MIN_TV_WORTHY_SECONDS);
  const relaxed = nonShort.filter((video) => (video.durationSeconds ?? 0) >= RELAXED_MIN_SECONDS);

  let tier: YouTubeQualityTier;
  let selected: VideoItem[];
  if (strict.length >= MIN_STRONG_RESULTS) {
    tier = 'strict';
    selected = strict;
  } else if (relaxed.length >= MIN_STRONG_RESULTS) {
    tier = 'relaxed';
    selected = relaxed;
  } else if (nonShort.length > 0) {
    tier = 'non-short';
    selected = nonShort;
  } else {
    tier = 'empty';
    selected = [];
  }

  const displayed = selected.slice(0, MAX_CHANNEL_RESULTS);
  return {
    videos: displayed,
    tier,
    diagnostics: {
      candidates: videos.length,
      likelyShorts: videos.filter((video) => video.isLikelyShort).length,
      underStrictMinimum: nonShort.filter(
        (video) => (video.durationSeconds ?? 0) < MIN_TV_WORTHY_SECONDS,
      ).length,
      displayed: displayed.length,
    },
  };
}
