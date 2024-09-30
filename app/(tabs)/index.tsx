import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const daysOfWeek = [
  { day: 'Lunes', promotion: 'Promoción del lunes' },
  { day: 'Martes', promotion: 'Promoción del martes' },
  { day: 'Miércoles', promotion: 'Promoción del miércoles' },
  { day: 'Jueves', promotion: 'Promoción del jueves' },
  { day: 'Viernes', promotion: 'Promoción del viernes' },
  { day: 'Sábado', promotion: 'Promoción del sábado' },
  { day: 'Domingo', promotion: 'Promoción del domingo' },
];

export default function HomePage({ isDarkTheme }) {
  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkTheme ? styles.darkText : styles.lightText]}>Promociones Semanales</Text>
      <View style={styles.calendar}>
        {daysOfWeek.map((item, index) => (
          <View key={index} style={[styles.cell, isDarkTheme ? styles.darkCell : styles.lightCell]}>
            <Text style={[styles.day, isDarkTheme ? styles.darkText : styles.lightText]}>{item.day}</Text>
            <Text style={[styles.promotion, isDarkTheme ? styles.darkText : styles.lightText]}>{item.promotion}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 16,
  },
  cell: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
  },
  darkCell: {
    borderColor: '#555',
    backgroundColor: '#444',
  },
  lightCell: {
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promotion: {
    fontSize: 16,
  },
});