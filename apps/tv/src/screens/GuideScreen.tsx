import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@viuwu/brand';
import { mockGuide } from '@viuwu/core';

import { GuideRow } from '../components/GuideRow';

interface GuideScreenProps {
  notice: string | null;
  onSelectVideo: (title: string) => void;
}

export function GuideScreen({ notice, onSelectVideo }: GuideScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>GOOD EVENING · FRESH NOW</Text>
          <Text style={styles.title}>Your guide</Text>
          <Text style={styles.subtitle}>
            Four searches. Sixteen good reasons to pick up the remote.
          </Text>
        </View>
        <View style={styles.headerNote}>
          <Text style={styles.headerNoteLabel}>WHY THIS IS HERE</Text>
          <Text style={styles.headerNoteCopy}>Every row matches a search you saved.</Text>
        </View>
      </View>
      {notice && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Queued “{notice}” · playback arrives with provider sync.
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.rows} showsVerticalScrollIndicator={false}>
        {mockGuide.rows.map((row, index) => (
          <GuideRow
            isFirst={index === 0}
            key={row.channel.id}
            onSelectVideo={onSelectVideo}
            row={row}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingLeft: 46,
    paddingTop: 36,
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 42,
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
    marginTop: 7,
  },
  subtitle: {
    color: '#8f8795',
    fontSize: 14,
    marginTop: 7,
  },
  headerNote: {
    borderLeftColor: colors.yellow,
    borderLeftWidth: 3,
    marginBottom: 4,
    paddingLeft: 14,
    width: 255,
  },
  headerNoteLabel: {
    color: colors.yellow,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  headerNoteCopy: {
    color: '#aba2b1',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  notice: {
    backgroundColor: '#2b2133',
    borderColor: colors.purple,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 44,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  noticeText: {
    color: '#d7cbe0',
    fontSize: 12,
  },
  rows: {
    paddingBottom: 80,
    paddingTop: 35,
  },
});
