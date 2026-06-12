import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii } from '@viuwu/brand';
import type { UserChannel } from '@viuwu/core';

import { Focusable } from '../components/Focusable';
import { createChannel } from '../services/channelStore';

interface ChannelsScreenProps {
  channels: UserChannel[];
  onChange: (channels: UserChannel[]) => void;
}

export function ChannelsScreen({ channels, onChange }: ChannelsScreenProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');

  const closeCreate = () => {
    setShowCreate(false);
    setName('');
    setQuery('');
  };

  const addChannel = () => {
    if (!name.trim() || !query.trim()) return;
    onChange([...channels, createChannel(name, query, channels.length)]);
    closeCreate();
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>CHANNEL CONTROL</Text>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.title}>Made by you.</Text>
          <Text style={styles.subtitle}>Each channel is a saved YouTube search you control.</Text>
        </View>
        <Focusable onPress={() => setShowCreate(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New channel</Text>
        </Focusable>
      </View>

      {channels.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No channels yet.</Text>
          <Text style={styles.emptyCopy}>
            Create one, name it, and enter the exact YouTube search that should fill its row.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {channels.map((channel, index) => (
            <View key={channel.id} style={styles.channel}>
              <Text style={styles.position}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={[styles.color, { backgroundColor: channel.accent }]} />
              <View style={styles.channelCopy}>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.query}>{channel.query}</Text>
              </View>
              <Focusable
                onPress={() =>
                  onChange(
                    channels.map((candidate) =>
                      candidate.id === channel.id
                        ? { ...candidate, enabled: !candidate.enabled }
                        : candidate,
                    ),
                  )
                }
                style={[styles.action, channel.enabled && styles.actionActive]}
              >
                <Text style={[styles.actionText, channel.enabled && styles.actionTextActive]}>
                  {channel.enabled ? 'LIVE' : 'PAUSED'}
                </Text>
              </Focusable>
              <Focusable
                onPress={() =>
                  onChange(
                    channels
                      .filter((candidate) => candidate.id !== channel.id)
                      .map((candidate, position) => ({ ...candidate, position })),
                  )
                }
                style={styles.remove}
              >
                <Text style={styles.removeText}>REMOVE</Text>
              </Focusable>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal animationType="fade" onRequestClose={closeCreate} transparent visible={showCreate}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalEyebrow}>NEW CHANNEL</Text>
            <Text style={styles.modalTitle}>What should this row find?</Text>
            <Text style={styles.fieldLabel}>CHANNEL NAME</Text>
            <TextInput
              autoFocus
              onChangeText={setName}
              placeholder="Example: Live sessions"
              placeholderTextColor="#625a69"
              style={styles.input}
              value={name}
            />
            <Text style={styles.fieldLabel}>YOUTUBE SEARCH</Text>
            <TextInput
              onChangeText={setQuery}
              onSubmitEditing={addChannel}
              placeholder="Example: intimate live music session"
              placeholderTextColor="#625a69"
              returnKeyType="done"
              style={styles.input}
              value={query}
            />
            <View style={styles.modalActions}>
              <Focusable onPress={closeCreate} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Focusable>
              <Focusable
                disabled={!name.trim() || !query.trim()}
                onPress={addChannel}
                style={[
                  styles.saveButton,
                  (!name.trim() || !query.trim()) && styles.saveButtonDisabled,
                ]}
              >
                <Text style={styles.saveText}>Create channel</Text>
              </Focusable>
            </View>
          </View>
        </View>
      </Modal>
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
  headingRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  title: {
    color: colors.paper,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    color: '#8f8795',
    fontSize: 14,
    marginTop: 7,
  },
  addButton: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  addButtonText: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    marginTop: 54,
    paddingVertical: 80,
  },
  emptyTitle: {
    color: colors.paper,
    fontSize: 26,
    fontWeight: '800',
  },
  emptyCopy: {
    color: '#8f8795',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 560,
    textAlign: 'center',
  },
  list: {
    gap: 14,
    paddingBottom: 50,
    paddingTop: 38,
  },
  channel: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    flexDirection: 'row',
    minHeight: 88,
    paddingHorizontal: 24,
  },
  position: {
    color: '#5f5765',
    fontSize: 13,
    fontWeight: '700',
    width: 36,
  },
  color: {
    borderRadius: 8,
    height: 48,
    marginRight: 18,
    transform: [{ rotate: '-5deg' }],
    width: 48,
  },
  channelCopy: {
    flex: 1,
  },
  channelName: {
    color: '#d5ceda',
    fontSize: 18,
    fontWeight: '800',
  },
  query: {
    color: '#776f7d',
    fontSize: 11,
    marginTop: 5,
  },
  action: {
    backgroundColor: '#352c3c',
    borderRadius: radii.pill,
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    width: 80,
  },
  actionActive: {
    backgroundColor: '#264d43',
  },
  actionText: {
    color: '#8f8497',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  actionTextActive: {
    color: colors.mint,
  },
  remove: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  removeText: {
    color: '#b77c83',
    fontSize: 8,
    fontWeight: '900',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 5, 9, 0.88)',
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    padding: 38,
    width: 720,
  },
  modalEyebrow: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  modalTitle: {
    color: colors.paper,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 26,
    marginTop: 8,
  },
  fieldLabel: {
    color: '#8f8795',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#0f0c14',
    borderColor: '#3a3044',
    borderRadius: radii.sm,
    borderWidth: 2,
    color: colors.paper,
    fontSize: 17,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  cancelText: {
    color: '#9c93a2',
    fontSize: 14,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    marginLeft: 12,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  saveButtonDisabled: {
    opacity: 0.35,
  },
  saveText: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: '800',
  },
});
