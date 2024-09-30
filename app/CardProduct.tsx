import React, { useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootParametros';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

// Define la interfaz para las props
interface CardProductProps {
  id: string;
  image: string;
  title: string;
  price: number;
  condition: string;
}

const CardProduct: React.FC<CardProductProps> = ({ id, image, title, price, condition }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCardProductClick = () => {
    navigation.navigate('DetailsProduct', { idProduct: id });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handleCardProductClick}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image.replace('http://', 'https://') }} style={styles.image} resizeMode='contain' />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
        <Text style={styles.condition}>{condition}</Text>
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
  imageContainer: {
    width: '100%',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomWidth: 2,
    borderBottomColor: '#3483FA',
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
  price: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  condition: {
    fontSize: 14,
    color: '#555',
  },
});