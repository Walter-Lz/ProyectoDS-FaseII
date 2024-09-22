
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './RootParametros'; // Ajusta la ruta
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Define la interfaz para las props
interface CardProductProps {
    id: string;
    image: string;
    title: string;
    origin: string;
}
const CardProduct: React.FC<CardProductProps> = ({id, image, title, origin}) =>{
    const [isFavorite, setIsFavorite] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const handleCardProductClick = ()=>{
        navigation.navigate('DetailsProduct', {idProduct: id });
    }    
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handleCardProductClick}>
          <View style={styles.imageContainer}>
             <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.origin}>{origin}</Text>
          </View>
        </TouchableOpacity>
      );
};
export default CardProduct;
const styles = StyleSheet.create({
    cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 250,
    margin: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e6e6e6',
    cursor: 'pointer',
    },
    imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    },
    image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomWidth: 2,
    borderBottomColor: '#f0a500',
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
    origin: {
    fontSize: 14,
    color: '#777',
    },
});

