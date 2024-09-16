import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useColorScheme, Image, View, Text, TouchableOpacity } from 'react-native';
import LoginAuth from './LoginAuth'; // Importamos el componente LoginAuth adaptado a Expo

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('En');
  const [showUserAuth, setShowUserAuth] = useState(false);
  const router = useRouter(); // Usamos Expo Router para navegación
  const colorScheme = useColorScheme(); // Para tema claro/oscuro

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    closeMenu();
  };

  const toggleUserAuth = () => {
    setShowUserAuth(!showUserAuth);
  };

  return (
    <Nav scheme={colorScheme}>
      <Hamburger onPress={toggleMenu}>
        <HamburgerBar />
        <HamburgerBar />
        <HamburgerBar />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <MenuLink onPress={() => { router.push('/'); closeMenu(); }} isActive={router.pathname === '/'}>
          Inicio
        </MenuLink>
        <MenuLink onPress={() => { router.push('/exploremap'); closeMenu(); }} isActive={router.pathname === '/exploremap'}>
          Explorar mapa
        </MenuLink>
        <MenuLink onPress={() => { router.push('/searchrecipes'); closeMenu(); }} isActive={router.pathname === '/searchrecipes'}>
          Buscar recetas
        </MenuLink>
      </Menu>
      <RightSection>
        <LanguageSelector>
          <LanguageOption selected={language === 'Es'} onPress={() => handleLanguageChange('Es')}>
            Es
          </LanguageOption>
          <Text>|</Text>
          <LanguageOption selected={language === 'En'} onPress={() => handleLanguageChange('En')}>
            En
          </LanguageOption>
        </LanguageSelector>
        <LoginIcon onPress={toggleUserAuth}>
          <Image source={require('../assets/user.png')} style={{ height: 30, width: 30 }} />
        </LoginIcon>
        {showUserAuth && <LoginAuth />}
      </RightSection>
    </Nav>
  );
};

export default Navbar;

// Estilos

const Nav = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: ${({ scheme }) => (scheme === 'dark' ? '#333' : '#FFF159')}; /* Mercado Libre Amarillo en modo claro */
  padding: 0 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
`;

const RightSection = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const Hamburger = styled(TouchableOpacity)`
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }
`;

const HamburgerBar = styled(View)`
  height: 3px;
  width: 25px;
  background-color: white;
  margin-bottom: 4px;
  border-radius: 5px;
`;

const Menu = styled(View)`
  flex-direction: row;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#FFF159'};
    position: absolute;
    top: 60px;
    left: 0;
    padding: 10px 0;
    z-index: 9999;
  }
`;

const MenuLink = styled(TouchableOpacity)`
  padding: 10px;
  color: ${({ isActive, theme }) => (isActive ? '#f0a500' : theme === 'dark' ? 'white' : '#333366')};
  font-size: 1.2rem;
`;

const LoginIcon = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
`;

const LanguageSelector = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LanguageOption = styled(TouchableOpacity)`
  color: ${({ selected, theme }) => (selected ? '#f0a500' : theme === 'dark' ? 'white' : '#333366')};
  font-size: 1.2rem;
`;
