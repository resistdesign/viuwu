import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';
import type { VideoItem } from '@viuwu/core';

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
          <Image resizeMode="cover" source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
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
            <Text style={styles.published}>{video.publishedLabel}</Text>
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
  thumbnail: {
    backgroundColor: '#201a28',
    height: 142,
    width: '100%',
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
  published: {
    color: '#675f6d',
    fontSize: 9,
    marginTop: 6,
  },
  playBadge: {
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 78,
    width: 42,
  },
  playGlyph: {
    color: colors.ink,
    fontSize: 14,
    marginLeft: 2,
  },
});
