export type ProviderId = string;

export interface VideoProvider {
  id: ProviderId;
  name: string;
  accent: string;
  capabilities: Array<'search' | 'subscriptions' | 'history'>;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  providerIds: ProviderId[];
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
  providerId: ProviderId;
  providerVideoId: string;
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
