import { describe, expect, it } from 'vitest';

import { buildGuide } from './guide';
import type { UserChannel, VideoItem } from './types';

const channels: UserChannel[] = [
  {
    id: 'design',
    name: 'Design',
    query: 'design process',
    callSign: 'D-01',
    position: 0,
    enabled: true,
    accent: '#9b6cff',
    createdAt: '2026-06-12T00:00:00.000Z',
  },
  {
    id: 'music',
    name: 'Music',
    query: 'live music',
    callSign: 'M-02',
    position: 1,
    enabled: true,
    accent: '#ffcf4a',
    createdAt: '2026-06-12T00:00:00.000Z',
  },
];

const video: VideoItem = {
  id: 'video-1',
  youtubeVideoId: 'video-1',
  title: 'A real video',
  creator: 'A creator',
  duration: '12:00',
  publishedLabel: 'Today',
  thumbnailUrl: 'https://i.ytimg.com/vi/video-1/mqdefault.jpg',
};

describe('buildGuide', () => {
  it('sorts enabled channels and joins their videos', () => {
    const guide = buildGuide([...channels].reverse(), { design: [video] });

    expect(guide.rows).toHaveLength(2);
    expect(guide.rows[0]?.channel.name).toBe('Design');
    expect(guide.rows[0]?.videos[0]?.title).toBe('A real video');
  });

  it('omits disabled channels', () => {
    const guide = buildGuide(
      channels.map((channel) => ({ ...channel, enabled: false })),
      {},
    );

    expect(guide.rows).toEqual([]);
  });
});
