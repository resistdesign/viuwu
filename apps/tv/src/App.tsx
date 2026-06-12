import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import { colors } from '@viuwu/brand';
import type { UserChannel } from '@viuwu/core';

import { SideNav, type ScreenName } from './components/SideNav';
import { ChannelsScreen } from './screens/ChannelsScreen';
import { GuideScreen } from './screens/GuideScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { YouTubeConnectScreen } from './screens/YouTubeConnectScreen';
import {
  disconnectYouTube,
  restoreYouTubeSession,
  type YouTubeSession,
} from './services/youtubeAuth';
import { loadChannels, saveChannels } from './services/channelStore';
import { clearYouTubeGuideCache } from './services/youtubeData';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('guide');
  const [session, setSession] = useState<YouTubeSession | null>(null);
  const [restoringSession, setRestoringSession] = useState(true);
  const [channels, setChannels] = useState<UserChannel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    void restoreYouTubeSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setRestoringSession(false));
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoadingChannels(true);
    void loadChannels()
      .then(setChannels)
      .finally(() => setLoadingChannels(false));
  }, [session]);

  const updateChannels = (nextChannels: UserChannel[]) => {
    setChannels(nextChannels);
    void saveChannels(nextChannels);
    void clearYouTubeGuideCache();
  };

  if (restoringSession || (session && loadingChannels)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar hidden />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.purpleBright} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar hidden />
        <YouTubeConnectScreen onConnected={setSession} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <View style={styles.app}>
        <SideNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
        {activeScreen === 'guide' && (
          <GuideScreen
            channels={channels}
            onOpenChannels={() => setActiveScreen('channels')}
            session={session}
          />
        )}
        {activeScreen === 'channels' && (
          <ChannelsScreen channels={channels} onChange={updateChannels} />
        )}
        {activeScreen === 'settings' && (
          <SettingsScreen
            onDisconnect={() => {
              void disconnectYouTube(session)
                .catch(() => undefined)
                .finally(() => setSession(null));
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.ink,
    flex: 1,
  },
  app: {
    backgroundColor: colors.ink,
    flex: 1,
    flexDirection: 'row',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
