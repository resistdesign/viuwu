import type { GuideRow, UserChannel, UserGuide, VideoItem } from './types';

export function buildGuide(
  channels: UserChannel[],
  videosByChannel: Record<string, VideoItem[]>,
): UserGuide {
  const rows = channels
    .filter((channel) => channel.enabled)
    .sort((left, right) => left.position - right.position)
    .map<GuideRow>((channel) => ({ channel, videos: videosByChannel[channel.id] ?? [] }));

  return {
    id: 'guide-local',
    ownerLabel: 'Your guide',
    updatedLabel: 'Fresh now',
    rows,
  };
}
