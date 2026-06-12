import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';
import { channels, savedSearches } from '@viuwu/core';

import { Focusable } from '../components/Focusable';

export function ChannelsScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(channels.map((channel) => [channel.id, channel.enabled])),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>CHANNEL CONTROL</Text>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.title}>Made by you.</Text>
          <Text style={styles.subtitle}>Pause a row or make room for the next obsession.</Text>
        </View>
        <Focusable onPress={() => undefined} style={styles.addButton}>
          {(focused) => (
            <Text style={[styles.addButtonText, focused && styles.addButtonFocused]}>
              + New channel
            </Text>
          )}
        </Focusable>
      </View>
      <View style={styles.list}>
        {channels.map((channel, index) => {
          const search = savedSearches.find((candidate) => candidate.id === channel.savedSearchId);
          const active = enabled[channel.id] ?? false;

          return (
            <Focusable
              key={channel.id}
              onPress={() => setEnabled((current) => ({ ...current, [channel.id]: !active }))}
              style={styles.channel}
            >
              {(focused) => (
                <>
                  <Text style={styles.position}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={[styles.color, { backgroundColor: channel.accent }]} />
                  <View style={styles.channelCopy}>
                    <Text style={[styles.channelName, focused && styles.channelNameFocused]}>
                      {search?.name}
                    </Text>
                    <Text style={styles.query}>{search?.query}</Text>
                  </View>
                  <Text style={styles.youtubeLabel}>YOUTUBE</Text>
                  <View style={[styles.state, active && styles.stateActive]}>
                    <Text style={[styles.stateText, active && styles.stateTextActive]}>
                      {active ? 'LIVE' : 'PAUSED'}
                    </Text>
                  </View>
                  <Text style={styles.handle}>≡</Text>
                </>
              )}
            </Focusable>
          );
        })}
      </View>
      <Text style={styles.hint}>
        Select a channel to pause it. Reordering and search editing land with persistence.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 42,
  },
  eyebrow: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  headingRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  title: {
    color: colors.paper,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    color: '#8f8795',
    fontSize: 14,
    marginTop: 7,
  },
  addButton: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  addButtonText: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: '800',
  },
  addButtonFocused: {
    color: colors.yellow,
  },
  list: {
    gap: 14,
    marginTop: 45,
  },
  channel: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 24,
  },
  position: {
    color: '#5f5765',
    fontSize: 13,
    fontWeight: '700',
    width: 36,
  },
  color: {
    borderRadius: 8,
    height: 48,
    marginRight: 18,
    transform: [{ rotate: '-5deg' }],
    width: 48,
  },
  channelCopy: {
    flex: 1,
  },
  channelName: {
    color: '#d5ceda',
    fontSize: 18,
    fontWeight: '800',
  },
  channelNameFocused: {
    color: colors.paper,
  },
  query: {
    color: '#776f7d',
    fontSize: 11,
    marginTop: 5,
  },
  youtubeLabel: {
    color: '#6f6675',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginHorizontal: 25,
  },
  state: {
    backgroundColor: '#352c3c',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    width: 72,
  },
  stateActive: {
    backgroundColor: '#264d43',
  },
  stateText: {
    color: '#8f8497',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateTextActive: {
    color: colors.mint,
  },
  handle: {
    color: '#6d6473',
    fontSize: 23,
    marginLeft: 25,
  },
  hint: {
    color: '#6f6774',
    fontSize: 10,
    marginTop: 22,
  },
});
