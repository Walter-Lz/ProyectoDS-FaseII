import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { getCurrentUser } from '../../config/firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import CardProduct from '../../components/CardProduct';
import Loading from '../../components/Loading';
import { useTheme } from '../../config/ThemeContext';

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
    return <Loading />;
  }

  if (wishlist.length === 0) {
    return <Text style={isDarkTheme ? styles.emptyTextDark : styles.emptyText}>No items in wishlist</Text>;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.mainTitle, isDarkTheme ? styles.mainTitleDark : styles.mainTitleLight]}>Mi Lista de Deseos</Text>
      <View style={styles.productList}>
        {wishlist.map((product) => (
          <CardProduct
            key={product.id}
            id={product.id}
            image={product.thumbnail.replace('http://', 'https://')}
            title={product.title}
            price={product.price}
            condition={product.condition}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainTitleLight: {
    color: '#3483FA',
  },
  mainTitleDark: {
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
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default Wishlist;