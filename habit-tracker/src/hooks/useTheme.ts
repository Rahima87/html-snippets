import { useApp } from '../context/AppContext';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export const useTheme = () => {
  const { state } = useApp();
  const colors = COLORS[state.theme];

  return {
    colors,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    typography: TYPOGRAPHY,
    shadows: SHADOWS,
    isDark: state.theme === 'dark',
    isLight: state.theme === 'light',
  };
};