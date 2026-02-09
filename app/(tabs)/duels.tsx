import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useApp } from '@/contexts/AppContext';

import { StatBar } from '@/components/StatBar'; // Reuse your StatBar component

import { Bot, Trophy } from 'lucide-react';



export default function DuelsScreen() {

  const { duels, userData } = useApp();



  return (

    <ScrollView style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.header}>AI Active Duels</Text>

        

        {duels.map((duel) => {

          // Calculate your progress relative to the AI's goal

          const myProgress = userData.stats.strength; 

          const isWinning = myProgress >= duel.aiProgress;



          return (

            <View key={duel.id} style={styles.card}>

              <View style={styles.cardHeader}>

                <Bot color={isWinning ? "#00ff88" : "#888"} size={24} />

                <View style={styles.nameContainer}>

                  <Text style={styles.opponentName}>{duel.opponentName}</Text>

                  <Text style={styles.difficulty}>{duel.difficulty} Difficulty</Text>

                </View>

                <Trophy size={20} color="#ffd700" />

              </View>



              <Text style={styles.challengeText}>{duel.challenge}</Text>

              

              <View style={styles.statsContainer}>

                <StatBar label="Your Progress" value={myProgress} />

                <View style={styles.aiGoalMarker}>

                  <Text style={styles.goalText}>AI Goal: {duel.aiProgress}%</Text>

                </View>

              </View>



              {isWinning ? (

                <View style={styles.winBadge}>

                  <Text style={styles.winText}>WINNING</Text>

                </View>

              ) : (

                <Text style={styles.remainText}>

                  Need {duel.aiProgress - myProgress}% more to beat them!

                </Text>

              )}

            </View>

          );

        })}

      </View>

    </ScrollView>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#0a0a0a' },

  content: { padding: 20, paddingTop: 60 },

  header: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 25 },

  card: { backgroundColor: '#151515', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#222' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },

  nameContainer: { flex: 1, marginLeft: 12 },

  opponentName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  difficulty: { color: '#888', fontSize: 12 },

  challengeText: { color: '#aaa', fontSize: 14, marginBottom: 20 },

  statsContainer: { marginTop: 10 },

  aiGoalMarker: { marginTop: -10, marginBottom: 15 },

  goalText: { color: '#ff4444', fontSize: 11, fontWeight: 'bold', textAlign: 'right' },

  winBadge: { backgroundColor: '#00ff8822', padding: 8, borderRadius: 8, alignItems: 'center' },

  winText: { color: '#00ff88', fontWeight: 'bold', fontSize: 12 },

  remainText: { color: '#888', fontSize: 12, fontStyle: 'italic', textAlign: 'center' }

});