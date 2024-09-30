import { useEffect, useState } from "react";
import {Modal,TouchableOpacity,Text, StyleSheet,View,FlatList,Dimensions } from 'react-native';
import CardProduct from '../CardProduct';
import { GetCategories, SearchProduct, GetALLProductsCategory} from '../../config/ApiRequest';

interface filteredProducts {
  id: string;
  title: string;
  condition: string;
  price: number;
  available_quantity: number;
  thumbnail: string;
  seller: {
    nickname: string;
  };
}

const screenwidth  = Dimensions.get('window').width;
const searchProducts = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    useEffect( () => {
        const fetchFilterProduct = async () =>{
            try{
                const categoryData =await GetCategories();
                setCategories(categoryData.map((categoria: { name: any; })  => categoria.name));
            }catch(err){
                console.error('Error fetching categories:', err);  
            }
        };
        fetchFilterProduct();
    }, [])

    const resetAdvancedFilters = () => {
        setCategoryFilter('');
      };
    const applyFilters = (product: any) => {
        let filteredProducts = product;
        if (categoryFilter.trim() !== '') {
            filteredProducts = filteredProducts.filter((p: any) => {
                if (p.filters && p.filters.length > 0) {
                    const categoryFilterObj = p.filters.find((filter: any) => filter.id === 'category');
                    if (categoryFilterObj && categoryFilterObj.values.length > 0) {
                        // Recorremos cada path_from_root y verificamos si algún name coincide con el categoryFilter
                        return categoryFilterObj.values.some((value: any) => 
                            value.path_from_root.some((path: any) => path.name === categoryFilter)
                        );
                    }
                }
                return false; // Si no encontramos coincidencias, excluimos el producto
            });
        }
        return filteredProducts.results;
    };
      const fetchAllProductsCategory = async () => {
        setLoading(true);
        try {
          const data = await GetALLProductsCategory(categoryFilter);
          setFilteredProducts(data.results);
          setLoading(false);
        } catch (error) {
            console.error("Error fetching all products for categories: ",error);
          setLoading(false);
        }
      }
      const handleSearch = async () => {
        if (search.trim() === '') {
          // Si no hay input de nombre, pero hay filtros avanzados o está visible la búsqueda avanzada, aplicamos filtros
          if (categoryFilter) {
            fetchAllProductsCategory();  // Aquí se aplican los filtros
          } else {
            setFilteredProducts([]);
          }
        } else {
          setLoading(true);
          try {
            const fetchedProducts = SearchProduct(search);
            const filtered = applyFilters(fetchedProducts);    
            if (filtered.length === 0) {
                setFilteredProducts([]);
            } else {
                setFilteredProducts(filtered);
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
          }
        }
      };  
      const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
          handleSearch();
        }
      };
      const handleToggleAdvancedSearch = () => {
        setShowAdvancedSearch(!showAdvancedSearch);
        if (showAdvancedSearch) {
          resetAdvancedFilters();
        }
      };

      return (
        <View style={styles.container}>
          <View style={styles.searchForm}>
            <input
              style={styles.input}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              Search
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleToggleAdvancedSearch}>
              {showAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}
            </TouchableOpacity>
      
            {/* Aquí agregamos el contenedor para el filtro de categoría */}
            {showAdvancedSearch && (
              <View style={styles.filterGroup}>
                <Text style={styles.modalTitle}>Filter Category</Text>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">{("Select category")}</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </View>
            )}
          </View>
      
          <FlatList<filteredProducts>
            data={filteredProducts}
            renderItem={({ item }) => (
              <CardProduct
                id={item.id}
                image={item.thumbnail}
                title={item.title}
                price={item.price}
                condition={item.condition}
                availableQuantity={item.available_quantity}
                seller={item.seller.nickname}
              />
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      );
}   
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchForm: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Mantiene los botones juntos a la izquierda
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: 800,
    width: screenwidth * 0.9, // Asegura que ocupe todo el ancho disponible
    marginHorizontal: 'auto', 
  },
  input: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF', // Azul llamativo
    color: 'white',
    borderRadius: 8,
    marginLeft: 10, // Añade un margen entre botones
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, // Espacio entre los botones y el selector de categoría
    
  },
  select: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  list: {
    alignItems: 'center',
  },
});

export default searchProducts;