import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Interfaces ---
interface UserData {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  streakDays: number;
  totalWorkouts: number;
  overallProgress: number;
  stats: { strength: number; endurance: number; discipline: number; mobility: number; };
  muscleGroups: { chest: number; shoulders: number; back: number; legs: number; arms: number; };
}

interface Workout {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  unlocked: boolean;
  xpReward: number;
}

interface Duel {
  id: string;
  opponentName: string;
  challenge: string;
  aiProgress: number;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Fixed: Added 'workouts' and 'duels' to the Type definition
interface AppContextType {
  userData: UserData;
  workouts: Workout[];
  duels: Duel[];
  proofMessages: string[]; 
  completeWorkout: (workoutId: string) => void;
  resetStats: () => void;
}

const STORAGE_KEY = '@statlift_v7_kanak_final'; 

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialData: UserData = {
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    title: 'Beginner',
    streakDays: 0,
    totalWorkouts: 0,
    overallProgress: 0,
    stats: { strength: 0, endurance: 0, discipline: 0, mobility: 0 }, 
    muscleGroups: { chest: 0, shoulders: 0, back: 0, legs: 0, arms: 0 },
  };

  const [userData, setUserData] = useState<UserData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const [workouts] = useState<Workout[]>([
    { id: 'w1', name: 'Chest Press', muscleGroup: 'Chest', difficulty: 'Beginner', unlocked: true, xpReward: 20 },
    { id: 'w2', name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Beginner', unlocked: true, xpReward: 20 },
    { id: 'w3', name: 'Squats', muscleGroup: 'Legs', difficulty: 'Beginner', unlocked: true, xpReward: 25 },
  ]);

  const [duels] = useState<Duel[]>([
    { id: 'ai_1', opponentName: 'Titan AI', challenge: 'Reach 10% Strength', aiProgress: 10, reward: 'Bronze', difficulty: 'Easy' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setUserData(JSON.parse(saved));
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData, isLoading]);

  const completeWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    setUserData(prev => ({
      ...prev,
      currentXP: prev.currentXP + workout.xpReward,
      totalWorkouts: prev.totalWorkouts + 1,
      stats: { ...prev.stats, strength: prev.stats.strength + 2, discipline: prev.stats.discipline + 3 },
      muscleGroups: {
        ...prev.muscleGroups,
        [workout.muscleGroup.toLowerCase()]: (prev.muscleGroups[workout.muscleGroup.toLowerCase() as keyof typeof prev.muscleGroups] || 0) + 5
      },
      overallProgress: Math.min(prev.overallProgress + 2, 100)
    }));
  };

  const resetStats = () => setUserData(initialData);

  const proofMessages = userData.totalWorkouts === 0 
    ? ["Log a workout to start your journey!"] 
    : [`Strength: ${userData.stats.strength}%`, `Level ${userData.level} reached`];

  if (isLoading) return null;

  return (
    <AppContext.Provider value={{ userData, workouts, duels, proofMessages, completeWorkout, resetStats }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};