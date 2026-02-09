import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

import { useState } from 'react';

import { useApp } from '@/contexts/AppContext';

import { StatBar } from '@/components/StatBar';

import { Play, Trophy, X } from 'lucide-react';



export default function WorkoutScreen() {

  const { workouts, completeWorkout, userData } = useApp();

  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const [showCelebration, setShowCelebration] = useState(false);



  const handleComplete = () => {

    if (selectedWorkout) {

      completeWorkout(selectedWorkout.id);

      setShowCelebration(true);

    }

  };



  return (

    <ScrollView style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.header}>Workouts</Text>

        

        {workouts.map((workout) => (

          <TouchableOpacity 

            key={workout.id} 

            style={styles.card} 

            onPress={() => setSelectedWorkout(workout)}

          >

            <View style={{ flex: 1 }}>

              <Text style={styles.workoutName}>{workout.name}</Text>

              <Text style={styles.workoutMeta}>{workout.muscleGroup} • {workout.xpReward} XP</Text>

            </View>

            <Play size={20} color="#00ff88" />

          </TouchableOpacity>

        ))}



        {/* Details Modal */}

        <Modal visible={!!selectedWorkout && !showCelebration} transparent animationType="slide">

          <View style={styles.modalOverlay}>

            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>

              <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>

                <Text style={styles.btnText}>Finish Workout</Text>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSelectedWorkout(null)}>

                <Text style={styles.cancelText}>Close</Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>



        {/* Success Modal */}

        <Modal visible={showCelebration} transparent animationType="fade">

          <View style={styles.modalOverlay}>

            <View style={[styles.modalContent, { alignItems: 'center' }]}>

              <Trophy size={50} color="#ffd700" />

              <Text style={styles.celebTitle}>Great Job!</Text>

              <Text style={styles.xpText}>+{selectedWorkout?.xpReward} XP</Text>

              <TouchableOpacity 

                style={styles.closeCeleb} 

                onPress={() => { setShowCelebration(false); setSelectedWorkout(null); }}

              >

                <Text style={styles.btnText}>Continue</Text>

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

  header: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 20 },

  card: { backgroundColor: '#151515', padding: 20, borderRadius: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222' },

  workoutName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  workoutMeta: { color: '#888', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },

  modalContent: { backgroundColor: '#111', borderRadius: 20, padding: 30, borderWidth: 1, borderColor: '#333' },

  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  completeBtn: { backgroundColor: '#00ff88', padding: 15, borderRadius: 10, alignItems: 'center' },

  btnText: { color: '#000', fontWeight: 'bold' },

  cancelText: { color: '#888', textAlign: 'center', marginTop: 15 },

  celebTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 10 },

  xpText: { color: '#00ff88', fontSize: 18, marginVertical: 10 },

  closeCeleb: { backgroundColor: '#333', padding: 12, borderRadius: 20, width: '100%', alignItems: 'center' }

});

