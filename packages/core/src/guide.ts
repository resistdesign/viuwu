import type { GuideRow, SavedSearch, SearchChannel, UserGuide, VideoItem } from './types';

export function buildGuide(
  searches: SavedSearch[],
  channels: SearchChannel[],
  videosBySearch: Record<string, VideoItem[]>,
): UserGuide {
  const searchesById = new Map(searches.map((search) => [search.id, search]));

  const rows = channels
    .filter((channel) => channel.enabled)
    .sort((left, right) => left.position - right.position)
    .flatMap<GuideRow>((channel) => {
      const search = searchesById.get(channel.savedSearchId);
      if (!search) return [];

      return [{ channel, search, videos: videosBySearch[search.id] ?? [] }];
    });

  return {
    id: 'guide-local',
    ownerLabel: 'Your guide',
    updatedLabel: 'Fresh now',
    rows,
  };
}
