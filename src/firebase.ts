import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApVjr4Unnl1AdJIV2DNk8Gt40W-d5Ix4A",
    authDomain: "fcodribble.firebaseapp.com",
    projectId: "fcodribble",
    storageBucket: "fcodribble.appspot.com",
    messagingSenderId: "173840177008",
    appId: "1:173840177008:web:2a6611364e58ac959761b5",
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
