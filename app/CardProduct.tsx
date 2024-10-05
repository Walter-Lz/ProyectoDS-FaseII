import React, { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootParametros';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

// Define la interfaz para las props
interface CardProductProps {
  id: string;
  image: string;
  title: string;
  price: number;
  condition: string;
}

const CardProduct: React.FC<CardProductProps> = ({ id, image, title, price, condition }) => {
  const { isDarkTheme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCardProductClick = () => {
    navigation.navigate('DetailsProduct', { idProduct: id });
  };

  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString('es-CR')}`;
  };

  return (
    <TouchableOpacity style={isDarkTheme ? styles.cardContainerDark : styles.cardContainer} onPress={handleCardProductClick}>
      <View style={isDarkTheme ? styles.imageContainerDark : styles.imageContainer}>
        <Image source={{ uri: image.replace('http://', 'https://') }} style={styles.image} resizeMode='contain' />
      </View>
      <View style={styles.content}>
        <Text style={isDarkTheme ? styles.titleDark : styles.title}>{title}</Text>
        <Text style={isDarkTheme ? styles.priceDark : styles.price}>{price? formatPrice(price): "Precio no establecido." }</Text>
        <Text style={isDarkTheme ? styles.conditionDark : styles.condition}>{condition}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardProduct;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth > 600 ? 300 : screenWidth * 0.8,
    margin: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  cardContainerDark: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth > 600 ? 300 : screenWidth * 0.8,
    margin: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#333',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#3483FA', // Azul para modo claro
  },
  imageContainerDark: {
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#FFDD00', // Amarillo para modo oscuro
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  titleDark: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  priceDark: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  condition: {
    fontSize: 14,
    color: '#555',
  },
  conditionDark: {
    fontSize: 14,
    color: '#ccc',
  },
});