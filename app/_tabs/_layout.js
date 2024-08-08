import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  // Define colors based on theme
  const tabBarActiveTintColor = theme === 'dark' ? paperTheme.colors.accent : paperTheme.colors.primary;
  const tabBarInactiveTintColor = theme === 'dark' ? '#B0B0B0' : '#808080'; // Lighter grey for dark theme
  const tabBarBackgroundColor = theme === 'dark' ? '#121212' : paperTheme.colors.background;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'movies':
              iconName = 'movie';
              break;
            case 'tvshows':
              iconName = 'television';
              break;
            case 'user':
              iconName = 'account';
              break;
            case 'detail':
              iconName = 'information';
              break;
            case 'searchScreen':
              iconName = 'magnify';
              break;
            default:
              iconName = 'help'; // Fallback icon
          }
          return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="movies" options={{ title: "Movies" }} />
      <Tabs.Screen name="tvshows" options={{ title: "TV Shows" }} />
      <Tabs.Screen name="user" options={{ title: "Profile" }} />
      <Tabs.Screen name="detail" options={{ title: "Details", tabBarButton: () => null }} />
      <Tabs.Screen name="searchScreen" options={{ title: "Search", tabBarButton: () => null }} />
    </Tabs>
  );
};

export default Layout;
