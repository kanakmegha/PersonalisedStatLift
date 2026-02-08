import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
  } from 'react-native';
  import { useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useApp } from '@/contexts/AppContext';
  import { WorkoutCard } from '@/components/WorkoutCard';
  import { X, Check, Zap } from 'lucide-react-native';
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
  } from 'react-native-reanimated';
  
  interface WorkoutDetail {
    id: string;
    name: string;
    muscleGroup: string;
    sets: number;
    reps: number;
    xpReward: number;
  }
  
  export default function WorkoutScreen() {
    const { workouts, completeSet, completeWorkout, addXP } = useApp();
    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(
      null
    );
    const [currentSet, setCurrentSet] = useState(1);
    const [weight, setWeight] = useState('20');
    const [repsCompleted, setRepsCompleted] = useState('10');
    const [completedSets, setCompletedSets] = useState<number[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
  
    const xpFloat = useSharedValue(0);
  
    const handleWorkoutPress = (workout: any) => {
      if (workout.unlocked) {
        setSelectedWorkout(workout);
        setCurrentSet(1);
        setCompletedSets([]);
        setWeight('20');
        setRepsCompleted(workout.reps.toString());
      }
    };
  
    const handleCompleteSet = () => {
      const xpPerSet = Math.floor(
        (selectedWorkout?.xpReward || 0) / (selectedWorkout?.sets || 1)
      );
  
      xpFloat.value = withSequence(
        withSpring(-30, { damping: 8 }),
        withTiming(0, { duration: 0 })
      );
  
      completeSet(selectedWorkout?.id || '');
      setCompletedSets([...completedSets, currentSet]);
  
      if (currentSet < (selectedWorkout?.sets || 0)) {
        setCurrentSet(currentSet + 1);
      } else {
        setTimeout(() => {
          setShowCelebration(true);
          completeWorkout(selectedWorkout?.id || '');
        }, 500);
      }
    };
  
    const handleCloseCelebration = () => {
      setShowCelebration(false);
      setSelectedWorkout(null);
    };
  
    const animatedXPStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: xpFloat.value }],
    }));
  
    const muscleGroups = Array.from(
      new Set(workouts.map((w) => w.muscleGroup))
    );
  
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Choose your exercise</Text>
        </View>
  
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {muscleGroups.map((group) => (
            <View key={group} style={styles.section}>
              <Text style={styles.sectionTitle}>{group}</Text>
              {workouts
                .filter((w) => w.muscleGroup === group)
                .map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    name={workout.name}
                    muscleGroup={workout.muscleGroup}
                    difficulty={workout.difficulty}
                    unlocked={workout.unlocked}
                    unlockCondition={workout.unlockCondition}
                    xpReward={workout.xpReward}
                    onPress={() => handleWorkoutPress(workout)}
                  />
                ))}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
  
        <Modal
          visible={selectedWorkout !== null && !showCelebration}
          animationType="slide"
          presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalContent} edges={['top']}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setSelectedWorkout(null)}
                  style={styles.closeButton}>
                  <X size={24} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedWorkout?.muscleGroup}
                  </Text>
                </View>
                <View style={{ width: 40 }} />
              </View>
  
              <View style={styles.demoPlaceholder}>
                <Text style={styles.demoText}>Exercise Demo</Text>
              </View>
  
              <View style={styles.safetyCue}>
                <Text style={styles.safetyCueText}>
                  Keep your back straight and core engaged
                </Text>
              </View>
  
              <View style={styles.setProgress}>
                <Text style={styles.setProgressText}>
                  Set {currentSet} of {selectedWorkout?.sets}
                </Text>
                <View style={styles.setDots}>
                  {Array.from({ length: selectedWorkout?.sets || 0 }).map(
                    (_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.setDot,
                          completedSets.includes(i + 1) && styles.setDotCompleted,
                          i + 1 === currentSet && styles.setDotActive,
                        ]}
                      />
                    )
                  )}
                </View>
              </View>
  
              <View style={styles.inputSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="20"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={repsCompleted}
                    onChangeText={setRepsCompleted}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
  
              {completedSets.includes(currentSet) ? (
                <View style={styles.xpEarned}>
                  <Animated.View style={[styles.xpFloat, animatedXPStyle]}>
                    <Zap size={20} color="#00ff88" fill="#00ff88" />
                    <Text style={styles.xpFloatText}>
                      +
                      {Math.floor(
                        (selectedWorkout?.xpReward || 0) /
                          (selectedWorkout?.sets || 1)
                      )}{' '}
                      XP
                    </Text>
                  </Animated.View>
                </View>
              ) : null}
  
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  completedSets.includes(currentSet) &&
                    styles.completeButtonDisabled,
                ]}
                onPress={handleCompleteSet}
                disabled={completedSets.includes(currentSet)}>
                <Check size={24} color="#0a0a0a" strokeWidth={3} />
                <Text style={styles.completeButtonText}>
                  {currentSet === selectedWorkout?.sets
                    ? 'Complete Workout'
                    : 'Complete Set'}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </Modal>
  
        <Modal
          visible={showCelebration}
          animationType="fade"
          transparent={true}>
          <View style={styles.celebrationOverlay}>
            <View style={styles.celebrationCard}>
              <Text style={styles.celebrationTitle}>Workout Complete!</Text>
              <Text style={styles.celebrationSubtitle}>That counts. Nice work.</Text>
              <View style={styles.celebrationXP}>
                <Zap size={32} color="#00ff88" fill="#00ff88" />
                <Text style={styles.celebrationXPText}>
                  +{selectedWorkout?.xpReward} XP
                </Text>
              </View>
              <TouchableOpacity
                style={styles.celebrationButton}
                onPress={handleCloseCelebration}>
                <Text style={styles.celebrationButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 12,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#0a0a0a',
    },
    modalContent: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#1a1a1a',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalHeaderText: {
      flex: 1,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#fff',
    },
    modalSubtitle: {
      fontSize: 13,
      color: '#00ff88',
      marginTop: 2,
    },
    demoPlaceholder: {
      height: 200,
      backgroundColor: '#151515',
      margin: 20,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#222',
    },
    demoText: {
      fontSize: 16,
      color: '#666',
      fontWeight: '600',
    },
    safetyCue: {
      backgroundColor: '#00ff8811',
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#00ff8833',
    },
    safetyCueText: {
      fontSize: 14,
      color: '#00ff88',
      fontWeight: '600',
      textAlign: 'center',
    },
    setProgress: {
      marginHorizontal: 20,
      marginBottom: 24,
    },
    setProgressText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 12,
    },
    setDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    setDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#222',
    },
    setDotCompleted: {
      backgroundColor: '#00ff88',
    },
    setDotActive: {
      backgroundColor: '#00ff8866',
      borderWidth: 2,
      borderColor: '#00ff88',
    },
    inputSection: {
      flexDirection: 'row',
      marginHorizontal: 20,
      gap: 12,
      marginBottom: 24,
    },
    inputGroup: {
      flex: 1,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#888',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#151515',
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
      borderWidth: 1,
      borderColor: '#222',
    },
    xpEarned: {
      marginHorizontal: 20,
      marginBottom: 24,
      alignItems: 'center',
    },
    xpFloat: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#00ff8822',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      gap: 6,
    },
    xpFloatText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#00ff88',
    },
    completeButton: {
      backgroundColor: '#00ff88',
      marginHorizontal: 20,
      padding: 18,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 'auto',
      marginBottom: 20,
    },
    completeButtonDisabled: {
      backgroundColor: '#333',
    },
    completeButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#0a0a0a',
    },
    celebrationOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    celebrationCard: {
      backgroundColor: '#151515',
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#00ff88',
      shadowColor: '#00ff88',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
    },
    celebrationTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#fff',
      marginBottom: 8,
    },
    celebrationSubtitle: {
      fontSize: 16,
      color: '#888',
      marginBottom: 24,
    },
    celebrationXP: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#00ff8822',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 24,
      gap: 12,
      marginBottom: 24,
    },
    celebrationXPText: {
      fontSize: 28,
      fontWeight: '900',
      color: '#00ff88',
    },
    celebrationButton: {
      backgroundColor: '#00ff88',
      paddingHorizontal: 40,
      paddingVertical: 16,
      borderRadius: 16,
    },
    celebrationButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#0a0a0a',
    },
  });
  