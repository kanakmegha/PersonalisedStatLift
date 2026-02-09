import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { XPBar } from '@/components/XPBar';
import { ProofCard } from '@/components/ProofCard';
import { StreakCard } from '@/components/StreakCard';

export default function HomeScreen() {
  const { userData, proofMessages } = useApp();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hey, Kanak Megha!</Text>

        <XPBar
          currentXP={userData.currentXP}
          maxXP={userData.xpToNextLevel}
          level={userData.level}
          title={userData.title}
        />

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>{userData.overallProgress}% there</Text>
          <Text style={styles.motivationSubtext}>Keep pushing, you're just getting started.</Text>
        </View>

        <ProofCard message={proofMessages[0]} />
        <StreakCard streakDays={userData.streakDays} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 20 },
  motivationCard: { backgroundColor: '#00ff8811', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#00ff8833' },
  motivationTitle: { fontSize: 32, fontWeight: '900', color: '#00ff88' },
  motivationSubtext: { fontSize: 14, color: '#888' }
});