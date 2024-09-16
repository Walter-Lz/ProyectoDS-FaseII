import React from 'react';
import styled from 'styled-components/native';
import { Image, View, Text, TouchableOpacity, Linking, useColorScheme } from 'react-native';

const Footer = () => {
  const colorScheme = useColorScheme(); // Para compatibilidad con tema oscuro/claro

  return (
    <FooterContainer scheme={colorScheme}>
      <ApiSection>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.themealdb.com/')}>
          <ApiLogo source={{ uri: 'https://www.thesportsdb.com/images/logo-tmdb.png' }} />
        </TouchableOpacity>
        <ApiText>Información de recetas proporcionada por <ApiLink onPress={() => Linking.openURL('https://www.themealdb.com/')}>TheMealDB</ApiLink>.</ApiText>
      </ApiSection>

      <DeveloperSection>
        <DevHeader scheme={colorScheme}>Desarrollado por:</DevHeader>
        <Developer>
          <Text>Kevin Jiménez</Text>
          <IconLink onPress={() => Linking.openURL('https://linkedin.com/in/kvnjt')}>
            <IconImage source={require('../assets/linkedin.png')} />
          </IconLink>
          <IconLink onPress={() => Linking.openURL('https://github.com/Khraben')}>
            <IconImage source={require('../assets/github.png')} />
          </IconLink>
        </Developer>

        <Developer>
          <Text>Leiner Alvarado</Text>
          <IconLink onPress={() => Linking.openURL('https://www.linkedin.com/in/leiner-alvarado-357725247/')}>
            <IconImage source={require('../assets/linkedin.png')} />
          </IconLink>
          <IconLink onPress={() => Linking.openURL('https://github.com/Leiner117')}>
            <IconImage source={require('../assets/github.png')} />
          </IconLink>
        </Developer>

        <Developer>
          <Text>Walter Lazo</Text>
          <IconLink onPress={() => Linking.openURL('https://www.linkedin.com/in/walter-lazo-gonzález-76942b302')}>
            <IconImage source={require('../assets/linkedin.png')} />
          </IconLink>
          <IconLink onPress={() => Linking.openURL('https://github.com/Walter-Lz')}>
            <IconImage source={require('../assets/github.png')} />
          </IconLink>
        </Developer>
      </DeveloperSection>
    </FooterContainer>
  );
};

export default Footer;

// Estilos

const FooterContainer = styled(View)`
  background-color: ${({ scheme }) => (scheme === 'dark' ? '#333' : '#FFF159')};
  color: ${({ scheme }) => (scheme === 'dark' ? 'white' : '#333366')};
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  position: relative;
  bottom: 0;
`;

const ApiSection = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const ApiLogo = styled(Image)`
  height: 30px;
  width: auto;

  @media (max-width: 768px) {
    height: 25px;
  }
`;

const ApiText = styled(Text)`
  font-size: 0.9rem;
  text-align: center;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : '#333366')};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ApiLink = styled(Text)`
  color: #f0a500;
  text-decoration: underline;
  cursor: pointer;
`;

const DeveloperSection = styled(View)`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const DevHeader = styled(Text)`
  font-size: 1.2rem;
  color: ${({ scheme }) => (scheme === 'dark' ? '#FFF159' : '#333366')};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const Developer = styled(View)`
  text-align: center;
  margin-bottom: 10px;

  p {
    margin: 0;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const IconLink = styled(TouchableOpacity)`
  display: inline-block;
  margin: 5px;
`;

const IconImage = styled(Image)`
  height: 25px;
  width: 25px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    height: 20px;
    width: 20px;
  }
`;
