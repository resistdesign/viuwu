import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserChannel, VideoItem } from '@viuwu/core';

import type { YouTubeSession } from './youtubeAuth';

const API_ROOT = 'https://www.googleapis.com/youtube/v3';
const CACHE_KEY = 'viuwu.youtube.guide-cache.v1';
const CACHE_MAX_AGE_MS = 15 * 60 * 1000;

interface SearchItem {
  id: { videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface SearchResponse {
  items?: SearchItem[];
  error?: { message?: string };
}

interface VideosResponse {
  items?: Array<{ id: string; contentDetails?: { duration?: string } }>;
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

function formatDuration(value?: string) {
  if (!value) return '';
  const match = value.match(/P(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
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
  return `${Math.floor(ageDays / 30)} months ago`;
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
  const search = await youtubeGet<SearchResponse>(
    'search',
    {
      part: 'snippet',
      type: 'video',
      order: 'date',
      maxResults: '8',
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
    { part: 'contentDetails', id: ids },
    session,
  );
  const durations = new Map(
    (details.items ?? []).map((item) => [item.id, formatDuration(item.contentDetails?.duration)]),
  );

  return items.map<VideoItem>((item) => {
    const videoId = item.id.videoId!;
    return {
      id: videoId,
      youtubeVideoId: videoId,
      title: decodeHtml(item.snippet.title),
      creator: decodeHtml(item.snippet.channelTitle),
      duration: durations.get(videoId) ?? '',
      publishedLabel: formatPublished(item.snippet.publishedAt),
      thumbnailUrl:
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    };
  });
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
