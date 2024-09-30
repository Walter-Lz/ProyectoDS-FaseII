import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import {WishlistUser} from '../config/ApiRequest';

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
        // Reemplaza esta URL con la URL de tu API para obtener la lista de deseados del usuario
        const data = await WishlistUser();
        setWishlist(data);
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
          <View style={styles.item}>
            <Image source={{ uri: item.thumbnail.replace('http://', 'https://') }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.condition}>Condition: {item.condition}</Text>
              <Text style={styles.quantity}>Available: {item.available_quantity}</Text>
            </View>
          </View>
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
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  condition: {
    fontSize: 14,
    color: '#888',
  },
  quantity: {
    fontSize: 14,
    color: '#888',
  },
});

export default Wishlist;