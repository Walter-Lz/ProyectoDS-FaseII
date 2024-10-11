import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../RootParametros';
import { getCurrentUser } from '../../config/firebaseConfig';
import { getFirestore, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { GetItem } from '../../config/ApiRequest';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useTheme } from '../ThemeContext';
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
  const { isDarkTheme } = useTheme();
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
          return ('No user is logged in');
        //  return;
        }else{
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
      }} catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkIfWishlisted();
  }, [idProduct]);
  const handleWishlist = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        return ('No user is logged in');
     //   return;
      }else{
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
        }, { merge: true });
        console.log('Producto agregado a la lista de deseados');
        setIsWishlisted(true);
      }
    }} catch (error) {
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
    <SafeAreaView style={isDarkTheme ? styles.safeAreaDark :styles.safeArea}>
      <ScrollView style={isDarkTheme ? styles.containerDark:styles.container}>
        <TouchableOpacity style={isDarkTheme ? styles.wishlistButtonDark :styles.wishlistButton} onPress={handleWishlist}>
          <Icon name={isWishlisted ? 'heart' : 'heart-o'} size={30} color={isDarkTheme ? '#FFDD00':'#900' } />
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
        <View style={styles.detailsSection}>
          <View style={isDarkTheme ? styles.titleAreaDark :styles.titleArea}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.objectiveTitle}>Estado del producto: {product.condition}</Text>
            <Text style={styles.objectiveTitle}>Descripción</Text>
            <Text style={styles.objectiveTitle}>Precio del Producto: {product.price ? formatPrice(product.price) : "No establecido"}</Text>
            <Text style={styles.objectiveTitle}>Cantidad Disponible: {product.initial_quantity}</Text>
            <Text style={styles.objectiveTitle}>{product.warranty ? product.warranty : "Sin garantía"}</Text>
          </View>
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
  safeAreaDark: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    maxWidth: 900,
    backgroundColor: '#f5f5f5',
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1,
  },
  containerDark: {
    padding: 20,
    maxWidth: 900,
    backgroundColor: '#333',
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1,
  },

  imageSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-5,
    marginBottom: 10,
    marginRight: -30,
    marginLeft:0,
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
  detailsSection: {
    minHeight: '60%',
    flex: 1,
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleAreaDark: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFDD00',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  wishlistButton: {
    color: '#3483FA',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  wishlistButtonDark: {
    color: '#FFDD00',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },

});