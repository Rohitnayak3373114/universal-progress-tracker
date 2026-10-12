
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  themeColors,
  useAppTheme,
  type AppearanceMode,
} from '@/constants/app-theme';

const goals = [
  { id: '1', title: 'Drink water', detail: 'Stay hydrated', target: 8, unit: 'glasses', icon: '💧' },
  { id: '2', title: 'Read a book', detail: 'Learn something new', target: 30, unit: 'minutes', icon: '📚' },
  { id: '3', title: 'Exercise', detail: 'Move your body', target: 1, unit: 'session', icon: '🏃' },
];

const accentOptions = [
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
  '#F97316',
  '#EC4899',
  '#EF4444',
];

export default function HomeScreen() {
  const { preferences, resolvedMode, setAppearance, setAccentColor } =
    useAppTheme();
  const [progress, setProgress] = useState<Record<string, number>>({
    '1': 5,
    '2': 15,
    '3': 0,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const colors = themeColors[resolvedMode];
  const completed = goals.filter(
    (goal) => (progress[goal.id] ?? 0) >= goal.target,
  ).length;

  const styles = createStyles(colors, preferences.accentColor);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
            <Text style={styles.heading}>Daily progress</Text>
            <Text style={styles.subtitle}>
              Small steps. Meaningful growth.
            </Text>
          </View>

          <Pressable
            onPress={() => setSettingsOpen(!settingsOpen)}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TODAY'S OVERVIEW</Text>
          <Text style={styles.summaryTitle}>You're building momentum!</Text>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.bigNumber}>
                {completed}/{goals.length}
              </Text>
              <Text style={styles.summaryCaption}>Goals completed</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>⭐ Keep going!</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.trackFill,
                {
                  width: `${(completed / goals.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {settingsOpen && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <Text style={styles.subtitle}>Choose your preferred theme</Text>

            <View style={styles.optionRow}>
              {(['system', 'light', 'dark'] as AppearanceMode[]).map(
                (mode) => (
                  <Pressable
                    key={mode}
                    onPress={() => setAppearance(mode)}
                    style={[
                      styles.option,
                      preferences.appearance === mode &&
                        styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        preferences.appearance === mode &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>

            <Text style={styles.sectionTitle}>Accent color</Text>
            <View style={styles.colorRow}>
              {accentOptions.map((color) => (
                <Pressable
                  key={color}
                  accessibilityLabel={`Choose accent ${color}`}
                  onPress={() => setAccentColor(color)}
                  style={[
                    styles.colorChoice,
                    { backgroundColor: color },
                    preferences.accentColor === color &&
                      styles.selectedColor,
                  ]}
                />
              ))}
            </View>

            <View style={styles.preview}>
              <Text style={styles.previewText}>Live preview</Text>
              <View
                style={[
                  styles.previewButton,
                  { backgroundColor: preferences.accentColor },
                ]}
              >
                <Text style={styles.previewButtonText}>Your accent color</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your trackers</Text>
          <Text style={styles.subtitle}>{goals.length} active goals</Text>
        </View>

        {goals.map((goal) => {
          const value = progress[goal.id] ?? 0;
          const done = value >= goal.target;
          const percentage = Math.min((value / goal.target) * 100, 100);

          return (
            <View key={goal.id} style={styles.card}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Text style={styles.goalEmoji}>{goal.icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.subtitle}>{goal.detail}</Text>
                </View>
                {done && <Text style={styles.doneMark}>✓</Text>}
              </View>

              <View style={styles.progressLabels}>
                <Text style={styles.progressValue}>
                  {value}/{goal.target} {goal.unit}
                </Text>
                <Text style={styles.subtitle}>
                  {Math.round(percentage)}%
                </Text>
              </View>

              <View style={styles.track}>
                <View
                  style={[
                    styles.trackFill,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>

              <Pressable
                disabled={done}
                onPress={() =>
                  setProgress((current) => ({
                    ...current,
                    [goal.id]: Math.min(
                      (current[goal.id] ?? 0) + 1,
                      goal.target,
                    ),
                  }))
                }
                style={[
                  styles.actionButton,
                  done && styles.completedButton,
                ]}
              >
                <Text
                  style={[
                    styles.actionText,
                    done && styles.completedText,
                  ]}
                >
                  {done ? 'Goal completed ✓' : '+ Log progress'}
                </Text>
              </Pressable>
            </View>
          );
        })}

        <Text style={styles.footer}>
          Progress is personal. Celebrate every step.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  colors: (typeof themeColors)['light'],
  accent: string,
) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    content: { padding: 22, paddingBottom: 40, maxWidth: 760, width: '100%', alignSelf: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: accent, marginBottom: 8 },
    heading: { fontSize: 30, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 13, color: colors.mutedText, marginTop: 5 },
    settingsButton: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    settingsIcon: { fontSize: 21 },
    summaryCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 22, borderWidth: 1, borderColor: colors.border, marginBottom: 26 },
    summaryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.mutedText },
    summaryTitle: { color: colors.text, fontSize: 19, fontWeight: '700', marginTop: 10, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    bigNumber: { fontSize: 34, fontWeight: '800', color: colors.text },
    summaryCaption: { fontSize: 12, color: colors.mutedText },
    xpBadge: { backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
    xpText: { color: colors.text, fontSize: 12, fontWeight: '600' },
    track: { height: 8, backgroundColor: colors.border, borderRadius: 10, overflow: 'hidden' },
    trackFill: { height: '100%', borderRadius: 10, backgroundColor: accent },
    sectionHeader: { marginBottom: 14 },
    sectionTitle: { fontSize: 19, fontWeight: '800', color: colors.text },
    card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18, marginBottom: 14 },
    goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    goalIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    goalEmoji: { fontSize: 22 },
    goalInfo: { flex: 1 },
    goalTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    doneMark: { color: accent, fontSize: 22, fontWeight: '800' },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressValue: { color: colors.text, fontSize: 12, fontWeight: '600' },
    actionButton: { backgroundColor: accent, borderRadius: 12, alignItems: 'center', padding: 13, marginTop: 16 },
    actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    completedButton: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    completedText: { color: colors.mutedText },
    optionRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 20 },
    option: { flex: 1, paddingVertical: 11, borderWidth: 1, borderColor: colors.border, borderRadius: 10, alignItems: 'center' },
    selectedOption: { backgroundColor: accent, borderColor: accent },
    optionText: { fontSize: 12, color: colors.text, fontWeight: '600' },
    selectedOptionText: { color: '#FFFFFF' },
    colorRow: { flexDirection: 'row', gap: 13, marginTop: 14 },
    colorChoice: { width: 34, height: 34, borderRadius: 17 },
    selectedColor: { borderWidth: 3, borderColor: colors.text },
    preview: { marginTop: 22, padding: 14, backgroundColor: colors.background, borderRadius: 14 },
    previewText: { fontSize: 12, color: colors.text, fontWeight: '600', marginBottom: 12 },
    previewButton: { padding: 12, borderRadius: 10, alignItems: 'center' },
    previewButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
    footer: { textAlign: 'center', color: colors.mutedText, fontSize: 12, marginTop: 12 },
  });
}
