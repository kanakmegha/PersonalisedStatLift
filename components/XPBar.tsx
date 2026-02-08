import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  title: string;
}

export function XPBar({ currentXP, maxXP, level, title }: XPBarProps) {
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming((currentXP / maxXP) * 100, { duration: 1000 });
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [currentXP, maxXP]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.level}>Level {level}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{level}</Text>
        </View>
      </View>

      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>
          {currentXP} / {maxXP} XP
        </Text>
        <Text style={styles.nextLevel}>to Level {level + 1}</Text>
      </View>

      <View style={styles.barContainer}>
        <Animated.View style={[styles.barFill, animatedStyle, pulseStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  level: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0a0a0a',
  },
  xpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  nextLevel: {
    fontSize: 12,
    color: '#888',
  },
  barContainer: {
    height: 12,
    backgroundColor: '#222',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 10,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
