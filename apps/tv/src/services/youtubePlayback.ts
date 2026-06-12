import * as IntentLauncher from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

export async function playYouTubeVideo(videoId: string) {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  if (Platform.OS === 'android') {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: watchUrl,
        packageName: 'com.google.android.youtube.tv',
      });
      return;
    } catch {
      // Fall through to Android's normal app-link or browser handling.
    }
  }

  await Linking.openURL(watchUrl);
}
