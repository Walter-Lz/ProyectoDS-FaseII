import { RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View,Text,StyleSheet,TouchableOpacity, Image } from 'react-native';
import { RootStackParamList } from './RootParametros';
// Define la interfaz para las props
interface Product {
    id: string;
    title: string;
    condition: string;
    price: number;
    available_quantity: number;
    thumbnail: string;
  }
type ExploreScreenRouteProp = RouteProp<RootStackParamList, 'DetailsProduct'>;
const ViewProduct: React.FC<{ id: ExploreScreenRouteProp }> = ({ id }) => {
    const idProduct = id;
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
          console.log("Prueba: ",data.results[0].thumbnail.replace('http://', 'https://') );  // Verificar si la URL es válida
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
    <View style={styles.container} >
          <View style={styles.imageSection}>
              <Image source={{ uri: producto.thumbnail.replace('http://', 'https://') }} style={styles.image} 
              resizeMode='contain'/>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.title}>{producto.title}</Text>
            <Text style={styles.objectiveTitle}> Estado del producto: {producto.condition}</Text>
          </View>
          <View style={styles.infoSection}>
              <Text style={styles.objectiveTitle}>Descripción</Text>
              
              <Text style={styles.objectiveTitle}> Precio del Producto: {producto.price}</Text>
              <Text style={styles.objectiveTitle}>Cantidad Disponible: {producto.available_quantity}</Text>
          </View>
    </View>
    );

};
export default ViewProduct;
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