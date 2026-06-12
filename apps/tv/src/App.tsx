import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import { colors } from '@viuwu/brand';

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

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('guide');
  const [notice, setNotice] = useState<string | null>(null);
  const [session, setSession] = useState<YouTubeSession | null>(null);
  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => {
    void restoreYouTubeSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setRestoringSession(false));
  }, []);

  if (restoringSession) {
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
        <SideNav
          activeScreen={activeScreen}
          onNavigate={(screen) => {
            setNotice(null);
            setActiveScreen(screen);
          }}
        />
        {activeScreen === 'guide' && <GuideScreen notice={notice} onSelectVideo={setNotice} />}
        {activeScreen === 'channels' && <ChannelsScreen />}
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
