import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { HabitCard } from '../components/HabitCard';
import { Button } from '../components/Button';
import { getCurrentLevelProgress, getXpForNextLevel, formatXP } from '../utils/gameUtils';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();
  const { state, toggleTheme } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = state.habits.filter(habit => !habit.isArchived);
  const completedToday = todayHabits.filter(habit => 
    habit.completedDates.includes(today)
  );
  
  const completionPercentage = todayHabits.length > 0 
    ? Math.round((completedToday.length / todayHabits.length) * 100)
    : 0;

  const levelProgress = getCurrentLevelProgress(state.user.totalXp, state.user.level);
  const nextLevelXp = getXpForNextLevel(state.user.level);
  const currentLevelXp = state.user.totalXp - (state.user.level > 1 ? 
    getXpForNextLevel(state.user.level - 1) : 0);
  const requiredXp = nextLevelXp - (state.user.level > 1 ? 
    getXpForNextLevel(state.user.level - 1) : 0);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.userInfo}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Good {getTimeOfDay()}!
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {state.user.name}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={state.theme === 'dark' ? 'sunny' : 'moon'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.avatar}>{state.user.avatar}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProgressCard = () => (
    <View style={[styles.progressCard, { backgroundColor: colors.surface }, shadows.lg]}>
      <LinearGradient
        colors={[colors.primary + '20', colors.secondary + '20']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.progressContent}>
        <View style={styles.levelInfo}>
          <View style={styles.levelBadge}>
            <Text style={[styles.levelText, { color: colors.background }]}>
              LVL {state.user.level}
            </Text>
          </View>
          <Text style={[styles.xpText, { color: colors.textSecondary }]}>
            {formatXP(currentLevelXp)} / {formatXP(requiredXp)} XP
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]} />
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={[styles.progressBarFill, { width: `${levelProgress * 100}%` }]}
          />
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {completionPercentage}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Today
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {state.statistics.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Streak
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {state.user.achievements.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Achievements
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDailyChallenges = () => {
    if (state.dailyChallenges.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Daily Challenges
        </Text>
        {state.dailyChallenges.slice(0, 2).map((challenge) => (
          <TouchableOpacity
            key={challenge.id}
            style={[
              styles.challengeCard,
              { backgroundColor: colors.surface },
              shadows.sm,
              challenge.completed && { opacity: 0.7 }
            ]}
          >
            <View style={styles.challengeContent}>
              <View style={styles.challengeInfo}>
                <Text style={[styles.challengeTitle, { color: colors.text }]}>
                  {challenge.title}
                </Text>
                <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
                  {challenge.description}
                </Text>
              </View>
              
              <View style={styles.challengeReward}>
                <Text style={[styles.xpReward, { color: colors.accent }]}>
                  +{challenge.xpReward} XP
                </Text>
                {challenge.completed && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderHabits = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Today's Habits
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {todayHabits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No habits yet. Create your first habit to get started!
          </Text>
          <Button
            title="Add Your First Habit"
            onPress={() => navigation.navigate('AddHabit')}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        todayHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
          />
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderProgressCard()}
        {renderDailyChallenges()}
        {renderHabits()}
      </ScrollView>
    </SafeAreaView>
  );
};

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    fontSize: 18,
  },
  progressCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  progressContent: {
    padding: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
    position: 'relative',
  },
  progressBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 12,
  },
  challengeReward: {
    alignItems: 'flex-end',
  },
  xpReward: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 40,
  },
});