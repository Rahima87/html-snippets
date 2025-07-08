import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Habit } from '../types';
import { useApp } from '../context/AppContext';

interface HabitCardProps {
  habit: Habit;
  onPress?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();
  const { completeHabit, uncompleteHabit } = useApp();
  
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completedDates.includes(today);
  
  const scale = useSharedValue(1);
  const completionProgress = useSharedValue(isCompleted ? 1 : 0);
  
  useEffect(() => {
    completionProgress.value = withSpring(isCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isCompleted]);

  const handleToggleCompletion = async () => {
    scale.value = withSpring(0.95, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    
    if (isCompleted) {
      await uncompleteHabit(habit.id);
    } else {
      await completeHabit(habit.id);
    }
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const completionAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      completionProgress.value,
      [0, 1],
      [colors.surface, habit.color]
    );
    
    return {
      backgroundColor,
      opacity: withTiming(completionProgress.value * 0.1 + 0.9),
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(completionProgress.value) },
        { rotate: `${completionProgress.value * 360}deg` }
      ],
      opacity: completionProgress.value,
    };
  });

  const getIconName = (iconString: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      fitness: 'fitness',
      book: 'book',
      'water-drop': 'water',
      meditation: 'leaf',
      running: 'walk',
      dumbbell: 'barbell',
      apple: 'nutrition',
      moon: 'moon',
      sun: 'sunny',
      heart: 'heart',
      brain: 'bulb',
      leaf: 'leaf',
      star: 'star',
      target: 'radio-button-on',
      trophy: 'trophy',
      clock: 'time',
      calendar: 'calendar',
      music: 'musical-notes',
      camera: 'camera',
      palette: 'color-palette',
      code: 'code-slash',
      lightbulb: 'bulb',
      rocket: 'rocket',
      gem: 'diamond',
      coffee: 'cafe',
    };
    return iconMap[iconString] || 'checkmark-circle';
  };

  return (
    <Animated.View style={[cardAnimatedStyle]}>
      <Animated.View style={[styles.card, completionAnimatedStyle, shadows.md]}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View style={styles.leftContent}>
            <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
              <Ionicons
                name={getIconName(habit.icon)}
                size={24}
                color={habit.color}
              />
            </View>
            
            <View style={styles.textContent}>
              <Text style={[styles.habitName, { color: colors.text }]}>
                {habit.name}
              </Text>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={14} color={colors.accent} />
                <Text style={[styles.streakText, { color: colors.textSecondary }]}>
                  {habit.streak} day streak
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkButton, { borderColor: habit.color }]}
            onPress={handleToggleCompletion}
            activeOpacity={0.8}
          >
            <Animated.View style={checkmarkAnimatedStyle}>
              <Ionicons
                name="checkmark"
                size={18}
                color={colors.background}
              />
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>

        {isCompleted && (
          <LinearGradient
            colors={[habit.color + '40', habit.color + '20']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    marginLeft: 4,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});