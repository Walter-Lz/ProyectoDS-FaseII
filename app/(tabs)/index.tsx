import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { registerRootComponent } from 'expo';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ofertas Mercado Libre</Text>
      <Text style={styles.subtitle}>¡Descubre las mejores ofertas del día!</Text>

      {/* Sección de botones como enlaces a posibles ofertas */}
      <TouchableOpacity style={styles.offerButton}>
        <Text style={styles.buttonText}>Ver Smartphones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.offerButton}>
        <Text style={styles.buttonText}>Ver Electrónica</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.offerButton}>
        <Text style={styles.buttonText}>Ver Moda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DB954', // Verde llamativo para el título
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#A1A1A1', // Gris para el subtítulo
    marginBottom: 40,
    textAlign: 'center',
  },
  offerButton: {
    backgroundColor: '#1DB954', // Verde brillante para los botones
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff', // Texto blanco para los botones
    fontSize: 16,
    fontWeight: 'bold',
  },
});

registerRootComponent(App);