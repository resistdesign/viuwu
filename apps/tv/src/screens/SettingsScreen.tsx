import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@viuwu/brand';
import { providers } from '@viuwu/core';

import { Focusable, Toggle } from '../components/Focusable';

export function SettingsScreen() {
  const [autoplay, setAutoplay] = useState(false);
  const [freshOnly, setFreshOnly] = useState(true);
  const [quietPreviews, setQuietPreviews] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>SETTINGS</Text>
      <Text style={styles.title}>Keep it yours.</Text>
      <Text style={styles.subtitle}>
        Visible choices, sensible defaults, no behavioral profile.
      </Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>PLAYBACK</Text>
          <Toggle
            active={autoplay}
            label="Autoplay the next match"
            onPress={() => setAutoplay(!autoplay)}
          />
          <Toggle
            active={freshOnly}
            label="Prefer unseen videos"
            onPress={() => setFreshOnly(!freshOnly)}
          />
          <Toggle
            active={quietPreviews}
            label="Keep previews quiet"
            onPress={() => setQuietPreviews(!quietPreviews)}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>VIDEO SOURCES</Text>
          {providers.map((provider, index) => (
            <Focusable key={provider.id} onPress={() => undefined} style={styles.provider}>
              {(focused) => (
                <>
                  <View style={[styles.providerMark, { backgroundColor: provider.accent }]}>
                    <Text style={styles.providerInitial}>{provider.name.at(0)}</Text>
                  </View>
                  <View style={styles.providerCopy}>
                    <Text style={[styles.providerName, focused && styles.providerNameFocused]}>
                      {provider.name}
                    </Text>
                    <Text style={styles.providerStatus}>
                      {index === 0 ? 'Mock connection ready' : 'Adapter planned'}
                    </Text>
                  </View>
                  <Text style={styles.providerAction}>{index === 0 ? 'CONNECT' : 'SOON'}</Text>
                </>
              )}
            </Focusable>
          ))}
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
