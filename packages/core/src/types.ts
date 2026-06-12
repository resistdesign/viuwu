export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  createdAt: string;
}

export interface SearchChannel {
  id: string;
  savedSearchId: string;
  callSign: string;
  position: number;
  enabled: boolean;
  accent: string;
}

export interface VideoItem {
  id: string;
  youtubeVideoId: string;
  title: string;
  creator: string;
  duration: string;
  publishedLabel: string;
  artwork: {
    background: string;
    motif: 'orbit' | 'waves' | 'grid' | 'burst' | 'rings';
  };
}

export interface GuideRow {
  channel: SearchChannel;
  search: SavedSearch;
  videos: VideoItem[];
}

export interface UserGuide {
  id: string;
  ownerLabel: string;
  updatedLabel: string;
  rows: GuideRow[];
}
