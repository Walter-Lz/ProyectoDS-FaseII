import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import LoginModal from './LoginModal';

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); 
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
    <View style={styles.navbar}>
      <Text style={styles.logo}>Mercado TEC</Text>

      {screenWidth < 600 ? (
        // Menú hamburguesa en dispositivos móviles
        <View style={styles.smallScreenContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButtonSmallScreen} onPress={toggleModal}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      ) : (
        // Menú normal en pantallas más grandes
        <View style={styles.navItemsContainer}>
          <View style={styles.navItems}>
            {[
              { label: 'Inicio', route: '/' },
              { label: 'Calendario', route: '/calendar' },
              { label: 'Sobre Nosotros', route: '/about' }
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
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      )}

      {menuVisible && screenWidth < 600 && (
        <View style={styles.menu}>
          {[
            { label: 'Inicio', route: '/' },
            { label: 'Calendario', route: '/calendar' },
            { label: 'Sobre Nosotros', route: '/about' }
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
    backgroundColor: '#333',
    padding: 15,
    zIndex: 100, 
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    color: '#fff',
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
    backgroundColor: '#333',
    paddingVertical: 20,
    zIndex: 9999, 
    alignItems: 'center',
  },
});

export default Navbar;
