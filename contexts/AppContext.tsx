import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  streakDays: number;
  totalWorkouts: number;
  overallProgress: number;
  stats: {
    strength: number;
    endurance: number;
    discipline: number;
    mobility: number;
  };
  muscleGroups: {
    chest: number;
    shoulders: number;
    back: number;
    legs: number;
    arms: number;
  };
  unlockedWorkouts: string[];
}

interface Workout {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  unlocked: boolean;
  unlockCondition?: string;
  sets: number;
  reps: number;
  xpReward: number;
}

interface Duel {
  id: string;
  challenge: string;
  opponentName: string;
  opponentAvatar: string;
  yourProgress: number;
  opponentProgress: number;
  timeRemaining: string;
  goal: number;
}

interface AppContextType {
  userData: UserData;
  workouts: Workout[];
  duels: Duel[];
  proofMessages: string[];
  addXP: (amount: number) => void;
  completeSet: (workoutId: string) => void;
  completeWorkout: (workoutId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    level: 6,
    currentXP: 420,
    xpToNextLevel: 600,
    title: 'Rookie Lifter',
    streakDays: 6,
    totalWorkouts: 42,
    overallProgress: 38,
    stats: {
      strength: 45,
      endurance: 32,
      discipline: 68,
      mobility: 28,
    },
    muscleGroups: {
      chest: 42,
      shoulders: 38,
      back: 35,
      legs: 41,
      arms: 33,
    },
    unlockedWorkouts: [
      'chest-press',
      'shoulder-press',
      'lat-pulldown',
      'leg-press',
      'bicep-curl',
    ],
  });

  const [workouts] = useState<Workout[]>([
    {
      id: 'chest-press',
      name: 'Chest Press',
      muscleGroup: 'Chest',
      difficulty: 'Beginner',
      unlocked: true,
      sets: 3,
      reps: 10,
      xpReward: 15,
    },
    {
      id: 'incline-press',
      name: 'Incline Press',
      muscleGroup: 'Chest',
      difficulty: 'Beginner',
      unlocked: false,
      unlockCondition: 'Complete Chest Press 3 times',
      sets: 3,
      reps: 10,
      xpReward: 20,
    },
    {
      id: 'shoulder-press',
      name: 'Shoulder Press',
      muscleGroup: 'Shoulders',
      difficulty: 'Beginner',
      unlocked: true,
      sets: 3,
      reps: 10,
      xpReward: 15,
    },
    {
      id: 'lateral-raise',
      name: 'Lateral Raise',
      muscleGroup: 'Shoulders',
      difficulty: 'Beginner',
      unlocked: false,
      unlockCondition: 'Complete Shoulder Press 3 times',
      sets: 3,
      reps: 12,
      xpReward: 18,
    },
    {
      id: 'lat-pulldown',
      name: 'Lat Pulldown',
      muscleGroup: 'Back',
      difficulty: 'Beginner',
      unlocked: true,
      sets: 3,
      reps: 10,
      xpReward: 15,
    },
    {
      id: 'leg-press',
      name: 'Leg Press',
      muscleGroup: 'Legs',
      difficulty: 'Beginner',
      unlocked: true,
      sets: 3,
      reps: 12,
      xpReward: 20,
    },
    {
      id: 'bicep-curl',
      name: 'Bicep Curl',
      muscleGroup: 'Arms',
      difficulty: 'Beginner',
      unlocked: true,
      sets: 3,
      reps: 10,
      xpReward: 12,
    },
  ]);

  const [duels] = useState<Duel[]>([
    {
      id: '1',
      challenge: '3 gym check-ins this week',
      opponentName: 'Alex',
      opponentAvatar: '💪',
      yourProgress: 2,
      opponentProgress: 1,
      timeRemaining: '3 days',
      goal: 3,
    },
    {
      id: '2',
      challenge: 'Log 5 workouts in 7 days',
      opponentName: 'Jordan',
      opponentAvatar: '🔥',
      yourProgress: 3,
      opponentProgress: 4,
      timeRemaining: '2 days',
      goal: 5,
    },
  ]);

  const proofMessages = [
    'Your shoulders improved 2% this week',
    "You're lifting 15% more than when you started",
    'Discipline stat increased — consistency streak growing',
    'Your form is getting more consistent',
    'Chest strength up 8% from last month',
  ];

  const addXP = (amount: number) => {
    setUserData((prev) => {
      const newXP = prev.currentXP + amount;
      if (newXP >= prev.xpToNextLevel) {
        return {
          ...prev,
          level: prev.level + 1,
          currentXP: newXP - prev.xpToNextLevel,
          xpToNextLevel: Math.floor(prev.xpToNextLevel * 1.2),
        };
      }
      return { ...prev, currentXP: newXP };
    });
  };

  const completeSet = (workoutId: string) => {
    const workout = workouts.find((w) => w.id === workoutId);
    if (workout) {
      addXP(workout.xpReward / workout.sets);
    }
  };

  const completeWorkout = (workoutId: string) => {
    setUserData((prev) => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        workouts,
        duels,
        proofMessages,
        addXP,
        completeSet,
        completeWorkout,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
