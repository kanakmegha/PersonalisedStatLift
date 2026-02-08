import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

interface DuelCardProps {
  challenge: string;
  opponentName: string;
  opponentAvatar: string;
  yourProgress: number;
  opponentProgress: number;
  timeRemaining: string;
  goal: number;
}

export function DuelCard({
  challenge,
  opponentName,
  opponentAvatar,
  yourProgress,
  opponentProgress,
  timeRemaining,
  goal,
}: DuelCardProps) {
  const yourPercentage = (yourProgress / goal) * 100;
  const opponentPercentage = (opponentProgress / goal) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.challenge}>{challenge}</Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#888" strokeWidth={2} />
          <Text style={styles.timeText}>{timeRemaining}</Text>
        </View>
      </View>

      <View style={styles.participant}>
        <View style={styles.participantHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>💪</Text>
          </View>
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>You</Text>
            <Text style={styles.participantProgress}>
              {yourProgress} / {goal}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              styles.progressBarYours,
              { width: `${yourPercentage}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.participant}>
        <View style={styles.participantHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{opponentAvatar}</Text>
          </View>
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>{opponentName}</Text>
            <Text style={styles.participantProgress}>
              {opponentProgress} / {goal}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              styles.progressBarOpponent,
              { width: `${opponentPercentage}%` },
            ]}
          />
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  challenge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  participant: {
    marginBottom: 16,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  participantProgress: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#222',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressBarYours: {
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  progressBarOpponent: {
    backgroundColor: '#0088ff',
    shadowColor: '#0088ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});
