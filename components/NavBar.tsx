import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import LoginModal from './LoginModal';
import { useTheme } from '../config/ThemeContext';
import { getCurrentUser } from '../config/firebaseConfig'; 

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme(); 
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const updateMenuVisibility = () => {
      if (screenWidth >= 600) {
        setMenuVisible(false);
      }
    };
    updateMenuVisibility();
  }, [screenWidth]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  const handleMouseEnter = (item: string) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
    setMenuVisible(false); 
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); 
  };

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageOptions(false);
    console.log('Language changed to', language);
  };

  return (
    <View style={[styles.navbar, isDarkTheme ? styles.darkNavbar : styles.lightNavbar]}>
      <TouchableOpacity onPress={() => navigateTo('/')}>
        <Text style={[styles.logo, isDarkTheme ? styles.darkText : styles.lightText]}>Mercado TEC</Text>
      </TouchableOpacity>
      {screenWidth < 600 ? (
        <View style={styles.smallScreenContainer}>
          <View style={styles.languageSelector}>
            <Ionicons name="earth" size={24} color={isDarkTheme ? "#000" : "#fff"} />
            <TouchableOpacity onPress={() => setShowLanguageOptions(!showLanguageOptions)} style={styles.selectedLanguageContainer}>
              <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
                {selectedLanguage === 'en' ? 'EN' : 'ES'}
              </Text>
              <Ionicons name="chevron-down" size={24} color={isDarkTheme ? "#000" : "#fff"} />
            </TouchableOpacity>
            {showLanguageOptions && (
              <View style={[styles.languageOptions, isDarkTheme ? styles.darkLanguageOptions : styles.lightLanguageOptions]}>
                <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.languageOption}>
                  <Text style={isDarkTheme ? styles.darkText : styles.lightText}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('es')} style={styles.languageOption}>
                  <Text style={isDarkTheme ? styles.darkText : styles.lightText}>ES</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons name={isDarkTheme ? "sunny" : "moon"} size={24} color={isDarkTheme ? "#000" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color={isDarkTheme ? "#000" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButtonSmallScreen} onPress={toggleModal}>
            {user && user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={30} color={isDarkTheme ? "#000" : "#fff"} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.navItemsContainer}>
          <View style={styles.navItemsCentered}>
            {[{ label: 'Inicio', route: '/' }, { label: 'Búsqueda', route: '/searchProducts' }].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPressIn={() => handleMouseEnter(item.label)}
                onPressOut={handleMouseLeave}
                onPress={() => navigateTo(item.route)}
              >
                <Text
                  style={[
                    styles.navItem,
                    hoveredItem === item.label && styles.navItemHovered,
                    isDarkTheme ? styles.darkNavItemText : styles.lightNavItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rightItems}>
            <View style={styles.languageSelector}>
              <Ionicons name="earth" size={24} color={isDarkTheme ? "#000" : "#fff"} />
              <TouchableOpacity onPress={() => setShowLanguageOptions(!showLanguageOptions)} style={styles.selectedLanguageContainer}>
                <Text style={isDarkTheme ? styles.darkText : styles.lightText}>
                  {selectedLanguage === 'en' ? 'EN' : 'ES'}
                </Text>
                <Ionicons name="chevron-down" size={24} color={isDarkTheme ? "#000" : "#fff"} />
              </TouchableOpacity>
              {showLanguageOptions && (
                <View style={[styles.languageOptions, isDarkTheme ? styles.darkLanguageOptions : styles.lightLanguageOptions]}>
                  <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.languageOption}>
                    <Text style={isDarkTheme ? styles.darkText : styles.lightText}>EN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => changeLanguage('es')} style={styles.languageOption}>
                    <Text style={isDarkTheme ? styles.darkText : styles.lightText}>ES</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Ionicons name={isDarkTheme ? "sunny" : "moon"} size={24} color={isDarkTheme ? "#000" : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
              {user && user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person-circle" size={30} color={isDarkTheme ? "#000" : "#fff"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {menuVisible && screenWidth < 600 && (
        <View style={[styles.menu, isDarkTheme ? styles.darkMenu : styles.lightMenu]}>
          <View style={styles.navItemsVertical}>
            {[{ label: 'Inicio', route: '/' }, { label: 'Búsqueda', route: '/searchProducts' }].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPressIn={() => handleMouseEnter(item.label)}
                onPressOut={handleMouseLeave}
                onPress={() => navigateTo(item.route)}
              >
                <Text
                  style={[
                    styles.navItem,
                    hoveredItem === item.label && styles.navItemHovered,
                    isDarkTheme ? styles.darkNavItemText : styles.lightNavItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <LoginModal visible={modalVisible} onClose={toggleModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    zIndex: 100, 
  },
  darkNavbar: {
    backgroundColor: '#FFDD00', 
  },
  lightNavbar: {
    backgroundColor: '#3483FA', 
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#fff',
  },
  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure space between left and right items
    flex: 1, // Take up remaining space
  },
  navItemsCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the items horizontally
    flex: 1, // Take up remaining space
  },
  navItemsVertical: {
    flexDirection: 'column', // Change to column for vertical alignment
    alignItems: 'center',
  },
  rightItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 8, 
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Make text bold
  },
  navItemHovered: {
    color: '#1DB954',
  },
  darkNavItemText: {
    color: '#000',
  },
  lightNavItemText: {
    color: '#fff',
  },
  profileButton: {
    marginLeft: 10,
  },
  profileButtonSmallScreen: {
    marginLeft: 15,
  },
  smallScreenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menu: {
    position: 'absolute',
    top: 60, 
    left: 0,
    right: 0,
    paddingVertical: 20,
    zIndex: 9999, 
    alignItems: 'center',
  },
  darkMenu: {
    backgroundColor: '#FFDD00', 
  },
  lightMenu: {
    backgroundColor: '#3483FA', 
  },
  themeButton: {
    marginRight: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  selectedLanguageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  languageOptions: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  darkLanguageOptions: {
    backgroundColor: '#FFDD00',
  },
  lightLanguageOptions: {
    backgroundColor: '#3483FA',
  },
  languageOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default Navbar;