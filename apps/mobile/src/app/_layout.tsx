
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useMemo } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import {
  AppThemeProvider,
  themeColors,
  useAppTheme,
} from '@/constants/app-theme';

SplashScreen.preventAutoHideAsync();

function ThemedApp() {
  const { resolvedMode, preferences } = useAppTheme();

  const navigationTheme = useMemo(() => {
    const baseTheme = resolvedMode === 'dark' ? DarkTheme : DefaultTheme;
    const colors = themeColors[resolvedMode];

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: preferences.accentColor,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [resolvedMode, preferences.accentColor]);

  return (
    <ThemeProvider value={navigationTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}
