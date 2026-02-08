import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { TrendingUp } from 'lucide-react-native';

interface MuscleGroupCardProps {
  name: string;
  progress: number;
  improvement?: number;
  delay?: number;
}

export function MuscleGroupCard({
  name,
  progress,
  improvement,
  delay = 0,
}: MuscleGroupCardProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 400 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {improvement !== undefined && (
          <View style={styles.improvementBadge}>
            <TrendingUp size={12} color="#00ff88" strokeWidth={2.5} />
            <Text style={styles.improvementText}>+{improvement}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.progress}>{progress}%</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ff8822',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  improvementText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00ff88',
  },
  progress: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00ff88',
    marginBottom: 8,
  },
  barContainer: {
    height: 8,
    backgroundColor: '#222',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 6,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});
