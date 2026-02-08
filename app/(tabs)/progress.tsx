import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { StatBar } from '@/components/StatBar';
import { MuscleGroupCard } from '@/components/MuscleGroupCard';

export default function ProgressScreen() {
  const { userData } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Your journey so far</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.overallCard}>
            <Text style={styles.overallLabel}>Overall Progress</Text>
            <Text style={styles.overallProgress}>
              {userData.overallProgress}%
            </Text>
            <Text style={styles.overallSubtext}>
              Compared to where you started, not others
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Muscle Groups</Text>
            <MuscleGroupCard
              name="Chest"
              progress={userData.muscleGroups.chest}
              improvement={2}
              delay={0}
            />
            <MuscleGroupCard
              name="Shoulders"
              progress={userData.muscleGroups.shoulders}
              delay={100}
            />
            <MuscleGroupCard
              name="Back"
              progress={userData.muscleGroups.back}
              delay={200}
            />
            <MuscleGroupCard
              name="Legs"
              progress={userData.muscleGroups.legs}
              delay={300}
            />
            <MuscleGroupCard
              name="Arms"
              progress={userData.muscleGroups.arms}
              delay={400}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={styles.statsCard}>
              <StatBar
                label="Strength"
                value={userData.stats.strength}
                delay={500}
              />
              <StatBar
                label="Endurance"
                value={userData.stats.endurance}
                delay={600}
              />
              <StatBar
                label="Discipline"
                value={userData.stats.discipline}
                delay={700}
              />
              <StatBar
                label="Mobility"
                value={userData.stats.mobility}
                delay={800}
              />
            </View>
          </View>
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
  overallCard: {
    backgroundColor: '#00ff8811',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#00ff8833',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  overallProgress: {
    fontSize: 64,
    fontWeight: '900',
    color: '#00ff88',
    marginBottom: 8,
  },
  overallSubtext: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
});
