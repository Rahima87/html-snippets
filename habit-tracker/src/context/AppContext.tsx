import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppState, Habit, User, ThemeMode, DailyChallenge, Achievement } from '../types';
import { storageService } from '../utils/storage';
import { calculateLevel, generateDailyChallenges, checkAchievements } from '../utils/gameUtils';
import { DIFFICULTY_XP } from '../constants/theme';

interface AppContextType {
  state: AppState;
  completeHabit: (habitId: string) => void;
  uncompleteHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates' | 'totalCompletions' | 'createdAt' | 'isArchived'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleTheme: () => void;
  completeChallenge: (challengeId: string) => void;
  gainXp: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

const initialUser: User = {
  id: '1',
  name: 'Habit Master',
  level: 1,
  xp: 0,
  totalXp: 0,
  avatar: '🚀',
  joinDate: new Date().toISOString(),
  achievements: [],
};

const initialState: AppState = {
  habits: [],
  user: initialUser,
  dailyChallenges: [],
  theme: 'light',
  statistics: {
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    averageCompletion: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  },
};

type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'COMPLETE_HABIT'; payload: string }
  | { type: 'UNCOMPLETE_HABIT'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'GAIN_XP'; payload: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_STATISTICS' }
  | { type: 'UPDATE_DAILY_CHALLENGES'; payload: DailyChallenge[] };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'COMPLETE_HABIT': {
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === action.payload && !habit.completedDates.includes(today)) {
          const newCompletedDates = [...habit.completedDates, today];
          const newStreak = calculateStreak(newCompletedDates);
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            totalCompletions: habit.totalCompletions + 1,
          };
        }
        return habit;
      });

      return {
        ...state,
        habits: updatedHabits,
      };
    }

    case 'UNCOMPLETE_HABIT': {
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === action.payload && habit.completedDates.includes(today)) {
          const newCompletedDates = habit.completedDates.filter(date => date !== today);
          const newStreak = calculateStreak(newCompletedDates);
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak,
            totalCompletions: Math.max(0, habit.totalCompletions - 1),
          };
        }
        return habit;
      });

      return {
        ...state,
        habits: updatedHabits,
      };
    }

    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload],
      };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };

    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        dailyChallenges: state.dailyChallenges.map(challenge =>
          challenge.id === action.payload
            ? { ...challenge, completed: true }
            : challenge
        ),
      };

    case 'GAIN_XP': {
      const newTotalXp = state.user.totalXp + action.payload;
      const newLevel = calculateLevel(newTotalXp);
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload,
          totalXp: newTotalXp,
          level: newLevel,
        },
      };
    }

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: [...state.user.achievements, action.payload],
        },
      };

    case 'UPDATE_DAILY_CHALLENGES':
      return {
        ...state,
        dailyChallenges: action.payload,
      };

    case 'UPDATE_STATISTICS': {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = state.habits.filter(habit =>
        habit.completedDates.includes(today)
      ).length;

      const totalCompletions = state.habits.reduce(
        (sum, habit) => sum + habit.totalCompletions,
        0
      );

      const currentStreak = Math.max(
        ...state.habits.map(habit => habit.streak),
        0
      );

      const longestStreak = Math.max(
        ...state.habits.map(habit => habit.longestStreak),
        0
      );

      // Calculate weekly progress (last 7 days)
      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        return state.habits.filter(habit =>
          habit.completedDates.includes(dateString)
        ).length;
      }).reverse();

      const averageCompletion = state.habits.length > 0
        ? (totalCompletions / state.habits.length) || 0
        : 0;

      return {
        ...state,
        statistics: {
          totalHabits: state.habits.length,
          completedToday,
          currentStreak,
          longestStreak,
          totalCompletions,
          averageCompletion,
          weeklyProgress,
        },
      };
    }

    default:
      return state;
  }
};

const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayString = today.toISOString().split('T')[0];
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // Check if today or yesterday is completed (streak can continue)
  if (!sortedDates.includes(todayString) && !sortedDates.includes(yesterdayString)) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(today);

  for (const dateString of sortedDates) {
    const completedDate = new Date(dateString);
    const expectedDate = currentDate.toISOString().split('T')[0];

    if (dateString === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
    dispatch({ type: 'UPDATE_STATISTICS' });
  }, [state.habits, state.user]);

  useEffect(() => {
    // Update daily challenges daily
    const today = new Date().toISOString().split('T')[0];
    if (state.dailyChallenges.length === 0 || 
        (state.dailyChallenges[0] && state.dailyChallenges[0].date !== today)) {
      const newChallenges = generateDailyChallenges();
      dispatch({ type: 'UPDATE_DAILY_CHALLENGES', payload: newChallenges });
    }
  }, [state.dailyChallenges]);

  const loadState = async () => {
    try {
      const savedState = await storageService.loadState();
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async () => {
    try {
      await storageService.saveState(state);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const completeHabit = async (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    if (habit.completedDates.includes(today)) return;

    dispatch({ type: 'COMPLETE_HABIT', payload: habitId });
    dispatch({ type: 'GAIN_XP', payload: habit.xpReward });

    // Check for achievements
    const newAchievements = checkAchievements(state, habitId);
    newAchievements.forEach(achievement => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
      dispatch({ type: 'GAIN_XP', payload: achievement.xpReward });
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const uncompleteHabit = async (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    if (!habit.completedDates.includes(today)) return;

    dispatch({ type: 'UNCOMPLETE_HABIT', payload: habitId });
    dispatch({ type: 'GAIN_XP', payload: -habit.xpReward });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates' | 'totalCompletions' | 'createdAt' | 'isArchived'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      totalCompletions: 0,
      xpReward: DIFFICULTY_XP[habitData.difficulty],
      createdAt: new Date().toISOString(),
      isArchived: false,
    };

    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id: habitId, updates } });
  };

  const deleteHabit = async (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_HABIT', payload: habitId });
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = state.dailyChallenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      dispatch({ type: 'COMPLETE_CHALLENGE', payload: challengeId });
      dispatch({ type: 'GAIN_XP', payload: challenge.xpReward });
    }
  };

  const gainXp = (amount: number) => {
    dispatch({ type: 'GAIN_XP', payload: amount });
  };

  const unlockAchievement = (achievementId: string) => {
    // This would be called when an achievement is unlocked
    // Implementation depends on specific achievement logic
  };

  const value: AppContextType = {
    state,
    completeHabit,
    uncompleteHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleTheme,
    completeChallenge,
    gainXp,
    unlockAchievement,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};