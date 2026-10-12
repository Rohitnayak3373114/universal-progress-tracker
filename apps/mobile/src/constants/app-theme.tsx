

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme, type ColorSchemeName } from 'react-native';

export type AppearanceMode = 'system' | 'light' | 'dark';

export type ThemePreferences = {
  appearance: AppearanceMode;
  accentColor: string;
};

type AppThemeContextValue = {
  preferences: ThemePreferences;
  resolvedMode: 'light' | 'dark';
  setAppearance: (appearance: AppearanceMode) => void;
  setAccentColor: (color: string) => void;
  ready: boolean;
};

const STORAGE_KEY = '@universal-progress-tracker/theme';

const DEFAULT_PREFERENCES: ThemePreferences = {
  appearance: 'system',
  accentColor: '#3B82F6',
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemColorScheme: ColorSchemeName = useColorScheme();
  const [preferences, setPreferences] =
    useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored && active) {
          const parsed: unknown = JSON.parse(stored);

          if (
            typeof parsed === 'object' &&
            parsed !== null &&
            'appearance' in parsed &&
            'accentColor' in parsed &&
            ['system', 'light', 'dark'].includes(String(parsed.appearance)) &&
            typeof parsed.accentColor === 'string' &&
            /^#[0-9a-fA-F]{6}$/.test(parsed.accentColor)
          ) {
            setPreferences({
              appearance: parsed.appearance as AppearanceMode,
              accentColor: parsed.accentColor,
            });
          }
        }
      } catch (error) {
        console.warn('Could not load theme preferences:', error);
      } finally {
        if (active) setReady(true);
      }
    }

    void loadPreferences();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)).catch(
      (error) => console.warn('Could not save theme preferences:', error),
    );
  }, [preferences, ready]);

  const setAppearance = useCallback((appearance: AppearanceMode) => {
    setPreferences((current) => ({ ...current, appearance }));
  }, []);

  const setAccentColor = useCallback((accentColor: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(accentColor)) {
      setPreferences((current) => ({ ...current, accentColor }));
    }
  }, []);

  const resolvedMode =
    preferences.appearance === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : preferences.appearance;

  const value = useMemo(
    () => ({
      preferences,
      resolvedMode,
      setAppearance,
      setAccentColor,
      ready,
    }),
    [preferences, resolvedMode, setAppearance, setAccentColor, ready],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}

export const themeColors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    mutedText: '#64748B',
    border: '#E2E8F0',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    border: '#334155',
  },
};
