import React from 'react';
import { ThemeProvider } from '../ThemeContext';  // Import the ThemeProvider
import { Stack } from 'expo-router';
import Navbar from '../NavBar';

export default function Layout() {
  return (
    <ThemeProvider>  {/* Wrap your app with the ThemeProvider */}
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
