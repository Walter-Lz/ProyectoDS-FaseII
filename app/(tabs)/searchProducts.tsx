import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../config/ThemeContext';
import CardProduct from '../../components/CardProduct';
import Loading from '../../components/Loading';
import { GetCategories, SearchProduct, GetALLProductsCategory } from '../../config/ApiRequest';

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

const screenWidth = Dimensions.get('window').width;

const searchProducts = () => {
  const { isDarkTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceOrderFilter, setPriceOrderFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [conditionPreference, setConditionPreference] = useState('');

  useEffect(() => {
    const fetchFilterProduct = async () => {
      try {
        const categoryData = await GetCategories();
        setCategories(categoryData.map((categoria: { name: any; }) => categoria.name));
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchFilterProduct();
  }, []);

  const resetAdvancedFilters = () => {
    setCategoryFilter('');
    setPriceOrderFilter('');
    setConditionPreference('');
  };

  const applyFilters = (product: any) => {
    let filteredProducts = product;
    if (categoryFilter.trim() !== '') {
      const normalizedCategoryFilter = categoryFilter.trim().toLowerCase();
      if (filteredProducts.filters && filteredProducts.filters.length > 0) {
        const categoryFilterObj = filteredProducts.filters.find((filter: any) => filter.id === "category");
        if (categoryFilterObj && categoryFilterObj.values.length > 0) {
          const isCategoryMatch = categoryFilterObj.values.some((value: any) =>
            value.path_from_root.some((path: any) =>
              path.name.trim().toLowerCase() === normalizedCategoryFilter
            )
          );
          if (!isCategoryMatch) {
            return [];
          }
        }
      }
    }
    if (conditionPreference.trim() !== '') {
      const conditionPreferenceUser = conditionPreference.trim().toLowerCase();
      filteredProducts.results.sort((a: any, b: any) => {
        if (a.condition === null) return 1;
        if (b.condition === null) return -1;
        if (a.condition.trim().toLowerCase() === conditionPreferenceUser && b.condition.trim().toLowerCase() !== conditionPreferenceUser) {
          return -1;
        } else if (a.condition.trim().toLowerCase() !== conditionPreferenceUser && b.condition.trim().toLowerCase() === conditionPreferenceUser) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return filteredProducts.results;
  };

  const fetchAllProductsCategory = async (consultPrice: string) => {
    setLoading(true);
    try {
      const data = await GetALLProductsCategory(categoryFilter + consultPrice);
      const dataFilter = await HandleFilterCondition(data);
      setFilteredProducts(dataFilter);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all products for categories: ", error);
      setLoading(false);
    }
  };

  const HandleFilterCondition = (product: any) => {
    let filteredProducts = product;
    if (conditionPreference.trim() !== '') {
      const conditionPreferenceUser = conditionPreference.trim().toLowerCase();
      filteredProducts.results.sort((a: any, b: any) => {
        if (a.condition === null) return 1;
        if (b.condition === null) return -1;
        if (a.condition.trim().toLowerCase() == conditionPreferenceUser && b.condition.trim().toLowerCase() != conditionPreferenceUser) {
          return -1;
        } else if (a.condition.trim().toLowerCase() != conditionPreferenceUser && b.condition.trim().toLowerCase() == conditionPreferenceUser) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return filteredProducts.results;
  };

  const HandleConsultPrice = () => {
    let consultPrice = '';
    if (priceOrderFilter) {
      switch (priceOrderFilter) {
        case 'Asc': consultPrice = '&sort=price_asc';
          break;
        case 'Desc': consultPrice = '&sort=price_desc';
          break;
        default: consultPrice = '';
          break;
      }
    }
    return consultPrice;
  };

  const handleSearch = async () => {
    const consultPrice = HandleConsultPrice();
    if (search.trim() === '') {
      if (categoryFilter) {
        fetchAllProductsCategory(consultPrice);
      } else {
        setFilteredProducts([]);
      }
    } else {
      setLoading(true);
      try {
        const data = await SearchProduct(search + consultPrice);
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

  const handleKeyDown = (event: { nativeEvent: { key: string; }; }) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    if (showAdvancedSearch) {
      resetAdvancedFilters();
    }
  };

  const priceOrderOptions: PriceOrder[] = ['', 'Asc', 'Desc'];
  const preferenceCondition: ConditionPreference[] = ['', 'new', 'used'];

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.mainTitle, isDarkTheme ? styles.mainTitleDark : styles.mainTitleLight]}>Buscar Productos</Text>
      <View style={isDarkTheme ? styles.searchFormDark : styles.searchForm}>
        <TextInput
          style={isDarkTheme ? styles.inputDark : styles.input}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          onKeyPress={handleKeyDown}
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
            <Picker
              selectedValue={categoryFilter}
              style={isDarkTheme ? styles.selectDark : styles.select}
              onValueChange={(itemValue) => setCategoryFilter(itemValue)}
            >
              <Picker.Item label="Select category" value="" />
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
            <Text style={isDarkTheme ? styles.modalTitleDark : styles.modalTitle}>Filter Price</Text>
            <Picker
              selectedValue={priceOrderFilter}
              style={isDarkTheme ? styles.selectDark : styles.select}
              onValueChange={(itemValue) => setPriceOrderFilter(itemValue)}
            >
              {priceOrderOptions.map((option, index) => (
                <Picker.Item key={index} label={option === '' ? 'No Filter' : option} value={option} />
              ))}
            </Picker>

            <Text style={isDarkTheme ? styles.modalTitleDark : styles.modalTitle}>Filter Condition</Text>
            <Picker
              selectedValue={conditionPreference}
              style={isDarkTheme ? styles.selectDark : styles.select}
              onValueChange={(itemValue) => setConditionPreference(itemValue)}
            >
              {preferenceCondition.map((option, index) => (
                <Picker.Item key={index} label={option === '' ? 'No Filter' : option} value={option} />
              ))}
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkTheme ? styles.titleDark : styles.titleLight]}>Resultados de la Búsqueda</Text>
        <View style={styles.productList}>
          {filteredProducts.map((product) => (
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
    </ScrollView>
  );
}

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
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  section: {
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    borderBottomColor: '#3483FA', 
  },
  imageContainerDark: {
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#FFDD00',
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

export default searchProducts;