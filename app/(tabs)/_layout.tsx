import React from 'react';
import { ThemeProvider } from '../ThemeContext'; 
import { Stack } from 'expo-router';
import Navbar from '../NavBar';
import Footer from '../Footer'; 

export default function Layout() {
  return (
    <ThemeProvider>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
      <Footer />
    </ThemeProvider>
  );
}