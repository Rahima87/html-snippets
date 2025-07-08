import { AppState, Achievement, DailyChallenge } from '../types';
import { XP_LEVELS } from '../constants/theme';

export const calculateLevel = (totalXp: number): number => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_LEVELS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const getXpForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= XP_LEVELS.length) {
    return XP_LEVELS[XP_LEVELS.length - 1] + (currentLevel - XP_LEVELS.length + 1) * 1000;
  }
  return XP_LEVELS[currentLevel] || 0;
};

export const getCurrentLevelProgress = (totalXp: number, currentLevel: number): number => {
  const currentLevelXp = XP_LEVELS[currentLevel - 1] || 0;
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const progressXp = totalXp - currentLevelXp;
  const requiredXp = nextLevelXp - currentLevelXp;
  
  return Math.min(Math.max(progressXp / requiredXp, 0), 1);
};

export const generateDailyChallenges = (): DailyChallenge[] => {
  const today = new Date().toISOString().split('T')[0];
  
  const challenges = [
    {
      id: `challenge_1_${today}`,
      title: 'Morning Warrior',
      description: 'Complete 3 habits before noon',
      xpReward: 50,
      completed: false,
      date: today,
    },
    {
      id: `challenge_2_${today}`,
      title: 'Streak Keeper',
      description: 'Maintain your longest habit streak',
      xpReward: 30,
      completed: false,
      date: today,
    },
    {
      id: `challenge_3_${today}`,
      title: 'Perfect Day',
      description: 'Complete all your habits today',
      xpReward: 100,
      completed: false,
      date: today,
    },
  ];

  return challenges;
};

export const checkAchievements = (state: AppState, completedHabitId: string): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const habit = state.habits.find(h => h.id === completedHabitId);
  
  if (!habit) return newAchievements;

  // Check for achievements that haven't been unlocked yet
  const unlockedAchievementIds = state.user.achievements.map(a => a.id);

  // First habit completion
  if (!unlockedAchievementIds.includes('first_habit') && habit.totalCompletions === 1) {
    newAchievements.push({
      id: 'first_habit',
      title: 'First Steps',
      description: 'Complete your first habit',
      icon: '🎯',
      unlockedAt: new Date().toISOString(),
      progress: 1,
      maxProgress: 1,
      xpReward: 25,
      rarity: 'common',
    });
  }

  // Streak achievements
  if (habit.streak === 7 && !unlockedAchievementIds.includes('week_streak')) {
    newAchievements.push({
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '📅',
      unlockedAt: new Date().toISOString(),
      progress: 7,
      maxProgress: 7,
      xpReward: 75,
      rarity: 'rare',
    });
  }

  if (habit.streak === 30 && !unlockedAchievementIds.includes('month_streak')) {
    newAchievements.push({
      id: 'month_streak',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '🔥',
      unlockedAt: new Date().toISOString(),
      progress: 30,
      maxProgress: 30,
      xpReward: 200,
      rarity: 'epic',
    });
  }

  if (habit.streak === 100 && !unlockedAchievementIds.includes('century_streak')) {
    newAchievements.push({
      id: 'century_streak',
      title: 'Century Champion',
      description: 'Maintain a 100-day streak',
      icon: '💎',
      unlockedAt: new Date().toISOString(),
      progress: 100,
      maxProgress: 100,
      xpReward: 500,
      rarity: 'legendary',
    });
  }

  // Total habits achievements
  const totalHabits = state.habits.length;
  if (totalHabits === 5 && !unlockedAchievementIds.includes('habit_collector')) {
    newAchievements.push({
      id: 'habit_collector',
      title: 'Habit Collector',
      description: 'Create 5 different habits',
      icon: '📚',
      unlockedAt: new Date().toISOString(),
      progress: 5,
      maxProgress: 5,
      xpReward: 100,
      rarity: 'rare',
    });
  }

  // Perfect day achievement
  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = state.habits.filter(h => h.completedDates.includes(today)).length;
  if (todayCompletions === totalHabits && totalHabits >= 3 && !unlockedAchievementIds.includes('perfect_day')) {
    newAchievements.push({
      id: 'perfect_day',
      title: 'Perfect Day',
      description: 'Complete all habits in one day',
      icon: '⭐',
      unlockedAt: new Date().toISOString(),
      progress: todayCompletions,
      maxProgress: totalHabits,
      xpReward: 150,
      rarity: 'epic',
    });
  }

  // Level achievements
  const userLevel = state.user.level;
  if (userLevel === 5 && !unlockedAchievementIds.includes('level_5')) {
    newAchievements.push({
      id: 'level_5',
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: '🌟',
      unlockedAt: new Date().toISOString(),
      progress: 5,
      maxProgress: 5,
      xpReward: 100,
      rarity: 'rare',
    });
  }

  if (userLevel === 10 && !unlockedAchievementIds.includes('level_10')) {
    newAchievements.push({
      id: 'level_10',
      title: 'Expert Tracker',
      description: 'Reach level 10',
      icon: '🏆',
      unlockedAt: new Date().toISOString(),
      progress: 10,
      maxProgress: 10,
      xpReward: 250,
      rarity: 'epic',
    });
  }

  return newAchievements;
};

export const getAchievementColor = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return '#94A3B8';
    case 'rare':
      return '#3B82F6';
    case 'epic':
      return '#8B5CF6';
    case 'legendary':
      return '#F59E0B';
    default:
      return '#94A3B8';
  }
};

export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};