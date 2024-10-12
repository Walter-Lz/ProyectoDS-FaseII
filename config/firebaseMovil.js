// Componente funcional para Google Sign-In
import * as WebBrowser from 'expo-web-browser';
import { exchangeCodeAsync } from 'expo-auth-session';
import { Alert } from 'react-native';
import { GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import { getAuthent } from './firebaseConfig';
WebBrowser.maybeCompleteAuthSession();

const clientId = process.env.EXPO_PUBLIC_CLIENT_ID_KEY;
const redirectUri = process.env.EXPO_PUBLIC_REDIRECT_URL;

const GoogleLogin = async (onSuccess) => {
  const discoveryDocument = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };
  const auth = getAuthent();

  try {
    const authUrl = `${discoveryDocument.authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      if (code) {
        const exchangeTokenResponse = await exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discoveryDocument
        );
        const credential = GoogleAuthProvider.credential(exchangeTokenResponse.id_token);
        const userCredential = await signInWithCredential(auth, credential);
        console.log("Login exitoso", userCredential.user); // Mostrar datos del usuario
        if (onSuccess) {
          onSuccess(); // Llama a la función onSuccess
        }
      } else {
        Alert.alert('Authentication error', 'No code found in the URL');
      }
    } else {
      Alert.alert('Authentication error', 'something went wrong');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Authentication error', 'something went wrong');
  } finally {
    // Cierra la ventana del navegador
    WebBrowser.dismissBrowser();
  }
};

export default GoogleLogin;