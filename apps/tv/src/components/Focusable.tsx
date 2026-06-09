import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii } from '@viuwu/brand';

interface FocusableProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode | ((focused: boolean) => ReactNode);
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  label?: string;
}

export function Focusable({
  children,
  style,
  focusedStyle,
  label,
  onFocus,
  onBlur,
  ...props
}: FocusableProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      style={[styles.base, style, focused && styles.focused, focused && focusedStyle]}
      {...props}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
}

interface ToggleProps {
  active: boolean;
  label: string;
  onPress: () => void;
}

export function Toggle({ active, label, onPress }: ToggleProps) {
  return (
    <Focusable onPress={onPress} style={styles.toggleButton}>
      {(focused) => (
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, focused && styles.toggleLabelFocused]}>{label}</Text>
          <View style={[styles.toggleTrack, active && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, active && styles.toggleThumbActive]} />
          </View>
        </View>
      )}
    </Focusable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderColor: 'transparent',
    borderRadius: radii.md,
    borderWidth: 3,
  },
  focused: {
    borderColor: colors.paper,
    shadowColor: colors.purpleBright,
    shadowOpacity: 0.95,
    shadowRadius: 14,
    transform: [{ scale: 1.035 }],
  },
  toggleButton: {
    backgroundColor: colors.panel,
    marginBottom: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    color: colors.smoke,
    fontSize: 18,
    fontWeight: '600',
  },
  toggleLabelFocused: {
    color: colors.paper,
  },
  toggleTrack: {
    backgroundColor: '#4a4350',
    borderRadius: radii.pill,
    height: 28,
    justifyContent: 'center',
    padding: 4,
    width: 52,
  },
  toggleTrackActive: {
    backgroundColor: colors.purple,
  },
  toggleThumb: {
    backgroundColor: colors.paper,
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
