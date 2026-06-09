import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import { colors } from '@viuwu/brand';

import { SideNav, type ScreenName } from './components/SideNav';
import { ChannelsScreen } from './screens/ChannelsScreen';
import { GuideScreen } from './screens/GuideScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('guide');
  const [notice, setNotice] = useState<string | null>(null);

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
        {activeScreen === 'settings' && <SettingsScreen />}
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
});
