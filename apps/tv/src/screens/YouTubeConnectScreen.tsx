import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { colors, radii } from '@viuwu/brand';

import { Focusable } from '../components/Focusable';
import {
  beginYouTubeConnection,
  pollForYouTubeSession,
  youtubeConfigured,
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
    if (youtubeConfigured) void startConnection();
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
        {!youtubeConfigured ? (
          <>
            <Text style={styles.cardLabel}>BUILD CONFIGURATION REQUIRED</Text>
            <Text style={styles.error}>This build is missing its YouTube OAuth configuration.</Text>
          </>
        ) : loading ? (
          <>
            <ActivityIndicator color={colors.purpleBright} size="large" />
            <Text style={styles.waiting}>Requesting a secure sign-in code...</Text>
          </>
        ) : deviceCode ? (
          <>
            <Text style={styles.cardLabel}>SCAN WITH YOUR PHONE</Text>
            <View style={styles.connectRow}>
              <View style={styles.qrFrame}>
                <QRCode
                  backgroundColor="#ffffff"
                  color={colors.ink}
                  size={180}
                  value={deviceCode.verificationUrlComplete}
                />
              </View>
              <View style={styles.connectCopy}>
                <Text style={styles.scanTitle}>Open your camera and scan.</Text>
                <Text style={styles.accountHint}>
                  Google will let you choose which signed-in account to connect.
                </Text>
                <Text style={styles.fallbackLabel}>OR ENTER THE CODE AT</Text>
                <Text style={styles.url}>{deviceCode.verificationUrl}</Text>
                <Text style={styles.code}>{deviceCode.userCode}</Text>
              </View>
            </View>
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
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 6,
  },
  subtitle: {
    color: '#a39aa9',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 720,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    marginTop: 24,
    minHeight: 340,
    paddingHorizontal: 46,
    paddingVertical: 22,
    width: 880,
  },
  cardLabel: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  connectRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 42,
    marginTop: 18,
  },
  qrFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
  },
  connectCopy: {
    width: 475,
  },
  scanTitle: {
    color: colors.paper,
    fontSize: 23,
    fontWeight: '900',
  },
  accountHint: {
    color: '#aaa1b0',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  fallbackLabel: {
    color: '#776e7d',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginTop: 24,
  },
  url: {
    color: '#bdb5c3',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
  code: {
    color: colors.mint,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: 9,
  },
  polling: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
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
    marginTop: 12,
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
