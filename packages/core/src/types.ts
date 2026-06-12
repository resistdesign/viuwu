export interface UserChannel {
  id: string;
  name: string;
  query: string;
  callSign: string;
  position: number;
  enabled: boolean;
  accent: string;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  youtubeVideoId: string;
  title: string;
  creator: string;
  duration: string;
  publishedLabel: string;
  thumbnailUrl: string;
}

export interface GuideRow {
  channel: UserChannel;
  videos: VideoItem[];
}

export interface UserGuide {
  id: string;
  ownerLabel: string;
  updatedLabel: string;
  rows: GuideRow[];
}
