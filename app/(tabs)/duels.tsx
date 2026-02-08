import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { DuelCard } from '@/components/DuelCard';

export default function DuelsScreen() {
  const { duels } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Duels</Text>
        <Text style={styles.subtitle}>Friendly challenges with friends</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Compete on consistency and effort, not weights or physiques. Small
              groups, big support.
            </Text>
          </View>

          {duels.map((duel) => (
            <DuelCard
              key={duel.id}
              challenge={duel.challenge}
              opponentName={duel.opponentName}
              opponentAvatar={duel.opponentAvatar}
              yourProgress={duel.yourProgress}
              opponentProgress={duel.opponentProgress}
              timeRemaining={duel.timeRemaining}
              goal={duel.goal}
            />
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    textAlign: 'center',
  },
});
