import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCYKEBWRzYLtJdU3ZEntW590YVTXEr4uLA",
  authDomain: "hotel-booking-firebase.firebaseapp.com",
  projectId: "hotel-booking-firebase",
  storageBucket: "hotel-booking-firebase.appspot.com",
  messagingSenderId: "446897758289",
  appId: "1:446897758289:web:1ae95a22bc3c2a593f1870",
  measurementId: "G-XJBN0N1QWJ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (global as any)._auth ||
      ((global as any)._auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      }));
