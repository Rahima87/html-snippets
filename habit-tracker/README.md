# 🚀 Gamified Habit Tracker

A beautifully designed React Native habit tracker with gamification elements, built with Expo. Track your habits, earn XP, level up, unlock achievements, and stay motivated on your personal growth journey!

## ✨ Features

### 🎮 Gamification
- **XP System**: Earn experience points for completing habits
- **Leveling**: Progress through levels as you gain XP
- **Achievements**: Unlock badges for milestones and streaks
- **Daily Challenges**: Complete special tasks for bonus XP
- **Difficulty Levels**: Easy (10 XP), Medium (20 XP), Hard (30 XP)

### 🎨 Beautiful UI
- **Rounded Design**: Modern, rounded UI components throughout
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Smooth Animations**: React Native Reanimated for fluid interactions
- **Gradient Effects**: Beautiful gradients and visual effects
- **Haptic Feedback**: Tactile feedback for interactions

### 📊 Habit Management
- **Custom Habits**: Create habits with personalized icons and colors
- **Categories**: Organize habits by Health, Fitness, Productivity, etc.
- **Streak Tracking**: Monitor daily streaks and longest streaks
- **Progress Visualization**: Visual progress bars and statistics
- **Completion Toggle**: Easy tap-to-complete with animations

### 📈 Analytics & Progress
- **Statistics Dashboard**: View completion rates and trends
- **Weekly Progress**: Track your performance over time
- **Achievement Gallery**: Display unlocked achievements
- **Level Progress**: Visual XP progress to next level

## 🛠 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for smooth navigation
- **React Native Reanimated** for animations
- **AsyncStorage** for data persistence
- **Expo Linear Gradient** for visual effects
- **Expo Haptics** for tactile feedback
- **Expo Vector Icons** for beautiful icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator, or Expo Go app on your device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   └── HabitCard.tsx   # Animated habit card
├── screens/            # App screens
│   ├── HomeScreen.tsx  # Main dashboard
│   └── AddHabitScreen.tsx # Create new habits
├── context/            # State management
│   └── AppContext.tsx  # Global app state
├── hooks/              # Custom hooks
│   └── useTheme.ts     # Theme management
├── utils/              # Utility functions
│   ├── storage.ts      # AsyncStorage helpers
│   └── gameUtils.ts    # Gamification logic
├── types/              # TypeScript definitions
│   └── index.ts        # App types
└── constants/          # App constants
    └── theme.ts        # Design tokens
```

## 🎯 Key Features Explained

### Gamification System
The app uses a comprehensive XP and leveling system:
- Complete habits to earn XP based on difficulty
- Level up to unlock new achievements
- Daily challenges provide bonus XP opportunities
- Achievement system rewards consistent behavior

### Achievement System
Unlock achievements for various milestones:
- **First Steps**: Complete your first habit
- **Week Warrior**: Maintain a 7-day streak
- **Monthly Master**: Maintain a 30-day streak
- **Perfect Day**: Complete all habits in one day
- **Habit Collector**: Create 5 different habits

### Theming
Comprehensive theme system supporting:
- Light and dark modes
- Consistent color palette
- Rounded design language
- Responsive spacing and typography

## 📊 Data Persistence

The app uses AsyncStorage to persist:
- User progress and level
- Habit data and completion history
- Achievements and XP
- Theme preferences
- Daily challenges

## 🔮 Future Enhancements

- [ ] Habit scheduling and reminders
- [ ] Social features and leaderboards
- [ ] Custom achievement creation
- [ ] Data export/import
- [ ] Widget support
- [ ] Apple Health / Google Fit integration
- [ ] Detailed analytics and insights
- [ ] Habit templates and suggestions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the excellent React Native framework
- React Navigation for smooth navigation
- React Native Reanimated for beautiful animations
- All contributors and users of this app

---

**Happy habit tracking! 🌟**

Transform your daily routines into an engaging game and level up your life, one habit at a time!