import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, Unlock, Zap } from 'lucide-react-native';

interface WorkoutCardProps {
  name: string;
  muscleGroup: string;
  difficulty: string;
  unlocked: boolean;
  unlockCondition?: string;
  xpReward: number;
  onPress: () => void;
}

export function WorkoutCard({
  name,
  muscleGroup,
  difficulty,
  unlocked,
  unlockCondition,
  xpReward,
  onPress,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, !unlocked && styles.containerLocked]}
      onPress={onPress}
      disabled={!unlocked}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {unlocked ? (
            <Unlock size={20} color="#00ff88" strokeWidth={2.5} />
          ) : (
            <Lock size={20} color="#666" strokeWidth={2.5} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, !unlocked && styles.nameLocked]}>
            {name}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.muscleGroup}>{muscleGroup}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.difficulty}>{difficulty}</Text>
          </View>
        </View>
      </View>

      {unlocked ? (
        <View style={styles.xpBadge}>
          <Zap size={14} color="#0a0a0a" fill="#00ff88" />
          <Text style={styles.xpText}>+{xpReward} XP</Text>
        </View>
      ) : (
        <View style={styles.lockInfo}>
          <Text style={styles.lockText}>{unlockCondition}</Text>
        </View>
      )}
    </TouchableOpacity>
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
  containerLocked: {
    backgroundColor: '#111',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff8822',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  nameLocked: {
    color: '#666',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  muscleGroup: {
    fontSize: 13,
    color: '#00ff88',
    fontWeight: '600',
  },
  dot: {
    fontSize: 13,
    color: '#444',
    marginHorizontal: 6,
  },
  difficulty: {
    fontSize: 13,
    color: '#888',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0a0a0a',
  },
  lockInfo: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 8,
  },
  lockText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});
