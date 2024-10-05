import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut,initializeAuth, getReactNativePersistence,browserLocalPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "promocionestec-a3718.firebaseapp.com",
    projectId: "promocionestec-a3718",
    storageBucket: "promocionestec-a3718.appspot.com",
    messagingSenderId: "68885677496",
    appId: "1:68885677496:web:0b069d1e946406ee76fb4d",
    measurementId: "G-R13VW8H5MS"
};

const app = initializeApp(firebaseConfig);
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
 // auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  } catch (error) {
    console.error(error);
  }
};

const logOut = () => {
  return signOut(auth);
};
const getCurrentUser = () => {
  return auth.currentUser;
}
const db = getFirestore(app);
export { db };
export { auth, signInWithGoogle, logOut, getCurrentUser};