import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { signInWithGoogle, getCurrentUser, logOut } from '../config/firebaseConfig';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const DEFAULT_PROFILE_PICTURE_URL = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png";

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
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsLoggedIn(false);
      setUserProfilePicture(null);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>Perfil del Usuario</Text>
          {!isLoggedIn ? (
            <>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Registrarse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Iniciar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton} onPress={handleSignInWithGoogle}>
                <Text style={styles.authButtonText}>Iniciar con Google</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.authButton}>
                <Text style={styles.authButtonText}>Lista de Deseados</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authButton} onPress={handleSignOut}>
                <Text style={styles.authButtonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    marginLeft: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 50, 
    marginRight: 10, 
    position: 'relative',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
  authButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%', 
    alignItems: 'center', 
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    width: '100%', 
    alignItems: 'center', 
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loggedInText: {
    fontSize: 18,
    color: '#000',
  },
});

export default LoginModal;