import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
// Web-safe icon import
import { Sparkles } from 'lucide-react';

interface ProofCardProps {
  message: string;
}

export function ProofCard({ message }: ProofCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Reset values first
    opacity.value = 0;
    translateY.value = 20;
    
    // Animate in
    opacity.value = withDelay(100, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600 }));
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    /* We add a key here so the component re-mounts/re-animates when the message changes */
    <Animated.View key={message} style={[styles.container, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Sparkles size={24} color="#00ff88" strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Proof of Progress</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00ff8822',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#00ff88',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
  },
});