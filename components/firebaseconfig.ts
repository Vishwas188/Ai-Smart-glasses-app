// components/FirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm5qxH6AlC4lkLIoyMlgVAY5mmYaxfrvw",
  authDomain: "visualassist123.firebaseapp.com",
  projectId: "visualassist123",
  storageBucket: "visualassist123.appspot.com", // NOTE: Fixed the domain!
  messagingSenderId: "77221471259",
  appId: "1:77221471259:web:49f1c313ec654525dec4be",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export storage and firestore to be used in other files
export const storage = getStorage(app);
export const firestore = getFirestore(app);
