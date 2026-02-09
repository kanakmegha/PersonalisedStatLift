import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface StatBarProps { label: string; value: number; }

export function StatBar({ label, value }: StatBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(value, { duration: 1000 });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.bg}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: '#888', fontSize: 14 },
  value: { color: '#00ff88', fontWeight: '700' },
  bg: { height: 8, backgroundColor: '#222', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#00ff88' }
});