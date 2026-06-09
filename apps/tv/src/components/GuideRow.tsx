import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { GuideRow as GuideRowModel } from '@viuwu/core';

import { VideoCard } from './VideoCard';

interface GuideRowProps {
  row: GuideRowModel;
  isFirst: boolean;
  onSelectVideo: (title: string) => void;
}

export function GuideRow({ row, isFirst, onSelectVideo }: GuideRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.channel, { borderLeftColor: row.channel.accent }]}>
        <Text style={styles.callSign}>{row.channel.callSign}</Text>
        <Text numberOfLines={2} style={styles.channelName}>
          {row.search.name}
        </Text>
        <Text numberOfLines={1} style={styles.query}>
          “{row.search.query}”
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.videoList}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {row.videos.map((video, index) => (
          <VideoCard
            hasTVPreferredFocus={isFirst && index === 0}
            key={video.id}
            onPress={() => onSelectVideo(video.title)}
            video={video}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  channel: {
    borderLeftWidth: 5,
    justifyContent: 'center',
    marginRight: 24,
    minHeight: 184,
    paddingHorizontal: 18,
    width: 210,
  },
  callSign: {
    color: '#766d7e',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  channelName: {
    color: '#f5f0e7',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 8,
  },
  query: {
    color: '#827a88',
    fontSize: 11,
    marginTop: 9,
  },
  videoList: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
});
