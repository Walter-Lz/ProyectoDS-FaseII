import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

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
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Mercado TEC</Text>
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
        <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Perfil del Usuario</Text>
            <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleButtonText}>Iniciar con Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileButton: {
    marginLeft: 15,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  googleButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4285F4',
    borderRadius: 5,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navbar;