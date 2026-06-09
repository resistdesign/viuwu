import { describe, expect, it } from 'vitest';

import { buildGuide } from './guide';
import { channels, savedSearches, videosBySearch } from './fixtures';

describe('buildGuide', () => {
  it('sorts enabled channels and joins their saved searches', () => {
    const guide = buildGuide(savedSearches, [...channels].reverse(), videosBySearch);

    expect(guide.rows).toHaveLength(4);
    expect(guide.rows[0]?.search.name).toBe('Design rabbit holes');
    expect(guide.rows[0]?.videos[0]?.title).toBe('A type foundry above a bakery');
  });

  it('omits disabled and orphaned channels', () => {
    const guide = buildGuide(
      savedSearches,
      [
        { ...channels[0]!, enabled: false },
        { ...channels[1]!, savedSearchId: 'missing' },
      ],
      videosBySearch,
    );

    expect(guide.rows).toEqual([]);
  });
});
