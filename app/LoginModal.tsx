import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { signInWithGoogle, getCurrentUser, logOut, db } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTheme } from './ThemeContext';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const { isDarkTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const DEFAULT_PROFILE_PICTURE_URL = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png";
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUserProfilePicture(currentUser.photoURL);
    }
  }, []);

   const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      const currentUser = getCurrentUser();
      if (currentUser) {
        setIsLoggedIn(true);
        setUserProfilePicture(currentUser.photoURL);
  
        // Verificar si el documento en la colección Carrito ya existe
        const carritoRef = doc(db, 'Carrito', currentUser.uid);
        const carritoDoc = await getDoc(carritoRef);
  
        if (!carritoDoc.exists()) {
          // Crear un nuevo documento en la colección Carrito si no existe
          await setDoc(carritoRef, {}, { merge: true });
          console.log('Documento de carrito creado');
        } else {
          console.log('Documento de carrito ya existe');
        }
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsLoggedIn(false);
      setUserProfilePicture(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const navigateToWishlist = () => {
    onClose(); // Cerrar el modal antes de navegar
    router.push('/wishList'); // Navegar al componente Wishlist
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={isDarkTheme ? styles.modalContentDark : styles.modalContent}>
          <Image
            source={{ uri: userProfilePicture || DEFAULT_PROFILE_PICTURE_URL }}
            style={styles.profilePicture}
          />
          <Text style={isDarkTheme ? styles.modalTitleDark : styles.modalTitle}>
            {isLoggedIn ? 'Welcome!' : 'Please log in'}
          </Text>
          <TouchableOpacity
            style={isDarkTheme ? styles.buttonDark : styles.button}
            onPress={isLoggedIn ? handleLogOut : handleSignInWithGoogle}
          >
            <Text style={isDarkTheme ? styles.buttonTextDark : styles.buttonText}>
              {isLoggedIn ? 'Log Out' : 'Sign In with Google'}
            </Text>
          </TouchableOpacity>
          {isLoggedIn && (
            <TouchableOpacity
              style={isDarkTheme ? styles.buttonDark : styles.button}
              onPress={navigateToWishlist}
            >
              <Text style={isDarkTheme ? styles.buttonTextDark : styles.buttonText}>
                Lista de Deseados
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={isDarkTheme ? styles.buttonDark : styles.button}
            onPress={onClose}
          >
            <Text style={isDarkTheme ? styles.buttonTextDark : styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 40,
    paddingRight: 20,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContentDark: {
    width: 300,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#3483FA',
  },
  modalTitleDark: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFDD00',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3483FA',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDark: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFDD00',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextDark: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default LoginModal;