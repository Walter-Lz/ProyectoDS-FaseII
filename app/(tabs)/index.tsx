import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../ThemeContext';
import CardProduct from '../CardProduct';
import Loading from '../Loading';
import { GetTopProductsByCategory } from '../../config/ApiRequest'; 

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  condition: string;
  reviews?: {
    rating_average?: number;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const { isDarkTheme } = useTheme();
  const [categories] = useState<Category[]>([
    { id: 'MCR1747', name: 'Accesorios para Vehículos' },
    { id: 'MCR1051', name: 'Celulares y Teléfonos' },
    { id: 'MCR1648', name: 'Computación' },
    { id: 'MCR1574', name: 'Hogar, Muebles y Jardín' },
    { id: 'MCR1575', name: 'Electrodomésticos' }
  ]);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const productsByCategory: { [key: string]: Product[] } = {};
        for (const category of categories) {
          const products = await GetTopProductsByCategory(category.id);
          productsByCategory[category.id] = products;
        }
        setCategoryProducts(productsByCategory);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [categories]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.mainTitle, isDarkTheme ? styles.mainTitleDark : styles.mainTitleLight]}>MercadoTEC</Text>
      <Text style={[styles.description, isDarkTheme ? styles.darkText : styles.lightText]}>
        El sitio donde puedes encontrar productos de mercado libre, con una interfaz diferente y ademas de muestras productos interesantes.
      </Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkText : styles.lightText]}>Categorías Más Buscadas</Text>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <Text key={category.id} style={[styles.categoryItem, isDarkTheme ? styles.darkText : styles.lightText]}>
              {category.name}
            </Text>
          ))}
        </View>
      </View>
      {categories.map((category) => (
        <View key={category.id} style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkTheme ? styles.darkText : styles.lightText]}>
            Productos Más Vendidos en {category.name}
          </Text>
          <View style={styles.productList}>
            {categoryProducts[category.id]?.map((product) => (
              <CardProduct
                key={product.id}
                id={product.id}
                image={product.thumbnail}
                title={product.title}
                price={product.price}
                condition={product.condition}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

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
    color: '#3483FA', // Azul para modo claro
  },
  mainTitleDark: {
    color: '#FFDD00', // Amarillo para modo oscuro
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  section: {
    marginVertical: 40,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryItem: {
    fontSize: 18,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth > 600 ? '48%' : '100%',
    marginVertical: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  cardContainerDark: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth > 600 ? '48%' : '100%',
    marginVertical: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#333',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#3483FA', // Azul para modo claro
  },
  imageContainerDark: {
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#FFDD00', // Amarillo para modo oscuro
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 10,
    textAlign: 'center',
  },
  titleLight: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  titleDark: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
  },
  priceDark: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  condition: {
    fontSize: 14,
    color: '#555',
  },
  conditionDark: {
    fontSize: 14,
    color: '#ccc',
  },
});