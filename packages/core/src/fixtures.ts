import { buildGuide } from './guide';
import type { SavedSearch, SearchChannel, VideoItem } from './types';

export const savedSearches: SavedSearch[] = [
  {
    id: 'search-design',
    name: 'Design rabbit holes',
    query: 'graphic design studio tours process',
    createdAt: '2026-06-01',
  },
  {
    id: 'search-sound',
    name: 'Small room, big sound',
    query: 'tiny live music session',
    createdAt: '2026-06-02',
  },
  {
    id: 'search-food',
    name: 'Make this tonight',
    query: 'quick vegetarian weeknight recipe',
    createdAt: '2026-06-03',
  },
  {
    id: 'search-making',
    name: 'Made by hand',
    query: 'ceramics printmaking woodworking process',
    createdAt: '2026-06-04',
  },
];

export const channels: SearchChannel[] = [
  {
    id: 'channel-design',
    savedSearchId: 'search-design',
    callSign: 'D-01',
    position: 0,
    enabled: true,
    accent: '#9b6cff',
  },
  {
    id: 'channel-sound',
    savedSearchId: 'search-sound',
    callSign: 'S-02',
    position: 1,
    enabled: true,
    accent: '#ffcf4a',
  },
  {
    id: 'channel-food',
    savedSearchId: 'search-food',
    callSign: 'F-03',
    position: 2,
    enabled: true,
    accent: '#ff806b',
  },
  {
    id: 'channel-making',
    savedSearchId: 'search-making',
    callSign: 'M-04',
    position: 3,
    enabled: true,
    accent: '#73d6b2',
  },
];

const video = (
  id: string,
  title: string,
  creator: string,
  duration: string,
  background: string,
  motif: VideoItem['artwork']['motif'],
): VideoItem => ({
  id,
  youtubeVideoId: id,
  title,
  creator,
  duration,
  publishedLabel: 'Today',
  artwork: { background, motif },
});

export const videosBySearch: Record<string, VideoItem[]> = {
  'search-design': [
    video('design-1', 'A type foundry above a bakery', 'Open Studio', '18 min', '#7546d9', 'grid'),
    video(
      'design-2',
      'Posters that refuse to behave',
      'Process Dept.',
      '12 min',
      '#d94b88',
      'burst',
    ),
    video('design-3', 'Inside a one-person design shop', 'Nice Work', '24 min', '#306fa8', 'rings'),
    video(
      'design-4',
      'Making a logo with no straight lines',
      'Odd Hours',
      '9 min',
      '#a75432',
      'waves',
    ),
  ],
  'search-sound': [
    video(
      'sound-1',
      'Four songs in a freight elevator',
      'Close Listening',
      '16 min',
      '#d59a21',
      'waves',
    ),
    video('sound-2', 'The quietest loud band in town', 'Room Tone', '22 min', '#376686', 'orbit'),
    video(
      'sound-3',
      'A rooftop set before the rain',
      'Live Around Here',
      '31 min',
      '#9450a6',
      'rings',
    ),
    video('sound-4', 'Cello, synth, one desk lamp', 'After Five', '14 min', '#a75c42', 'grid'),
  ],
  'search-food': [
    video('food-1', 'Crispy rice, greens, done', 'Weeknight Club', '11 min', '#b74436', 'burst'),
    video(
      'food-2',
      'The 20-minute noodle situation',
      'Good Enough Kitchen',
      '15 min',
      '#4f8a62',
      'waves',
    ),
    video('food-3', 'Beans on toast grew up', 'Dinner, Actually', '8 min', '#bf7534', 'orbit'),
    video(
      'food-4',
      'One pan and a heroic lemon',
      'No Big Production',
      '13 min',
      '#6e7440',
      'rings',
    ),
  ],
  'search-making': [
    video(
      'making-1',
      'A bowl from a lump of wild clay',
      'Handmade Days',
      '27 min',
      '#7d5b48',
      'rings',
    ),
    video(
      'making-2',
      'Printing with whatever was nearby',
      'Ink Please',
      '19 min',
      '#436f87',
      'grid',
    ),
    video(
      'making-3',
      'A chair, slowly and correctly',
      'Patient Objects',
      '34 min',
      '#6f7042',
      'waves',
    ),
    video('making-4', 'The tiny bookbinding bench', 'Made Here', '17 min', '#804966', 'burst'),
  ],
};

export const mockGuide = buildGuide(savedSearches, channels, videosBySearch);
