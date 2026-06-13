import { describe, expect, it } from 'vitest';

import type { VideoItem } from './types';
import {
  isLikelyYouTubeShort,
  parseDurationSeconds,
  rankYouTubeVideos,
  selectYouTubeVideos,
} from './youtubeRanking';

const now = Date.parse('2026-06-12T12:00:00.000Z');

function video(overrides: Partial<VideoItem> & Pick<VideoItem, 'id' | 'title'>): VideoItem {
  return {
    youtubeVideoId: overrides.id,
    creator: 'Creator',
    duration: '10:00',
    durationSeconds: 600,
    publishedAt: '2026-06-01T12:00:00.000Z',
    publishedLabel: '1 week ago',
    thumbnailUrl: `https://i.ytimg.com/vi/${overrides.id}/mqdefault.jpg`,
    viewCount: 1_000,
    isLikelyShort: false,
    ...overrides,
  };
}

describe('parseDurationSeconds', () => {
  it.each([
    ['PT45S', 45],
    ['PT3M', 180],
    ['PT1H2M3S', 3723],
    ['P1DT2H', 93_600],
    ['P0D', 0],
    ['invalid', 0],
  ])('parses %s as %i seconds', (duration, expected) => {
    expect(parseDurationSeconds(duration)).toBe(expected);
  });
});

describe('isLikelyYouTubeShort', () => {
  it('uses duration and title signals', () => {
    expect(isLikelyYouTubeShort('A normal upload', 59)).toBe(true);
    expect(isLikelyYouTubeShort('A normal upload #Shorts', 600)).toBe(true);
    expect(isLikelyYouTubeShort('YouTube Shorts editing guide', 600)).toBe(true);
    expect(isLikelyYouTubeShort('A full tutorial', 600)).toBe(false);
  });
});

describe('rankYouTubeVideos', () => {
  it('prefers query matches, freshness, and useful view-count signals', () => {
    const ranked = rankYouTubeVideos(
      'godot 4 tutorial',
      [
        video({
          id: 'weak',
          title: 'General game engine news',
          publishedAt: '2025-08-01T12:00:00.000Z',
          viewCount: 50,
        }),
        video({
          id: 'strong',
          title: 'Godot 4 tutorial for complete beginners',
          viewCount: 50_000,
        }),
      ],
      now,
    );

    expect(ranked.map(({ id }) => id)).toEqual(['strong', 'weak']);
  });
});

describe('selectYouTubeVideos', () => {
  it('filters Shorts and uses the strict three-minute tier when it has enough results', () => {
    const selection = selectYouTubeVideos(
      'blender geometry nodes',
      [
        ...Array.from({ length: 5 }, (_, index) =>
          video({ id: `long-${index}`, title: `Blender geometry nodes lesson ${index}` }),
        ),
        video({
          id: 'short',
          title: 'Blender tip #shorts',
          duration: '0:45',
          durationSeconds: 45,
          isLikelyShort: true,
        }),
      ],
      now,
    );

    expect(selection.tier).toBe('strict');
    expect(selection.videos).toHaveLength(5);
    expect(selection.videos.some(({ id }) => id === 'short')).toBe(false);
    expect(selection.diagnostics.likelyShorts).toBe(1);
  });

  it('relaxes to 90 seconds when strict filtering leaves too few results', () => {
    const selection = selectYouTubeVideos(
      'cozy game devlog',
      Array.from({ length: 4 }, (_, index) =>
        video({
          id: `medium-${index}`,
          title: `Cozy game devlog ${index}`,
          duration: '2:00',
          durationSeconds: 120,
        }),
      ),
      now,
    );

    expect(selection.tier).toBe('relaxed');
    expect(selection.videos).toHaveLength(4);
  });

  it('falls back to the best non-Short results instead of returning an accidental empty row', () => {
    const selection = selectYouTubeVideos(
      'paper craft video games',
      [
        video({
          id: 'brief',
          title: 'Paper craft video games overview',
          duration: '1:10',
          durationSeconds: 70,
        }),
        video({
          id: 'short',
          title: 'Paper craft #shorts',
          duration: '0:30',
          durationSeconds: 30,
          isLikelyShort: true,
        }),
      ],
      now,
    );

    expect(selection.tier).toBe('non-short');
    expect(selection.videos.map(({ id }) => id)).toEqual(['brief']);
  });

  it('returns the explicit empty tier when every candidate is a likely Short', () => {
    const selection = selectYouTubeVideos(
      'minecraft build ideas',
      [
        video({
          id: 'short',
          title: 'Minecraft build idea #shorts',
          duration: '0:30',
          durationSeconds: 30,
          isLikelyShort: true,
        }),
      ],
      now,
    );

    expect(selection.tier).toBe('empty');
    expect(selection.videos).toEqual([]);
  });
});
