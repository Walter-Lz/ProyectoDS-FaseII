import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from './RootParametros';
import { getCurrentUser } from '../config/firebaseConfig'; // Asegúrate de tener esta función
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Asegúrate de tener configurado Firebase

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
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  useEffect(() => {
    const checkIfWishlisted = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          console.error('No user is logged in');
          return;
        }
        const carritoRef = doc(db, 'Carrito', user.uid);
        const carritoDoc = await getDoc(carritoRef);

        if (carritoDoc.exists()) {
          const carritoData = carritoDoc.data();
          const idProducts = carritoData.id_products || [];
          if (idProducts.includes(idProduct)) {
            setIsWishlisted(true);
          } else {
            setIsWishlisted(false);
          }
        } else {
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkIfWishlisted();
  }, [idProduct]);

  const handleWishlist = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error('No user is logged in');
        return;
      }
      const carritoRef = doc(db, 'Carrito', user.uid);
      const carritoDoc = await getDoc(carritoRef);

      if (carritoDoc.exists()) {
        const carritoData = carritoDoc.data();
        const idProducts = carritoData.id_products || [];

        if (idProducts.includes(idProduct)) {
          console.log('El producto ya está registrado en la lista de deseados');
        } else {
          await updateDoc(carritoRef, {
            id_products: [...idProducts, idProduct],
          });
          console.log('Producto agregado a la lista de deseados');
          setIsWishlisted(true);
        }
      } else {
        await setDoc(carritoRef, {
          id_products: [idProduct],
        });
        console.log('Producto agregado a la lista de deseados');
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlist}>
        <Icon name={isWishlisted ? 'heart' : 'heart-o'} size={30} color="#900" />
      </TouchableOpacity>
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
  wishlistButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});