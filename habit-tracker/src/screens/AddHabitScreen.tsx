import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { HabitCategory, HabitDifficulty } from '../types';
import { HABIT_COLORS, HABIT_ICONS } from '../constants/theme';

interface AddHabitScreenProps {
  navigation: any;
}

export const AddHabitScreen: React.FC<AddHabitScreenProps> = ({ navigation }) => {
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();
  const { addHabit } = useApp();

  const [habitName, setHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [selectedDifficulty, setSelectedDifficulty] = useState<HabitDifficulty>('medium');
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const categories: Array<{ key: HabitCategory; label: string; icon: string }> = [
    { key: 'health', label: 'Health', icon: 'fitness' },
    { key: 'fitness', label: 'Fitness', icon: 'barbell' },
    { key: 'productivity', label: 'Productivity', icon: 'briefcase' },
    { key: 'learning', label: 'Learning', icon: 'book' },
    { key: 'social', label: 'Social', icon: 'people' },
    { key: 'mindfulness', label: 'Mindfulness', icon: 'leaf' },
    { key: 'creativity', label: 'Creativity', icon: 'color-palette' },
    { key: 'finance', label: 'Finance', icon: 'card' },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const difficulties: Array<{ key: HabitDifficulty; label: string; description: string; color: string }> = [
    { key: 'easy', label: 'Easy', description: '10 XP per completion', color: colors.success },
    { key: 'medium', label: 'Medium', description: '20 XP per completion', color: colors.warning },
    { key: 'hard', label: 'Hard', description: '30 XP per completion', color: colors.error },
  ];

  const handleSave = () => {
    if (!habitName.trim()) {
      return;
    }

    addHabit({
      name: habitName.trim(),
      category: selectedCategory,
      difficulty: selectedDifficulty,
      icon: selectedIcon,
      color: selectedColor,
      xpReward: selectedDifficulty === 'easy' ? 10 : selectedDifficulty === 'medium' ? 20 : 30,
    });

    navigation.goBack();
  };

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
    return iconMap[iconString] || 'star';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.surface }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Create New Habit
      </Text>
      
      <View style={styles.placeholder} />
    </View>
  );

  const renderNameInput = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Habit Name
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={habitName}
        onChangeText={setHabitName}
        placeholder="Enter habit name..."
        placeholderTextColor={colors.textMuted}
        maxLength={50}
      />
    </View>
  );

  const renderCategorySelection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Category
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryCard,
              {
                backgroundColor: selectedCategory === category.key ? colors.primary : colors.surface,
                borderColor: selectedCategory === category.key ? colors.primary : colors.border,
              },
              shadows.sm,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Ionicons
              name={category.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={selectedCategory === category.key ? colors.background : colors.text}
            />
            <Text
              style={[
                styles.categoryLabel,
                {
                  color: selectedCategory === category.key ? colors.background : colors.text,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDifficultySelection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Difficulty
      </Text>
      <View style={styles.difficultyContainer}>
        {difficulties.map((difficulty) => (
          <TouchableOpacity
            key={difficulty.key}
            style={[
              styles.difficultyCard,
              {
                backgroundColor: selectedDifficulty === difficulty.key ? difficulty.color + '20' : colors.surface,
                borderColor: selectedDifficulty === difficulty.key ? difficulty.color : colors.border,
              },
              shadows.sm,
            ]}
            onPress={() => setSelectedDifficulty(difficulty.key)}
          >
            <Text
              style={[
                styles.difficultyLabel,
                {
                  color: selectedDifficulty === difficulty.key ? difficulty.color : colors.text,
                },
              ]}
            >
              {difficulty.label}
            </Text>
            <Text
              style={[
                styles.difficultyDesc,
                {
                  color: selectedDifficulty === difficulty.key ? difficulty.color : colors.textSecondary,
                },
              ]}
            >
              {difficulty.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderIconSelection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Icon
      </Text>
      <View style={styles.iconGrid}>
        {HABIT_ICONS.map((icon) => (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconOption,
              {
                backgroundColor: selectedIcon === icon ? selectedColor + '20' : colors.surface,
                borderColor: selectedIcon === icon ? selectedColor : colors.border,
              },
            ]}
            onPress={() => setSelectedIcon(icon)}
          >
            <Ionicons
              name={getIconName(icon)}
              size={24}
              color={selectedIcon === icon ? selectedColor : colors.text}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderColorSelection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Color
      </Text>
      <View style={styles.colorGrid}>
        {HABIT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              {
                backgroundColor: color,
                borderColor: selectedColor === color ? colors.text : 'transparent',
                borderWidth: selectedColor === color ? 3 : 0,
              },
            ]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && (
              <Ionicons name="checkmark" size={16} color={colors.background} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderNameInput()}
        {renderCategorySelection()}
        {renderDifficultySelection()}
        {renderIconSelection()}
        {renderColorSelection()}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Create Habit"
            onPress={handleSave}
            disabled={!habitName.trim()}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  difficultyContainer: {
    gap: 12,
  },
  difficultyCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  difficultyDesc: {
    fontSize: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});