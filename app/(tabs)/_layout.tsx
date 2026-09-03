import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '../../src/i18n';
import { useTheme } from '../../src/theme';

/** Hauteur de la barre elle-même, hors zone réservée au système. */
const TAB_BAR_HEIGHT = 64;

export default function TabsLayout() {
  const { colors } = useTheme();
  const t = useT();
  // L'application dessine sous les barres système (edge-to-edge). Sans cette
  // marge, la navigation à trois boutons d'Android recouvre les onglets — et
  // l'indicateur d'accueil d'iOS ferait de même.
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.dashboardTitle,
          tabBarLabel: t.tabs.dashboard,
          tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: t.tabs.budget,
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: t.tabs.goals,
          tabBarIcon: ({ color, size }) => <Ionicons name="flag" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="simulation"
        options={{
          title: t.tabs.simulation,
          tabBarIcon: ({ color, size }) => <Ionicons name="trending-up" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advice"
        options={{
          title: t.tabs.advice,
          tabBarIcon: ({ color, size }) => <Ionicons name="bulb" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
