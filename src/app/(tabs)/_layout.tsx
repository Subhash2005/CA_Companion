import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007AFF', // Premium blue
      headerStyle: { backgroundColor: '#ffffff' },
      headerShadowVisible: false,
      tabBarStyle: { borderTopWidth: 0, elevation: 10, shadowOpacity: 0.1, backgroundColor: '#ffffff' },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tax"
        options={{
          title: 'Tax AI',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          title: 'Automation',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog-sync-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gst"
        options={{
          title: 'GST Smart',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calculator-variant-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-month-outline" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
