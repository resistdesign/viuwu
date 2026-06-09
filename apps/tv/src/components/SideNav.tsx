import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';

import logo from '../../assets/logo.png';
import { Focusable } from './Focusable';

export type ScreenName = 'guide' | 'channels' | 'settings';

interface SideNavProps {
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const items: Array<{ screen: ScreenName; glyph: string; label: string }> = [
  { screen: 'guide', glyph: '▦', label: 'Guide' },
  { screen: 'channels', glyph: '⌕', label: 'Channels' },
  { screen: 'settings', glyph: '⚙', label: 'Settings' },
];

export function SideNav({ activeScreen, onNavigate }: SideNavProps) {
  return (
    <View style={styles.nav}>
      <Image resizeMode="contain" source={logo} style={styles.logo} />
      <View style={styles.items}>
        {items.map((item) => (
          <Focusable
            focusedStyle={styles.itemFocused}
            key={item.screen}
            onPress={() => onNavigate(item.screen)}
            style={[styles.item, activeScreen === item.screen && styles.itemActive]}
          >
            {(focused) => (
              <>
                <Text style={[styles.glyph, focused && styles.copyFocused]}>{item.glyph}</Text>
                <Text style={[styles.label, focused && styles.copyFocused]}>{item.label}</Text>
              </>
            )}
          </Focusable>
        ))}
      </View>
      <View style={styles.profile}>
        <Text style={styles.avatar}>R</Text>
        <View>
          <Text style={styles.profileLabel}>LOCAL GUIDE</Text>
          <Text style={styles.profileName}>Your Viuwu</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#100d15',
    borderRightColor: '#28212f',
    borderRightWidth: 1,
    justifyContent: 'space-between',
    paddingBottom: 28,
    paddingHorizontal: 18,
    paddingTop: 25,
    width: 178,
  },
  logo: {
    alignSelf: 'center',
    height: 60,
    tintColor: colors.paper,
    width: 130,
  },
  items: {
    gap: 11,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  itemActive: {
    backgroundColor: '#282031',
  },
  itemFocused: {
    backgroundColor: colors.purple,
  },
  glyph: {
    color: '#8e8495',
    fontSize: 22,
    textAlign: 'center',
    width: 32,
  },
  label: {
    color: '#9f96a5',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  copyFocused: {
    color: colors.paper,
  },
  profile: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    color: colors.paper,
    fontSize: 16,
    fontWeight: '800',
    height: 38,
    lineHeight: 38,
    marginRight: 10,
    textAlign: 'center',
    width: 38,
  },
  profileLabel: {
    color: '#675e6d',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  profileName: {
    color: '#c8c0cd',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
});
