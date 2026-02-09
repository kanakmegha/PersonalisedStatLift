import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface UserData {
  id: string;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
  streak_days: number;
  total_workouts: number;
  stats: { strength: number; discipline: number; };
  muscle_groups: { chest: number; back: number; legs: number; };
  workout_history: string[];
}

interface Workout {
  id: string;
  name: string;
  muscle_group: string;
  xp_reward: number;
}

interface AppContextType {
  userData: UserData | null;
  workouts: Workout[];
  completeWorkout: (workoutId: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [workouts] = useState<Workout[]>([
    { id: 'w1', name: 'Chest Press', muscle_group: 'Chest', xp_reward: 20 },
    { id: 'w2', name: 'Deadlift', muscle_group: 'Back', xp_reward: 30 },
  ]);

  // Load Data from Supabase on Mount
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setUserData(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const completeWorkout = async (workoutId: string) => {
    if (!userData) return;
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const today = new Date().toISOString().split('T')[0];

    // 1. Logic for Streak and Stats
    const isNewDay = !userData.workout_history.includes(today);
    const updatedData = {
      ...userData,
      current_xp: userData.current_xp + workout.xp_reward,
      total_workouts: userData.total_workouts + 1,
      streak_days: isNewDay ? userData.streak_days + 1 : userData.streak_days,
      workout_history: isNewDay ? [...userData.workout_history, today] : userData.workout_history,
      stats: {
        ...userData.stats,
        strength: userData.stats.strength + 2,
        discipline: userData.stats.discipline + 5
      }
    };

    // 2. Optimistic UI update
    setUserData(updatedData);

    // 3. Database Sync (Parallel calls)
    await Promise.all([
      supabase.from('profiles').update({
        current_xp: updatedData.current_xp,
        total_workouts: updatedData.total_workouts,
        streak_days: updatedData.streak_days,
        stats: updatedData.stats,
        workout_history: updatedData.workout_history
      }).eq('id', userData.id),
      
      supabase.from('workout_logs').insert([
        { user_id: userData.id, workout_id: workoutId, date: today }
      ])
    ]);
  };

  return (
    <AppContext.Provider value={{ userData, workouts, completeWorkout, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};