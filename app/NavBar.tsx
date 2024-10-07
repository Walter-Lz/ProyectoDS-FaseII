import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import LoginModal from './LoginModal';
import { useTheme } from './ThemeContext';

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDarkTheme, toggleTheme } = useTheme(); 
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

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

  return (
    <View style={[styles.navbar, isDarkTheme ? styles.darkNavbar : styles.lightNavbar]}>
      <Text style={[styles.logo, isDarkTheme ? styles.darkText : styles.lightText]}>Mercado TEC</Text>
      {screenWidth < 600 ? (
        <View style={styles.smallScreenContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color={isDarkTheme ? "#fff" : "#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButtonSmallScreen} onPress={toggleModal}>
            <Image
              source={{ uri: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.navItemsContainer}>
          <View style={styles.navItems}>
            {[
              { label: 'Inicio', route: '/' },
              { label: 'Búsqueda', route: '/searchProducts' },
            ].map((item, index) => (
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
                    isDarkTheme ? styles.darkText : styles.lightText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          

          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
           <Ionicons name={isDarkTheme ? "sunny" : "moon"} size={24} color={isDarkTheme ? "#fff" : "#000"} />
         </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
            <Image
              source={{ uri: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      )}
    {menuVisible && screenWidth < 600 && (
    <View style={[styles.menu, isDarkTheme ? styles.darkMenu : styles.lightMenu]}>
          <View style={styles.navItems}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                <Ionicons name={isDarkTheme ? "sunny" : "moon"} size={24} color={isDarkTheme ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
      {[
        { label: 'Inicio', route: '/' },
        { label: 'Búsqueda', route: '/searchProducts' },
      ].map((item, index) => (
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
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
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
    backgroundColor: '#333',
  },
  lightNavbar: {
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 8, 
    fontSize: 16,
  },
  navItemHovered: {
    color: '#1DB954',
  },
  profileButton: {
    marginLeft: 10,
  },
  profileButtonSmallScreen: {
    marginLeft: 15,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    backgroundColor: '#fff',
  },
  darkMenu: {
    backgroundColor: '#333',
  },
  lightMenu: {
    backgroundColor: '#fff',
  },
  themeButton: {
    marginRight: 10,
  },
});

export default Navbar;