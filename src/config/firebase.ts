import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALeUn3c8ZdYkdCIPoh7P0IAjYUsVt131E",
  authDomain: "budget-app-32c76.firebaseapp.com",
  projectId: "budget-app-32c76",
  storageBucket: "budget-app-32c76.firebasestorage.app",
  messagingSenderId: "752552917614",
  appId: "1:752552917614:web:b01faf965e2e9aaa51447f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

export const storage = getStorage(app);