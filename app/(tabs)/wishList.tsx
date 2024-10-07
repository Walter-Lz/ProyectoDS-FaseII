import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getCurrentUser } from '../../config/firebaseConfig'; // Asegúrate de tener esta función
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // Asegúrate de tener configurado Firebase
import CardProduct from '../CardProduct'; // Importa el componente ProductCard

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  condition: string;
  available_quantity: number;
}

const Wishlist: React.FC = () => {
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

        console.log('User ID:', user.uid); // Verificar el ID del usuario

        const carritoRef = doc(db, 'Carrito', user.uid);
        const carritoDoc = await getDoc(carritoRef);

        if (carritoDoc.exists()) {
          const carritoData = carritoDoc.data();
          console.log('Carrito Data:', carritoData); // Verificar los datos del carrito

          const idProducts = carritoData.id_products || [];
          console.log('ID Products:', idProducts); // Verificar los IDs de los productos

          const productPromises = idProducts.map(async (id: string) => {
            const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
            const data = await response.json();
            console.log('Product Data:', data); // Verificar los datos del producto
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
        } else {
          console.log('No carrito document found');
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
    return <Text>Loading...</Text>;
  }

  if (wishlist.length === 0) {
    return <Text>No items in wishlist</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardProduct
            id={item.id}
            image={item.thumbnail.replace('http://', 'https://')}
            title={item.title}
            price={item.price}
            condition={item.condition}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Wishlist;