import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from './ThemeContext';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using Expo

const developers = [
  {
    name: '   Kevin Jiménez',
    github: 'https://github.com/Khraben',
    linkedin: 'https://www.linkedin.com/in/kvnjt',
  },
  {
    name: '       Walter Lazo',
    github: 'https://github.com/Walter-Lz',
    linkedin: 'https://www.linkedin.com/in/walter-lazo-gonzález-76942b302',
  },
  {
    name: 'Leiner Alvarado',
    github: 'https://github.com/Leiner117',
    linkedin: 'https://www.linkedin.com/in/leiner-alvarado-357725247',
  },
];

const Footer: React.FC = () => {
  const { isDarkTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;

  return (
    <View style={[styles.footer, isDarkTheme ? styles.darkFooter : styles.lightFooter]}>
      <Text style={[styles.footerText, isDarkTheme ? styles.darkText : styles.lightText]}>
        © 2024 Mercado TEC. Todos los derechos reservados.
      </Text>
      <View style={styles.developerSection}>
        <Text style={[styles.developerTitle, isDarkTheme ? styles.darkText : styles.lightText]}>
          Desarrollado por:
        </Text>
        <View style={[styles.developerList, isWeb && styles.developerListWeb]}>
          {developers.map((dev, index) => (
            <View key={index} style={[styles.developer, isWeb && styles.developerWeb]}>
              <Text style={[styles.developerName, isDarkTheme ? styles.darkText : styles.lightText]}>
                {dev.name}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(dev.github)}>
                <FontAwesome name="github" size={24} color={isDarkTheme ? '#000' : '#fff'} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(dev.linkedin)}>
                <FontAwesome name="linkedin" size={24} color={isDarkTheme ? '#000' : '#fff'} style={styles.icon} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkFooter: {
    backgroundColor: '#FFDD00',
  },
  lightFooter: {
    backgroundColor: '#3483FA',
  },
  footerText: {
    fontSize: 14,
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#fff',
  },
  developerSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  developerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  developerList: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  developerListWeb: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  developer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  developerWeb: {
    marginVertical: 0,
    marginHorizontal: 10,
  },
  developerName: {
    fontSize: 14,
    marginRight: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default Footer;