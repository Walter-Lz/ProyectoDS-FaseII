import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../RootParametros';
import { getCurrentUser } from '../../config/firebaseConfig'; // Asegúrate de tener esta función
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { GetItem } from '../../config/ApiRequest';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

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
const { width: viewportWidth } = Dimensions.get('window');

const DetailsProduct: React.FC = () => {
  const route = useRoute<DetailsProductRouteProp>();
  const { idProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await GetItem(idProduct); // Llamada a la API
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
        },{ merge: true });
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

  const imageList = product.pictures.map(picture => picture.secure_url);
  const handleThumbnailPress = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index, animated: true }); // Desplazar el carrusel
      setCurrentIndex(index);
    }
  };
  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString('es-CR')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlist}>
          <Icon name={isWishlisted ? 'heart' : 'heart-o'} size={30} color="#900" />
        </TouchableOpacity>
        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageList[currentIndex] }}
            style={styles.image}
            resizeMode="contain"
          />
          <Carousel
            ref={carouselRef}
            data={imageList}
            width={viewportWidth}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="contain" />
            )}
            onSnapToItem={(index) => setCurrentIndex(index)}
            loop={false}
            pagingEnabled={true}
            autoFillData={false}
          />
        </View>
        <ScrollView horizontal style={styles.thumbnailSection}>
          {imageList.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleThumbnailPress(index)}>
              <Image source={{ uri: image }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.titleArea}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.objectiveTitle}>Estado del producto: {product.condition}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.objectiveTitle}>Descripción</Text>
          <Text style={styles.objectiveTitle}>Precio del Producto: {product.price ? formatPrice(product.price) : "No establecido"}</Text>
          <Text style={styles.objectiveTitle}>Cantidad Disponible: {product.initial_quantity}</Text>
          <Text style={styles.objectiveTitle}>{product.warranty ? product.warranty : "Sin garantía"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsProduct;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    maxWidth: 900,
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1,
  },
  imageSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 300,
  },
  thumbnailSection: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
  },
  infoSection: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  objectiveTitle: {
    fontSize: 21,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});