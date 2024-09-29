import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RootStackParamList } from './RootParametros';

// Define la interfaz para las props
interface Product {
  id: string;
  title: string;
  condition: string;
  price: number;
  initial_quantity: number;
  secure_url: string;
  pictures: { secure_url: string }[];
  warranty: string;
}

type DetailsProductRouteProp = RouteProp<RootStackParamList, 'DetailsProduct'>;

const DetailsProduct: React.FC = () => {
  const route = useRoute<DetailsProductRouteProp>();
  const { idProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idProduct]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <Image source={{ uri: product.pictures[0].secure_url }} style={styles.image} resizeMode='contain' />
      </View>
      <View style={styles.titleArea}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.objectiveTitle}>Estado del producto: {product.condition}</Text>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.objectiveTitle}>Descripción</Text>
        <Text style={styles.objectiveTitle}>Precio del Producto: {product.price}</Text>
        <Text style={styles.objectiveTitle}>Cantidad Disponible: {product.initial_quantity}</Text>
        <Text style={styles.objectiveTitle}>{product.warranty ? product.warranty : "Sin garantía"}</Text>
      </View>
    </View>
  );
};

export default DetailsProduct;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 900,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  imageSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    maxWidth: 500,
    height: 300,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
  },
  infoSection: {
    textAlign: 'center',
    alignItems: 'center',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  objectiveTitle: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
});