import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';
import type { VideoItem } from '@viuwu/core';

import { Artwork } from './Artwork';
import { Focusable } from './Focusable';

interface VideoCardProps {
  video: VideoItem;
  hasTVPreferredFocus?: boolean;
  onPress: () => void;
}

export function VideoCard({ video, hasTVPreferredFocus, onPress }: VideoCardProps) {
  return (
    <Focusable
      focusedStyle={styles.focused}
      hasTVPreferredFocus={hasTVPreferredFocus}
      label={`${video.title} by ${video.creator}`}
      onPress={onPress}
      style={styles.card}
    >
      {(focused) => (
        <>
          <Artwork artwork={video.artwork} />
          <View style={styles.copy}>
            <Text numberOfLines={1} style={[styles.title, focused && styles.titleFocused]}>
              {video.title}
            </Text>
            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={styles.creator}>
                {video.creator}
              </Text>
              <Text style={styles.duration}>{video.duration}</Text>
            </View>
          </View>
          {focused && (
            <View style={styles.playBadge}>
              <Text style={styles.playGlyph}>▶</Text>
            </View>
          )}
        </>
      )}
    </Focusable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderRadius: radii.md,
    marginRight: 16,
    overflow: 'hidden',
    width: 252,
  },
  focused: {
    backgroundColor: colors.panelLifted,
  },
  copy: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  title: {
    color: '#d7d0dc',
    fontSize: 15,
    fontWeight: '700',
  },
  titleFocused: {
    color: colors.paper,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  creator: {
    color: '#827a88',
    flex: 1,
    fontSize: 11,
  },
  duration: {
    color: colors.purpleBright,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  playBadge: {
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 64,
    width: 42,
  },
  playGlyph: {
    color: colors.ink,
    fontSize: 14,
    marginLeft: 2,
  },
});
