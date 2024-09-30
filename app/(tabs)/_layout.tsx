import React, { useState } from 'react';
import { Stack } from 'expo-router';
import Navbar from '../NavBar';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';

export default function TabLayout() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider value={isDarkTheme ? DarkTheme : DefaultTheme}>
      <Navbar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}