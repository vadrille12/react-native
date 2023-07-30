import { initializeApp } from "firebase/app";

import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB97fBM8kklr9cyi4GK1APPtA8SnuDp_Zg",
  authDomain: "rn-hw-e7572.firebaseapp.com",
  databaseURL: "https://rn-hw-e7572-default-rtdb.firebaseio.com",
  projectId: "rn-hw-e7572",
  storageBucket: "rn-hw-e7572.appspot.com",
  messagingSenderId: "898555180997",
  appId: "1:898555180997:web:cd59645128a87b9abffdac",
  measurementId: "G-YVXJ0J7KSZ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
