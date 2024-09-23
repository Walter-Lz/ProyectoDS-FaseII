import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../RootParametros'; // Ajusta la ruta
import Navbar from '../NavBar'; 
import { SafeAreaView } from 'react-native';

export default function App() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleCardProductClick = () => {
    navigation.navigate('DetailsProduct', { idProduct: "id" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={styles.home}>
        <Text style={styles.title}>Ofertas Mercado Libre</Text>
        <Text style={styles.subtitle}>¡Descubre las mejores ofertas del día!</Text>
        {/* Sección de botones como enlaces a posibles ofertas */}
        <TouchableOpacity style={styles.offerButton} onPress={handleCardProductClick}>
          <Text style={styles.buttonText}>Ver Smartphones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.offerButton}>
          <Text style={styles.buttonText}>Ver Electrónica</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.offerButton}>
          <Text style={styles.buttonText}>Ver Moda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
  },
  home: {
    flex: 1,
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