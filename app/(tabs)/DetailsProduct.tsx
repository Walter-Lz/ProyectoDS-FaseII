import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../RootParametros';
import { getCurrentUser } from '../../config/firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { GetItem } from '../../config/ApiRequest';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useTheme } from '../ThemeContext';
import Loading from '../Loading'; 

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
  const navigation = useNavigation();
  const { idProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await GetItem(idProduct); 
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
        } else {
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
        return ('No user is logged in');
      } else {
        const carritoRef = doc(db, 'Carrito', user.uid);
        const carritoDoc = await getDoc(carritoRef);

        if (carritoDoc.exists()) {
          const carritoData = carritoDoc.data();
          const idProducts = carritoData.id_products || [];

          if (idProducts.includes(idProduct)) {
            // Eliminar el producto de la lista de deseos
            const updatedIdProducts = idProducts.filter((id: string) => id !== idProduct);
            await updateDoc(carritoRef, {
              id_products: updatedIdProducts,
            });
            console.log('Producto eliminado de la lista de deseados');
            setIsWishlisted(false);
          } else {
            // Agregar el producto a la lista de deseos
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
      }
    } catch (error) {
      console.error('Error adding/removing product to/from wishlist:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return <Loading />; 
  }
  if (!product) {
    return <Text>Product not found</Text>;
  }

  const imageList = product.pictures.map(picture => picture.secure_url);
  const handleThumbnailPress = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index, animated: true }); 
      setCurrentIndex(index);
    }
  };
  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString('es-CR')}`;
  };

  return (
    <SafeAreaView style={isDarkTheme ? styles.safeAreaDark : styles.safeArea}>
      <ScrollView style={isDarkTheme ? styles.containerDark : styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={isDarkTheme ? styles.backButtonDark : styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={30} color={isDarkTheme ? '#FFDD00' : '#3483FA'} />
          </TouchableOpacity>
        </View>
        <Text style={isDarkTheme ? styles.titleDark : styles.title}>{product.title}</Text>
        <View style={styles.galleryContainer}>
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
        <ScrollView horizontal style={styles.thumbnailSection} contentContainerStyle={styles.thumbnailSectionContent}>
          {imageList.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleThumbnailPress(index)}>
              <Image source={{ uri: image }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={isDarkTheme ? styles.wishlistButtonDark : styles.wishlistButton} onPress={handleWishlist}>
          <Icon name={isWishlisted ? 'heart' : 'heart-o'} size={30} color={isDarkTheme ? '#FFDD00' : '#3483FA'} />
        </TouchableOpacity>
        <View style={styles.detailsSection}>
          <View style={isDarkTheme ? styles.titleAreaDark : styles.titleArea}>
            <Text style={isDarkTheme ? styles.objectiveTitleDark : styles.objectiveTitle}>Estado del producto: {product.condition}</Text>
            <Text style={isDarkTheme ? styles.objectiveTitleDark : styles.objectiveTitle}>Descripción</Text>
            <Text style={isDarkTheme ? styles.objectiveTitleDark : styles.objectiveTitle}>Precio del Producto: {product.price ? formatPrice(product.price) : "No establecido"}</Text>
            <Text style={isDarkTheme ? styles.objectiveTitleDark : styles.objectiveTitle}>Cantidad Disponible: {product.initial_quantity}</Text>
            <Text style={isDarkTheme ? styles.objectiveTitleDark : styles.objectiveTitle}>{product.warranty ? product.warranty : "Sin garantía"}</Text>
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
    backgroundColor: '#333',
  },
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  containerDark: {
    padding: 10,
    backgroundColor: '#333',
    flex: 1,
  },
  galleryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    height: 300,
  },
  backButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: {
    zIndex: 1,
  },
  backButtonDark: {
    zIndex: 1,
  },
  thumbnailSection: {
    flexDirection: 'row',
    marginBottom: 10, 
  },
  thumbnailSectionContent: {
    justifyContent: 'center', 
    alignItems: 'center', 
    flexGrow: 1, 
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 0, 
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    marginBottom: 0, 
  },
  detailsSection: {
    flex: 1,
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  titleAreaDark: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#444',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: '#3483FA',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleDark: {
    fontSize: 24,
    color: '#FFDD00',
    marginBottom: 10,
    textAlign: 'center',
  },
  objectiveTitle: {
    fontSize: 21,
    marginBottom: 10,
    color: '#3483FA',
    textAlign: 'center',
  },
  objectiveTitleDark: {
    fontSize: 21,
    marginBottom: 10,
    color: '#FFDD00',
    textAlign: 'center',
  },
  wishlistButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  wishlistButtonDark: {
    alignSelf: 'center',
    marginVertical: 20,
  },
});