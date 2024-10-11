import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using Expo
import { useTheme } from './ThemeContext';

const Loading: React.FC = () => {
  const { isDarkTheme } = useTheme();

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <ActivityIndicator size="large" color={isDarkTheme ? "#FFDD00" : "#3483FA"} />
      <Text style={[styles.text, isDarkTheme ? styles.darkText : styles.lightText]}>Cargando...</Text>
      <View style={styles.iconContainer}>
        <FontAwesome name="shopping-cart" size={32} color={isDarkTheme ? "#FFDD00" : "#3483FA"} style={styles.icon} />
        <FontAwesome name="tags" size={32} color={isDarkTheme ? "#3483FA" : "#FFDD00"} style={styles.icon} />
        <FontAwesome name="gift" size={32} color={isDarkTheme ? "#FFDD00" : "#3483FA"} style={styles.icon} />
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
  lightText: {
    color: '#3483FA',
  },
  darkText: {
    color: '#FFDD00',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
});