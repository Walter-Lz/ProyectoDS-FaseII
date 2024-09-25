import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoginModal from './LoginModal';
const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseEnter = (item: string) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Mercado TEC</Text>
      <View style={styles.navItems}>
        {['Buscar articulo', 'Ofertas relampago'].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPressIn={() => handleMouseEnter(item)}
            onPressOut={handleMouseLeave}
          >
            <Text
              style={[
                styles.navItem,
                hoveredItem === item && styles.navItemHovered,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        <LoginModal />
      </View>
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
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
  navItemHovered: {
    color: '#1DB954',
  },
});

export default Navbar;