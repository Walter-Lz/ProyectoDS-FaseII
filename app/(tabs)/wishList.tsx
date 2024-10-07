import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { getCurrentUser } from '../../config/firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import CardProduct from '../CardProduct';
import { useTheme } from '../ThemeContext';

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  condition: string;
  available_quantity: number;
}

const Wishlist: React.FC = () => {
  const { isDarkTheme } = useTheme();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription?.remove();
    };
  }, []);

  const numColumns = screenWidth > 800 ? 4 : screenWidth > 600 ? 3 : screenWidth > 400 ? 2 : 1;
  const cardWidth = screenWidth / numColumns - 20;  // 20 for padding and margins

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          console.error('No user is logged in');
          setLoading(false);
          return;
        }

        const carritoRef = doc(db, 'Carrito', user.uid);
        const carritoDoc = await getDoc(carritoRef);

        if (carritoDoc.exists()) {
          const carritoData = carritoDoc.data();
          const idProducts = carritoData.id_products || [];

          const productPromises = idProducts.map(async (id: string) => {
            const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
            const data = await response.json();
            return {
              id: data.id,
              title: data.title,
              thumbnail: data.thumbnail,
              price: data.price,
              condition: data.condition,
              available_quantity: data.available_quantity,
            };
          });

          const products = await Promise.all(productPromises);
          setWishlist(products);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <Text style={isDarkTheme ? styles.loadingTextDark : styles.loadingText}>Loading...</Text>;
  }

  if (wishlist.length === 0) {
    return <Text style={isDarkTheme ? styles.emptyTextDark : styles.emptyText}>No items in wishlist</Text>;
  }

  return (
    <View style={[styles.container, isDarkTheme ? styles.containerDark : styles.containerLight]}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, { width: cardWidth }]}>
            <CardProduct
              id={item.id}
              image={item.thumbnail.replace('http://', 'https://')}
              title={item.title}
              price={item.price}
              condition={item.condition}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        numColumns={numColumns}
        key={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  containerLight: {
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#333',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingTextDark: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFDD00',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyTextDark: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFDD00',
  },
  listContent: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  cardContainer: {
    margin: 10,
  },
});

export default Wishlist;
