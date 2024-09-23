import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre Nosotros</Text>
      <Text style={styles.description}>
        Bienvenido a Mercado TEC, tu aplicación de confianza para comprar y vender productos dentro de la comunidad del TEC. Nuestra misión es facilitar el intercambio de bienes y servicios entre estudiantes y personal del TEC.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default About;