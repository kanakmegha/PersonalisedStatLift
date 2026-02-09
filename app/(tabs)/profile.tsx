import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useApp } from '@/contexts/AppContext';

import { StatBar } from '@/components/StatBar';



export default function StatsScreen() {

  const { userData } = useApp();



  return (

    <ScrollView style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.title}>Your Attributes</Text>

        

        {/* These now use the real 0% values from Context */}

        <StatBar label="Strength" value={userData.stats.strength} />

        <StatBar label="Endurance" value={userData.stats.endurance} />

        <StatBar label="Discipline" value={userData.stats.discipline} />

        <StatBar label="Mobility" value={userData.stats.mobility} />



        <Text style={[styles.title, { marginTop: 30 }]}>Muscle Mastery</Text>

        <StatBar label="Chest" value={userData.muscleGroups.chest} />

        <StatBar label="Shoulders" value={userData.muscleGroups.shoulders} />

        <StatBar label="Back" value={userData.muscleGroups.back} />

      </View>

    </ScrollView>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#0a0a0a' },

  content: { padding: 20 },

  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 }

});