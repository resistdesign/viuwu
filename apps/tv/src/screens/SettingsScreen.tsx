import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@viuwu/brand';
import { Focusable } from '../components/Focusable';

interface SettingsScreenProps {
  onDisconnect: () => void;
}

export function SettingsScreen({ onDisconnect }: SettingsScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>SETTINGS</Text>
      <Text style={styles.title}>Keep it yours.</Text>
      <Text style={styles.subtitle}>
        Visible choices, sensible defaults, no behavioral profile.
      </Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>HOW VIUWU WORKS</Text>
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>Your searches are the guide.</Text>
            <Text style={styles.infoText}>
              Viuwu requests recent, relevant videos directly from YouTube and filters likely Shorts
              and tiny clips. Selecting one opens the official YouTube watch experience on this TV.
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>YOUTUBE ACCOUNT</Text>
          <Focusable onPress={onDisconnect} style={styles.provider}>
            {(focused) => (
              <>
                <View style={styles.providerMark}>
                  <Text style={styles.providerInitial}>Y</Text>
                </View>
                <View style={styles.providerCopy}>
                  <Text style={[styles.providerName, focused && styles.providerNameFocused]}>
                    YouTube
                  </Text>
                  <Text style={styles.providerStatus}>Connected with read-only access</Text>
                </View>
                <Text style={styles.providerAction}>DISCONNECT</Text>
              </>
            )}
          </Focusable>
          <View style={styles.privacy}>
            <Text style={styles.privacyLabel}>THE SHORT VERSION</Text>
            <Text style={styles.privacyText}>
              Viuwu can work without a recommendation profile. Your searches explain the guide.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 42,
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
    marginTop: 8,
  },
  subtitle: {
    color: '#8f8795',
    fontSize: 14,
    marginTop: 7,
  },
  columns: {
    flexDirection: 'row',
    gap: 38,
    marginTop: 44,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    color: '#746b7b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 13,
  },
  infoPanel: {
    backgroundColor: colors.panel,
    padding: 24,
  },
  infoTitle: {
    color: colors.paper,
    fontSize: 18,
    fontWeight: '800',
  },
  infoText: {
    color: '#92899a',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  provider: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  providerMark: {
    alignItems: 'center',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    marginRight: 15,
    width: 46,
    backgroundColor: '#ff0033',
  },
  providerInitial: {
    color: colors.paper,
    fontSize: 20,
    fontWeight: '900',
  },
  providerCopy: {
    flex: 1,
  },
  providerName: {
    color: '#c9c1ce',
    fontSize: 16,
    fontWeight: '800',
  },
  providerNameFocused: {
    color: colors.paper,
  },
  providerStatus: {
    color: '#736a79',
    fontSize: 10,
    marginTop: 4,
  },
  providerAction: {
    color: colors.purpleBright,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  privacy: {
    borderLeftColor: colors.yellow,
    borderLeftWidth: 4,
    marginTop: 20,
    paddingLeft: 16,
  },
  privacyLabel: {
    color: colors.yellow,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  privacyText: {
    color: '#92899a',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    maxWidth: 430,
  },
});
