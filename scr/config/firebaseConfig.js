import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "promocionestec-a3718.firebaseapp.com",
    projectId: "promocionestec-a3718",
    storageBucket: "promocionestec-a3718.appspot.com",
    messagingSenderId: "68885677496",
    appId: "1:68885677496:web:0b069d1e946406ee76fb4d",
    measurementId: "G-R13VW8H5MS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

const db = getFirestore(app);
export { db };
export { auth, signInWithGoogle, logOut };