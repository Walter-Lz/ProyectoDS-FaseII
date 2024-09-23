import React from 'react';
import { Stack } from 'expo-router';
import Navbar from '../NavBar';

export default function TabLayout() {
  return (
    <>
      <Navbar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}