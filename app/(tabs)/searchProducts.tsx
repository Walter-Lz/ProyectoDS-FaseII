import { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { View, FlatList } from 'react-native';
import CardProduct from '../CardProduct';
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
const searchProducts = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);;

    useEffect( () => {
        const fetchFilterProduct = async () =>{
            try{
                const categoryResponse = await fetch("https://api.mercadolibre.com/sites/MLA/categories");
                const categoryData = await categoryResponse.json();
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
          const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${categoryFilter}`);
          const data = await response.json();
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
        <View style ={styles.container}>
          <View style ={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={handleSearch}>
              {("search")}
            </button>
            <button type="button" onClick={handleToggleAdvancedSearch}>
              {showAdvancedSearch ? ('hide_search') :('show_search')}
            </button>
          </View>
    
          {showAdvancedSearch && (
            <View style ={styles.advancedSearchForm}>
              <View style ={styles.filterGroup}>
                <label>{("filter_category")}:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">{("select_category")}</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </View>
            </View>
          )}
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
  list: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Fondo blanco para destacarlo
    borderRadius: 10, // Bordes redondeados para una mejor estética
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Sombra para dar efecto de elevación
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
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonHover: {
    backgroundColor: '#0056b3', // Efecto hover más oscuro
  },
  advancedSearchForm: {
    padding: 20,
    backgroundColor: '#f4f4f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    maxWidth: 500,
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  select: {
    flex: 2,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
});
export default searchProducts;