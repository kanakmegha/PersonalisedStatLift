import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

import { useState } from 'react';

import { useApp } from '@/contexts/AppContext';

import { StatBar } from '@/components/StatBar';

import { CheckCircle2, Play, Trophy, Bot, ChevronRight } from 'lucide-react';



export default function WorkoutScreen() {

  const { workouts, completeWorkout, userData } = useApp();

  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const [showCelebration, setShowCelebration] = useState(false);



  // Safety check: if workouts is undefined (common during loading), show a placeholder

  if (!workouts) {

    return (

      <View style={styles.container}>

        <Text style={styles.loadingText}>Loading training modules...</Text>

      </View>

    );

  }



  const handleComplete = () => {

    if (selectedWorkout) {

      completeWorkout(selectedWorkout.id);

      setShowCelebration(true);

    }

  };



  return (

    <ScrollView style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.header}>Training Modules</Text>

        

        {workouts.map((workout) => (

          <TouchableOpacity 

            key={workout.id} 

            style={styles.workoutCard}

            onPress={() => setSelectedWorkout(workout)}

          >

            <View style={styles.workoutInfo}>

              <Text style={styles.workoutName}>{workout.name}</Text>

              <Text style={styles.workoutMeta}>{workout.muscleGroup} • {workout.xpReward} XP</Text>

            </View>

            <Play size={20} color="#00ff88" />

          </TouchableOpacity>

        ))}



        {/* Workout Detail Modal */}

        <Modal visible={!!selectedWorkout && !showCelebration} transparent animationType="slide">

          <View style={styles.modalOverlay}>

            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>

              <Text style={styles.modalSub}>Focus: {selectedWorkout?.muscleGroup}</Text>

              

              <View style={styles.statPreview}>

                <Text style={styles.statLabel}>Current Mastery</Text>

                {/* Fixed: Dynamically get the muscle stat or default to 0 */}

                <StatBar 

                  label={selectedWorkout?.muscleGroup || 'Strength'} 

                  value={userData.muscleGroups[selectedWorkout?.muscleGroup.toLowerCase() as keyof typeof userData.muscleGroups] || 0} 

                />

              </View>



              <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>

                <Text style={styles.completeBtnText}>Complete Workout</Text>

              </TouchableOpacity>

              

              <TouchableOpacity onPress={() => setSelectedWorkout(null)}>

                <Text style={styles.closeText}>Cancel</Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>



        {/* Celebration Modal - Fixed the crash here */}

        <Modal visible={showCelebration} transparent animationType="fade">

          <View style={styles.modalOverlay}>

            <View style={[styles.modalContent, styles.celebrationContent]}>

              <Trophy size={60} color="#ffd700" />

              <Text style={styles.celebTitle}>Workout Smashed!</Text>

              

              {/* Added safe access ?. to prevent the 'map' / 'undefined' error */}

              <Text style={styles.celebrationXPText}>

                +{selectedWorkout?.xpReward || 0} XP earned

              </Text>



              <TouchableOpacity 

                style={styles.celebrationButton}

                onPress={() => {

                  setShowCelebration(false);

                  setSelectedWorkout(null);

                }}

              >

                <Text style={styles.celebrationButtonText}>Continue Grinding</Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>

      </View>

    </ScrollView>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#0a0a0a' },

  content: { padding: 20, paddingTop: 60 },

  header: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 25 },

  loadingText: { color: '#888', textAlign: 'center', marginTop: 100 },

  workoutCard: { 

    backgroundColor: '#151515', 

    borderRadius: 16, 

    padding: 20, 

    marginBottom: 12, 

    flexDirection: 'row', 

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#222'

  },

  workoutInfo: { flex: 1 },

  workoutName: { color: '#fff', fontSize: 18, fontWeight: '700' },

  workoutMeta: { color: '#888', fontSize: 14, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },

  modalContent: { backgroundColor: '#151515', borderRadius: 24, padding: 30, borderWidth: 1, borderColor: '#333' },

  modalTitle: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },

  modalSub: { color: '#888', textAlign: 'center', marginTop: 8, marginBottom: 20 },

  statPreview: { marginVertical: 20 },

  statLabel: { color: '#aaa', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },

  completeBtn: { backgroundColor: '#00ff88', padding: 18, borderRadius: 12, alignItems: 'center' },

  completeBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  closeText: { color: '#888', textAlign: 'center', marginTop: 20 },

  celebrationContent: { alignItems: 'center', backgroundColor: '#000', borderColor: '#00ff88' },

  celebTitle: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 20 },

  celebrationXPText: { color: '#00ff88', fontSize: 20, fontWeight: 'bold', marginVertical: 15 },

  celebrationButton: { backgroundColor: '#333', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },

  celebrationButtonText: { color: '#fff', fontWeight: '600' }

});