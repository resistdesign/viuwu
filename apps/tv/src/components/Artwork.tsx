import { StyleSheet, View } from 'react-native';

import type { VideoItem } from '@viuwu/core';

interface ArtworkProps {
  artwork: VideoItem['artwork'];
}

export function Artwork({ artwork }: ArtworkProps) {
  return (
    <View style={[styles.artwork, { backgroundColor: artwork.background }]}>
      {artwork.motif === 'grid' && <View style={styles.grid} />}
      {artwork.motif === 'burst' && (
        <>
          <View style={[styles.burst, styles.burstOne]} />
          <View style={[styles.burst, styles.burstTwo]} />
        </>
      )}
      {artwork.motif === 'waves' && (
        <>
          <View style={[styles.wave, styles.waveOne]} />
          <View style={[styles.wave, styles.waveTwo]} />
        </>
      )}
      {artwork.motif === 'rings' && (
        <>
          <View style={[styles.ring, styles.ringOne]} />
          <View style={[styles.ring, styles.ringTwo]} />
        </>
      )}
      {artwork.motif === 'orbit' && (
        <>
          <View style={styles.orbit} />
          <View style={styles.planet} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    height: 118,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.28)',
    borderLeftWidth: 24,
    borderRightWidth: 24,
    height: 170,
    left: 46,
    position: 'absolute',
    top: -28,
    transform: [{ rotate: '24deg' }],
    width: 106,
  },
  burst: {
    backgroundColor: '#ffcf4a',
    height: 190,
    position: 'absolute',
    top: -36,
    width: 24,
  },
  burstOne: {
    left: 82,
    transform: [{ rotate: '30deg' }],
  },
  burstTwo: {
    left: 150,
    transform: [{ rotate: '-20deg' }],
  },
  wave: {
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 90,
    borderWidth: 10,
    height: 112,
    position: 'absolute',
    width: 190,
  },
  waveOne: {
    left: -20,
    top: 44,
  },
  waveTwo: {
    left: 90,
    top: 16,
  },
  ring: {
    borderColor: '#ff806b',
    borderRadius: 80,
    borderWidth: 16,
    position: 'absolute',
  },
  ringOne: {
    height: 110,
    right: 22,
    top: -34,
    width: 110,
  },
  ringTwo: {
    bottom: -54,
    height: 130,
    left: 18,
    width: 130,
  },
  orbit: {
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 90,
    borderWidth: 4,
    height: 80,
    left: 30,
    position: 'absolute',
    top: 17,
    transform: [{ rotate: '-12deg' }],
    width: 180,
  },
  planet: {
    backgroundColor: '#73d6b2',
    borderRadius: 26,
    height: 52,
    left: 96,
    position: 'absolute',
    top: 33,
    width: 52,
  },
});
