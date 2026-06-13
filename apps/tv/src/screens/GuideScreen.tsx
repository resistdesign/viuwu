import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';
import { buildGuide, type UserChannel, type VideoItem } from '@viuwu/core';

import { Focusable } from '../components/Focusable';
import { GuideRow } from '../components/GuideRow';
import { restoreYouTubeSession, type YouTubeSession } from '../services/youtubeAuth';
import { loadYouTubeGuide } from '../services/youtubeData';
import { playYouTubeVideo } from '../services/youtubePlayback';

interface GuideScreenProps {
  channels: UserChannel[];
  onOpenChannels: () => void;
  session: YouTubeSession;
}

export function GuideScreen({ channels, onOpenChannels, session }: GuideScreenProps) {
  const [videosByChannel, setVideosByChannel] = useState<Record<string, VideoItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guide = useMemo(() => buildGuide(channels, videosByChannel), [channels, videosByChannel]);

  const load = useCallback(
    async (forceRefresh = false) => {
      if (channels.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const validSession = (await restoreYouTubeSession()) ?? session;
        setVideosByChannel(await loadYouTubeGuide(channels, validSession, forceRefresh));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'YouTube could not load the guide.');
      } finally {
        setLoading(false);
      }
    },
    [channels, session],
  );

  useEffect(() => {
    void load();
  }, [load]);

  if (channels.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.eyebrow}>YOUR GUIDE IS EMPTY</Text>
        <Text style={styles.emptyTitle}>Start with a search.</Text>
        <Text style={styles.emptyCopy}>
          Add a channel using words you choose. Viuwu will load strong matching videos from YouTube.
        </Text>
        <Focusable hasTVPreferredFocus onPress={onOpenChannels} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Create your first channel</Text>
        </Focusable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>LIVE FROM YOUTUBE</Text>
          <Text style={styles.title}>Your guide</Text>
          <Text style={styles.subtitle}>
            {channels.filter((channel) => channel.enabled).length} saved searches, ranked for
            relevance and recency.
          </Text>
        </View>
        <Focusable disabled={loading} onPress={() => void load(true)} style={styles.refreshButton}>
          <Text style={styles.refreshText}>{loading ? 'REFRESHING' : 'REFRESH'}</Text>
        </Focusable>
      </View>
      {error && (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>{error}</Text>
          <Focusable onPress={() => void load(true)} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Focusable>
        </View>
      )}
      {loading && guide.rows.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.purpleBright} size="large" />
          <Text style={styles.loadingText}>Loading your YouTube searches...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.rows} showsVerticalScrollIndicator={false}>
          {guide.rows.map((row, index) => (
            <GuideRow
              isFirst={index === 0}
              key={row.channel.id}
              onSelectVideo={(videoId) => {
                void playYouTubeVideo(videoId).catch(() =>
                  setError('No application on this TV could open the YouTube video.'),
                );
              }}
              row={row}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingLeft: 46,
    paddingTop: 36,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 120,
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 42,
  },
  eyebrow: {
    color: colors.purpleBright,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.paper,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 7,
  },
  subtitle: {
    color: '#8f8795',
    fontSize: 14,
    marginTop: 7,
  },
  emptyTitle: {
    color: colors.paper,
    fontSize: 48,
    fontWeight: '900',
    marginTop: 12,
  },
  emptyCopy: {
    color: '#958c9c',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 680,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: colors.paper,
    fontSize: 16,
    fontWeight: '800',
  },
  refreshButton: {
    backgroundColor: '#282031',
    borderRadius: radii.pill,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  refreshText: {
    color: colors.paper,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  errorPanel: {
    alignItems: 'center',
    backgroundColor: '#321d27',
    borderRadius: radii.sm,
    flexDirection: 'row',
    marginRight: 42,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  errorText: {
    color: '#ff9c8d',
    flex: 1,
    fontSize: 12,
  },
  retryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: colors.paper,
    fontSize: 11,
    fontWeight: '800',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#958c9c',
    fontSize: 14,
    marginTop: 16,
  },
  rows: {
    paddingBottom: 80,
    paddingTop: 28,
  },
});
