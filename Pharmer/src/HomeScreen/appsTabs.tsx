// src/screens/AppTabs.tsx
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

// Import your screens
import HomeScreen from './HomeScreen';
import ProfileScreen from './profileScreen';

// Define the parameter list for your Tab Navigator
type TabParamList = {
  HomeFeed: undefined; // Renaming 'Home' to avoid conflict if you use it in the Stack
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'HomeFeed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3fcc4fff', // Use your main green color
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide the header for the tab navigator itself
      })}
    >
      <Tab.Screen 
        name="HomeFeed" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
}