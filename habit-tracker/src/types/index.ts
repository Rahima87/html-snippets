export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: HabitCategory;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  totalCompletions: number;
  xpReward: number;
  difficulty: HabitDifficulty;
  createdAt: string;
  isArchived: boolean;
}

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalXp: number;
  avatar: string;
  joinDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  date: string;
}

export interface Statistics {
  totalHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  averageCompletion: number;
  weeklyProgress: number[];
}

export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'productivity' 
  | 'learning' 
  | 'social' 
  | 'mindfulness' 
  | 'creativity' 
  | 'finance' 
  | 'other';

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  habits: Habit[];
  user: User;
  dailyChallenges: DailyChallenge[];
  theme: ThemeMode;
  statistics: Statistics;
}

export interface HabitFormData {
  name: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  icon: string;
  color: string;
}