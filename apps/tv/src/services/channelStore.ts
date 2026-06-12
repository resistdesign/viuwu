import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserChannel } from '@viuwu/core';

const CHANNELS_KEY = 'viuwu.channels.v1';
const ACCENTS = ['#9b6cff', '#ffcf4a', '#ff806b', '#73d6b2', '#5ca9e6'];

export async function loadChannels(): Promise<UserChannel[]> {
  const stored = await AsyncStorage.getItem(CHANNELS_KEY);
  if (!stored) return [];

  try {
    const channels = JSON.parse(stored) as UserChannel[];
    return channels.filter(
      (channel) =>
        typeof channel.id === 'string' &&
        typeof channel.name === 'string' &&
        typeof channel.query === 'string',
    );
  } catch {
    return [];
  }
}

export async function saveChannels(channels: UserChannel[]) {
  await AsyncStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
}

export function createChannel(name: string, query: string, position: number): UserChannel {
  const normalizedName = name.trim();
  const initial = normalizedName.match(/[A-Za-z0-9]/)?.[0]?.toUpperCase() ?? 'V';

  return {
    id: `channel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizedName,
    query: query.trim(),
    callSign: `${initial}-${String(position + 1).padStart(2, '0')}`,
    position,
    enabled: true,
    accent: ACCENTS[position % ACCENTS.length]!,
    createdAt: new Date().toISOString(),
  };
}
