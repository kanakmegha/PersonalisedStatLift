import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { XPBar } from '@/components/XPBar';
import { ProofCard } from '@/components/ProofCard';
import { StreakCard } from '@/components/StreakCard';
// Use lucide-react for better Web compatibility
import { Zap, Unlock } from 'lucide-react'; 
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { userData, proofMessages = [] } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [proofIndex, setProofIndex] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    // Rotate through proof messages on pull-to-refresh
    if (proofMessages.length > 0) {
      setProofIndex((prev) => (prev + 1) % proofMessages.length);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ff88" />
        }>
        <View style={styles.content}>
          {/* Personalized Greeting */}
          <Text style={styles.greeting}>Hey, Kanak Megha!</Text>

          <XPBar
            currentXP={userData.currentXP}
            maxXP={userData.xpToNextLevel}
            level={userData.level}
            title={userData.title}
          />

          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>
              {userData.overallProgress}% Complete
            </Text>
            <Text style={styles.motivationSubtext}>
              Keep going! Your discipline stat is currently {userData.stats.discipline}.
            </Text>
          </View>

          <View style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View>
                <Text style={styles.workoutLabel}>Today's Workout</Text>
                <Text style={styles.workoutName}>Full Body Routine</Text>
              </View>
              <View style={styles.unlockBadge}>
                <Unlock size={20} color="#00ff88" />
              </View>
            </View>
            <View style={styles.workoutFooter}>
              <View style={styles.xpBadge}>
                <Zap size={14} color="#0a0a0a" fill="#00ff88" />
                <Text style={styles.xpBadgeText}>+45 XP</Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/workout')}>
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Only show ProofCard if messages exist */}
          {proofMessages.length > 0 && (
            <ProofCard message={proofMessages[proofIndex]} />
          )}

          <StreakCard streakDays={userData.streakDays} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    // Add extra padding for web to look better on desktop
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: Platform.OS === 'web' ? 'center' : 'auto',
    width: '100%',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
  },
  motivationCard: {
    backgroundColor: '#00ff8811',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ff8833',
  },
  motivationTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00ff88',
    marginBottom: 8,
  },
  motivationSubtext: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  workoutCard: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  unlockBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff8822',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  xpBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a0a0a',
  },
  startButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0a0a0a',
  },
});