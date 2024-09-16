import React, { useState } from 'react';
import styled from 'styled-components/native'; // Cambiamos a styled-components/native para Expo/React Native
import { View, Text, TextInput, TouchableOpacity, Image, useColorScheme } from 'react-native';

const DEFAULT_PROFILE_PICTURE_URL = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png";

const LoginAuth = () => {
  const [user, setUser] = useState(null); // Se mantiene el usuario simulado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Para el modo claro/oscuro
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    // Lógica de inicio de sesión simulada
    setUser({ displayName: name || 'User', photoURL: DEFAULT_PROFILE_PICTURE_URL });
  };

  const handleRegister = () => {
    // Lógica de registro simulada
    if (password === confirmPassword) {
      setUser({ displayName: name, photoURL: DEFAULT_PROFILE_PICTURE_URL });
      setIsRegistering(false);
    } else {
      alert('Passwords do not match');
    }
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión simulada
    setUser(null);
  };

  return (
    <AuthContainer scheme={colorScheme}>
      {user ? (
        <>
          <UserInfo>
            <UserImage source={{ uri: user.photoURL }} />
            <WelcomeText>¡Hola, {user.displayName}!</WelcomeText>
          </UserInfo>
          <Button onPress={handleLogout}>Cerrar sesión</Button>
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <StyledInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Nombre"
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <StyledInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <StyledInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <StyledInput
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                placeholder="Confirmar contraseña"
                secureTextEntry
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <Button onPress={handleRegister}>Registrarse</Button>
              <ToggleText onPress={() => setIsRegistering(false)}>
                ¿Ya tienes cuenta? Inicia sesión
              </ToggleText>
            </>
          ) : (
            <>
              <StyledInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <StyledInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Contraseña"
                secureTextEntry
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#333'}
              />
              <Button onPress={handleLogin}>Iniciar sesión</Button>
              <ToggleText onPress={() => setIsRegistering(true)}>
                ¿No tienes cuenta? Regístrate
              </ToggleText>
            </>
          )}
        </>
      )}
    </AuthContainer>
  );
};

export default LoginAuth;

// Estilos
const AuthContainer = styled(View)`
  padding: 20px;
  background-color: ${({ scheme }) => (scheme === 'dark' ? '#000' : '#FFF')};
  border: 1px solid ${({ scheme }) => (scheme === 'dark' ? '#FFF' : '#000')};
  border-radius: 10px;
`;

const UserInfo = styled(View)`
  align-items: center;
  margin-bottom: 20px;
`;

const UserImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const WelcomeText = styled(Text)`
  font-size: 18px;
  color: ${({ theme }) => (theme === 'dark' ? '#FFF159' : '#333366')}; 
  font-weight: bold;
  text-align: center;
`;

const StyledInput = styled(TextInput)`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#FFF')};
  color: ${({ theme }) => (theme === 'dark' ? '#FFF' : '#333')};
`;

const Button = styled(TouchableOpacity)`
  background-color: #FFF159; /* Amarillo Mercado Libre */
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: #333366; /* Azul Mercado Libre */
  font-weight: bold;
  font-size: 16px;
`;

const ToggleText = styled(Text)`
  color: ${({ theme }) => (theme === 'dark' ? '#FFF' : '#333')};
  text-align: center;
  text-decoration: underline;
  margin-top: 10px;
`;