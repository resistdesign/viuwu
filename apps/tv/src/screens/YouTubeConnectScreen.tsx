import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';

import { Focusable } from '../components/Focusable';
import {
  beginYouTubeConnection,
  pollForYouTubeSession,
  youtubeClientId,
  type YouTubeDeviceCode,
  type YouTubeSession,
} from '../services/youtubeAuth';

interface YouTubeConnectScreenProps {
  onConnected: (session: YouTubeSession) => void;
}

export function YouTubeConnectScreen({ onConnected }: YouTubeConnectScreenProps) {
  const [deviceCode, setDeviceCode] = useState<YouTubeDeviceCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startConnection = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      setDeviceCode(await beginYouTubeConnection());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'YouTube authorization failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (youtubeClientId) void startConnection();
  }, [startConnection]);

  useEffect(() => {
    if (!deviceCode) return;

    const interval = setInterval(async () => {
      if (Date.now() >= deviceCode.expiresAt) {
        clearInterval(interval);
        setDeviceCode(null);
        setError('That code expired. Select Try again for a new code.');
        return;
      }

      try {
        const session = await pollForYouTubeSession(deviceCode);
        if (session) {
          clearInterval(interval);
          onConnected(session);
        }
      } catch (caught) {
        clearInterval(interval);
        setDeviceCode(null);
        setError(caught instanceof Error ? caught.message : 'YouTube authorization failed.');
      }
    }, deviceCode.intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [deviceCode, onConnected]);

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>WELCOME TO VIUWU</Text>
      <Text style={styles.title}>Connect YouTube.</Text>
      <Text style={styles.subtitle}>
        Viuwu uses your YouTube account to build the channels you choose. You must connect before
        continuing.
      </Text>

      <View style={styles.card}>
        {!youtubeClientId ? (
          <>
            <Text style={styles.cardLabel}>BUILD CONFIGURATION REQUIRED</Text>
            <Text style={styles.error}>
              This build is missing EXPO_PUBLIC_YOUTUBE_TV_CLIENT_ID and cannot connect YouTube.
            </Text>
          </>
        ) : loading ? (
          <>
            <ActivityIndicator color={colors.purpleBright} size="large" />
            <Text style={styles.waiting}>Requesting a secure sign-in code...</Text>
          </>
        ) : deviceCode ? (
          <>
            <Text style={styles.cardLabel}>ON YOUR PHONE OR COMPUTER</Text>
            <Text style={styles.instruction}>Visit</Text>
            <Text style={styles.url}>{deviceCode.verificationUrl}</Text>
            <Text style={styles.instruction}>and enter this code</Text>
            <Text style={styles.code}>{deviceCode.userCode}</Text>
            <View style={styles.polling}>
              <ActivityIndicator color={colors.mint} size="small" />
              <Text style={styles.pollingText}>Waiting for YouTube...</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.cardLabel}>CONNECTION STOPPED</Text>
            <Text style={styles.error}>{error}</Text>
            <Focusable onPress={() => void startConnection()} style={styles.button}>
              <Text style={styles.buttonText}>Try again</Text>
            </Focusable>
          </>
        )}
      </View>
      <Text style={styles.privacy}>
        Viuwu requests read-only YouTube access. It cannot upload, edit, or delete your videos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 120,
  },
  eyebrow: {
    color: colors.purpleBright,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: colors.paper,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 10,
  },
  subtitle: {
    color: '#a39aa9',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 720,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    marginTop: 34,
    minHeight: 280,
    paddingHorizontal: 64,
    paddingVertical: 34,
    width: 720,
  },
  cardLabel: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  instruction: {
    color: '#978e9e',
    fontSize: 14,
    marginTop: 18,
  },
  url: {
    color: colors.paper,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 5,
  },
  code: {
    color: colors.mint,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 6,
    marginTop: 7,
  },
  polling: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  pollingText: {
    color: '#9c93a2',
    fontSize: 12,
  },
  waiting: {
    color: '#9c93a2',
    fontSize: 14,
    marginTop: 20,
  },
  error: {
    color: '#ff9c8d',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 22,
    maxWidth: 560,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    marginTop: 26,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonText: {
    color: colors.paper,
    fontSize: 15,
    fontWeight: '800',
  },
  privacy: {
    color: '#6f6774',
    fontSize: 11,
    marginTop: 22,
  },
});
