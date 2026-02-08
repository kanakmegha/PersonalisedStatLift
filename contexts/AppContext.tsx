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
  unlockedWorkouts: string[];
}

interface Workout {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  unlocked: boolean;
  sets: number;
  reps: number;
  xpReward: number;
}

interface AppContextType {
  userData: UserData;
  workouts: Workout[];
  proofMessages: string[]; 
  addXP: (amount: number) => void;
  completeWorkout: (workoutId: string) => void;
  resetStats: () => void;
}

const STORAGE_KEY = '@statlift_user_data_v2'; // Changed key to force-refresh old data

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Initial Personal Stats - All set to 0 for a fresh start
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
    unlockedWorkouts: ['chest-press', 'shoulder-press'],
  };

  const [userData, setUserData] = useState<UserData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Load Data on Startup
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setUserData(JSON.parse(savedData));
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. Save Data whenever userData changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData, isLoading]);

  const [workouts] = useState<Workout[]>([
    { id: 'chest-press', name: 'Chest Press', muscleGroup: 'Chest', difficulty: 'Beginner', unlocked: true, sets: 3, reps: 10, xpReward: 15 },
    { id: 'shoulder-press', name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Beginner', unlocked: true, sets: 3, reps: 10, xpReward: 15 },
    { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', difficulty: 'Beginner', unlocked: true, sets: 3, reps: 10, xpReward: 15 },
    { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', difficulty: 'Beginner', unlocked: true, sets: 3, reps: 12, xpReward: 20 },
  ]);

  // 4. Dynamic Proof Messages - Generates messages based on real stats
  const getDynamicMessages = () => {
    if (userData.totalWorkouts === 0) {
      return ["Log your first workout to see progress proof!"];
    }

    const groups = Object.entries(userData.muscleGroups);
    const strongest = groups.reduce((a, b) => (a[1] > b[1] ? a : b));

    return [
      `Your ${strongest[0]} strength has increased by ${strongest[1]}%`,
      `Discipline: ${userData.stats.discipline} — consistency is building`,
      `You've completed ${userData.totalWorkouts} total workouts`,
      `StatLift Analytics: ${userData.overallProgress}% goal completion`,
    ];
  };

  const proofMessages = getDynamicMessages();

  const addXP = (amount: number) => {
    setUserData((prev) => {
      const newXP = prev.currentXP + amount;
      if (newXP >= prev.xpToNextLevel) {
        return {
          ...prev,
          level: prev.level + 1,
          currentXP: newXP - prev.xpToNextLevel,
          xpToNextLevel: Math.floor(prev.xpToNextLevel * 1.3),
          title: prev.level + 1 >= 5 ? 'Adept' : 'Beginner',
        };
      }
      return { ...prev, currentXP: newXP };
    });
  };

  const completeWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      addXP(workout.xpReward);
      
      setUserData(prev => ({
        ...prev,
        totalWorkouts: prev.totalWorkouts + 1,
        streakDays: prev.streakDays + 1,
        stats: {
          ...prev.stats,
          strength: prev.stats.strength + 2,
          discipline: prev.stats.discipline + 3,
        },
        muscleGroups: {
          ...prev.muscleGroups,
          [workout.muscleGroup.toLowerCase()]: (prev.muscleGroups[workout.muscleGroup.toLowerCase() as keyof typeof prev.muscleGroups] || 0) + 5
        },
        overallProgress: Math.min(prev.overallProgress + 1, 100),
      }));
    }
  };

  const resetStats = () => {
    AsyncStorage.removeItem(STORAGE_KEY);
    setUserData(initialData);
  };

  if (isLoading) return null;

  return (
    <AppContext.Provider
      value={{
        userData,
        workouts,
        proofMessages,
        addXP,
        completeWorkout,
        resetStats,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}