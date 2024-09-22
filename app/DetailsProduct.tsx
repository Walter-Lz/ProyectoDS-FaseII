import { RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View,Text,StyleSheet,TouchableOpacity, Image } from 'react-native';

// Definir el tipo de las rutas y sus parámetros
type RootStackParamList = {
  DetailsProduct: { idProduct: string }; // Aquí se define que la pantalla 'DetailsProduct' espera un parámetro 'idProduct'
};

// Define la interfaz para las props
interface Product {
    id: string;
    title: string;
    condition: string;
    price: number;
    available_quantity: number;
    thumbnail: string;
  }
// Usar el tipo RouteProp para definir el tipo del parámetro 'route'
type ExploreScreenRouteProp = RouteProp<RootStackParamList, 'DetailsProduct'>;

function ViewProduct({ route }: { route: ExploreScreenRouteProp }) {
    const {idProduct }= route.params;
    const [producto, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
    const fetchProduct = async () => {
        try {
            //curl -X GET -H 'Authorization: Bearer $ACCESS_TOKEN' https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6  
          const response = await fetch( `https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6`   );
          const data = await response.json();
          setProduct(data.results[0]);     
          setLoading(false);
         
        } catch (error) {
          console.error("Error fetching product:", error);
          setLoading(false);
        }
      };

      fetchProduct();
  },[idProduct]);

      if (!producto) {
        return <div>product not found</div>;
      }
     


return (
    <TouchableOpacity style={styles.container} >

        <View style={styles.imageSection}>
            <Image source={{ uri: producto.thumbnail }} style={styles.image} />
        </View>

        <View style={styles.titleArea}>
        <Text style={styles.title}>{producto.title}</Text>
        <Text style={styles.area}>{producto.condition}</Text>
        </View>

        <View style={styles.infoSection}>
            <Text style={styles.objectiveTitle}>Descripción</Text>
            <Text style={styles.area}>{producto.price}</Text>
            <Text style={styles.area}>{producto.available_quantity}</Text>
        </View>
    </TouchableOpacity>
  );

};

export default ViewProduct;
const styles = StyleSheet.create({
    container: {
      padding: 20,
      maxWidth: 900, // Si necesitas limitar el ancho, usa valores adaptables
      marginLeft: 'auto',
      marginRight: 'auto',
      // Para soportar un diseño adaptable a pantallas más pequeñas:
      
    },
    imageSection: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      maxWidth: 500,
      borderRadius: 15,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
    },
    infoSection: {
        textAlign: 'center', // Alinea el texto al centro
        alignItems: 'center', // Alinea el contenido dentro de la sección en el eje horizontal
      },
    titleArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 32, // Cambié a 'rem' por 'px'
      color: '#000000',
      marginBottom: 20,
      textAlign: 'center',
    },
    objectiveTitle: {
      fontSize: 24, // Cambié 'rem' a 'px'
      color: '#000000',
      marginBottom: 20,
      textAlign: 'center',
    },
    area: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#666',
    },
    ingredients: {
      textAlign: 'left',
      marginTop: 20,
    },
    table: {
      width: '100%',
      marginTop: 10,
      marginBottom: 20,
    },
    tableCell: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 12,
      textAlign: 'left',
    },
    tableHeader: {
      backgroundColor: '#f2f2f2',
      fontWeight: 'bold',
      fontSize: 18,
    },
    instructions: {
      fontSize: 18,
      lineHeight: 1.6,
      textAlign: 'left',
      marginTop: 20,
    },
    favoriteButton: {
      backgroundColor: '#f0a500',
      color: 'white',
      borderWidth: 0,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      cursor: 'pointer', // Nota: React Native no tiene cursor, así que puedes ignorarlo en móviles
      shadowOpacity: 0.3,
      shadowColor: 'black',
      shadowRadius: 5,
    },
  });