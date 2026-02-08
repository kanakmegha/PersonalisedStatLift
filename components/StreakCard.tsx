import { View, Text, StyleSheet } from 'react-native';
// Fix for Vercel Web compatibility
import { Flame } from 'lucide-react';

interface StreakCardProps {
  streakDays: number;
}

export function StreakCard({ streakDays }: StreakCardProps) {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // LOGIC: Create a real array based on your actual streak
  // This lights up circles from left to right based on your streak count
  const completedDays = weekDays.map((_, index) => index < streakDays);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.flameContainer}>
          <Flame size={24} color="#ff6b00" fill="#ff6b00" strokeWidth={2} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.streakNumber}>
            {streakDays === 0 ? 'Start your streak!' : `${streakDays}-day streak`}
          </Text>
          <Text style={styles.subtitle}>
            {streakDays === 0 ? 'Complete a workout today' : 'Keep it going!'}
          </Text>
        </View>
      </View>

      <View style={styles.calendar}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View
              style={[
                styles.dayCircle,
                completedDays[index] && styles.dayCircleActive,
              ]}>
              {completedDays[index] && (
                <View style={styles.dayCircleInner} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  flameContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6b0022',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#00ff88',
  },
  dayCircleInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0a0a0a',
  },
});