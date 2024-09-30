import { useEffect, useState } from "react";
import { Modal, TouchableOpacity, Text, StyleSheet, View, FlatList, Dimensions } from 'react-native';
import CardProduct from '../CardProduct';
import { useTheme } from '../ThemeContext';
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

const screenwidth = Dimensions.get('window').width;

const searchProducts = () => {
  const { isDarkTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    const fetchFilterProduct = async () => {
      try {
        const categoryResponse = await fetch("https://api.mercadolibre.com/sites/MLA/categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.map((categoria: { name: any; }) => categoria.name));
      } catch (err) {
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
            return categoryFilterObj.values.some((value: any) =>
              value.path_from_root.some((path: any) => path.name === categoryFilter)
            );
          }
        }
        return false;
      });
    }
    return filteredProducts.results;
  };

  const fetchAllProductsCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${categoryFilter}`);
      const data = await response.json();
      setFilteredProducts(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all products for categories: ", error);
      setLoading(false);
    }
  }

  const handleSearch = async () => {
    if (search.trim() === '') {
      if (categoryFilter) {
        fetchAllProductsCategory();
      } else {
        setFilteredProducts([]);
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${search}`);
        const data = await response.json();
        const fetchedProducts = data;
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
    <View style={isDarkTheme ? styles.containerDark : styles.container}>
      <View style={isDarkTheme ? styles.searchFormDark : styles.searchForm}>
        <input
          style={isDarkTheme ? styles.inputDark : styles.input}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TouchableOpacity style={isDarkTheme ? styles.buttonDark : styles.button} onPress={handleSearch}>
          <Text style={isDarkTheme ? styles.buttonTextDark : styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={isDarkTheme ? styles.buttonDark : styles.button} onPress={handleToggleAdvancedSearch}>
          <Text style={isDarkTheme ? styles.buttonTextDark : styles.buttonText}>{showAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}</Text>
        </TouchableOpacity>

        {showAdvancedSearch && (
          <View style={styles.filterGroup}>
            <Text style={isDarkTheme ? styles.modalTitleDark : styles.modalTitle}>Filter Category</Text>
            <select
              style={isDarkTheme ? styles.selectDark : styles.select}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Select category</option>
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
          />
        )}
        contentContainerStyle={styles.list}
        numColumns={screenwidth > 600 ? 3 : 1}
        keyExtractor={(item) => item.id}
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
    width: '100%', 
  },
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    width: '100%', 
  },
  searchForm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    width: '100%',
  },
  searchFormDark: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#444',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: 800,
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 200,
  },
  inputDark: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#666',
    minWidth: 200,
    color: '#fff',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDark: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#3483FA',
    fontWeight: 'bold',
  },
  buttonTextDark: {
    color: '#FFDD00',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 16,
    marginRight: 10,
    color: '#3483FA',
  },
  modalTitleDark: {
    fontSize: 16,
    marginRight: 10,
    color: '#FFDD00',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  select: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectDark: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    backgroundColor: '#666',
    color: '#fff',
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default searchProducts;