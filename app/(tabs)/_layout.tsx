import React from 'react';
import { ThemeProvider } from '../../config/ThemeContext'; 
import { Stack } from 'expo-router';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer'; 

export default function Layout() {
  return (
    <ThemeProvider>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
      <Footer />
    </ThemeProvider>
  );
}