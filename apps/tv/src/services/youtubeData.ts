import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  isLikelyYouTubeShort,
  parseDurationSeconds,
  selectYouTubeVideos,
  type UserChannel,
  type VideoItem,
} from '@viuwu/core';

import type { YouTubeSession } from './youtubeAuth';

const API_ROOT = 'https://www.googleapis.com/youtube/v3';
const CACHE_KEY = 'viuwu.youtube.guide-cache.v2';
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;
const SEARCH_CANDIDATE_COUNT = '25';
const FRESHNESS_WINDOW_MS = 365 * 86_400_000;

interface SearchItem {
  id: { videoId?: string };
}

interface VideoDetailsItem {
  id: string;
  contentDetails?: { duration?: string };
  snippet?: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
  statistics?: { viewCount?: string };
}

interface SearchResponse {
  items?: SearchItem[];
  error?: { message?: string };
}

interface VideosResponse {
  items?: VideoDetailsItem[];
  error?: { message?: string };
}

interface GuideCache {
  fetchedAt: number;
  signature: string;
  videosByChannel: Record<string, VideoItem[]>;
}

function decodeHtml(value: string) {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>',
  };
  return value.replace(/&(?:amp|quot|#39|lt|gt);/g, (entity) => entities[entity] ?? entity);
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds <= 0) return '';
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatPublished(value: string) {
  const ageDays = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 86_400_000));
  if (ageDays === 0) return 'Today';
  if (ageDays === 1) return 'Yesterday';
  if (ageDays < 7) return `${ageDays} days ago`;
  if (ageDays < 35) return `${Math.floor(ageDays / 7)} weeks ago`;
  if (ageDays < 365) return `${Math.floor(ageDays / 30)} months ago`;
  return `${Math.floor(ageDays / 365)} years ago`;
}

async function youtubeGet<T extends { error?: { message?: string } }>(
  path: string,
  params: Record<string, string>,
  session: YouTubeSession,
): Promise<T> {
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const response = await fetch(`${API_ROOT}/${path}?${query}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const payload = (await response.json()) as T;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `YouTube request failed (${response.status}).`);
  }
  return payload;
}

async function searchChannel(channel: UserChannel, session: YouTubeSession) {
  const publishedAfter = new Date(Date.now() - FRESHNESS_WINDOW_MS).toISOString();
  const search = await youtubeGet<SearchResponse>(
    'search',
    {
      part: 'snippet',
      type: 'video',
      order: 'relevance',
      maxResults: SEARCH_CANDIDATE_COUNT,
      publishedAfter,
      q: channel.query,
      safeSearch: 'moderate',
    },
    session,
  );
  const items = (search.items ?? []).filter((item) => item.id.videoId);
  if (items.length === 0) return [];

  const ids = items.map((item) => item.id.videoId!).join(',');
  const details = await youtubeGet<VideosResponse>(
    'videos',
    { part: 'contentDetails,snippet,statistics', id: ids },
    session,
  );
  const detailsById = new Map((details.items ?? []).map((item) => [item.id, item]));
  const candidates = items.flatMap<VideoItem>((item) => {
    const videoId = item.id.videoId!;
    const detail = detailsById.get(videoId);
    const snippet = detail?.snippet;
    if (!snippet) return [];

    const durationSeconds = parseDurationSeconds(detail.contentDetails?.duration ?? '');
    const title = decodeHtml(snippet.title);
    const parsedViewCount = Number(detail.statistics?.viewCount);
    return [
      {
        id: videoId,
        youtubeVideoId: videoId,
        title,
        creator: decodeHtml(snippet.channelTitle),
        duration: formatDuration(durationSeconds),
        durationSeconds,
        publishedAt: snippet.publishedAt,
        publishedLabel: formatPublished(snippet.publishedAt),
        thumbnailUrl:
          snippet.thumbnails.high?.url ??
          snippet.thumbnails.medium?.url ??
          snippet.thumbnails.default?.url ??
          `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        viewCount: Number.isFinite(parsedViewCount) ? parsedViewCount : undefined,
        isLikelyShort: isLikelyYouTubeShort(title, durationSeconds),
      },
    ];
  });

  const selection = selectYouTubeVideos(channel.query, candidates);
  if (__DEV__) {
    console.info('[YouTube quality]', {
      channel: channel.query,
      tier: selection.tier,
      ...selection.diagnostics,
    });
  }
  return selection.videos;
}

function channelSignature(channels: UserChannel[]) {
  return channels
    .filter((channel) => channel.enabled)
    .map((channel) => `${channel.id}:${channel.query}`)
    .join('|');
}

export async function loadYouTubeGuide(
  channels: UserChannel[],
  session: YouTubeSession,
  forceRefresh = false,
) {
  const signature = channelSignature(channels);
  if (!forceRefresh) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as GuideCache;
        if (parsed.signature === signature && Date.now() - parsed.fetchedAt < CACHE_MAX_AGE_MS) {
          return parsed.videosByChannel;
        }
      } catch {
        // Ignore invalid cache and fetch fresh data.
      }
    }
  }

  const entries = await Promise.all(
    channels
      .filter((channel) => channel.enabled)
      .map(async (channel) => [channel.id, await searchChannel(channel, session)] as const),
  );
  const videosByChannel = Object.fromEntries(entries);
  await AsyncStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ fetchedAt: Date.now(), signature, videosByChannel } satisfies GuideCache),
  );
  return videosByChannel;
}

export async function clearYouTubeGuideCache() {
  await AsyncStorage.removeItem(CACHE_KEY);
}
