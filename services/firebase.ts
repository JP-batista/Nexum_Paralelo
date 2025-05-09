// Arquivo: nexum/services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Usar getAuth padrão
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAm3SjfedThFlZjBy7ZXSyk1ZRNkMdLo4g",
  authDomain: "nexum-f9dd7.firebaseapp.com",
  projectId: "nexum-f9dd7",
  storageBucket: "nexum-f9dd7.firebasestorage.app",
  messagingSenderId: "1002459896279",
  appId: "1:1002459896279:web:841b85b3abf025e8f15392"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// ✅ Inicializa o Auth normalmente (sem persistência manual)
export const auth = getAuth(app);

// Inicializa o Firestore
export const db = getFirestore(app);


// Importante, nao apagar
// Arquivo: nexum/services/firebase.ts

// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAm3SjfedThFlZjBy7ZXSyk1ZRNkMdLo4g",
//   authDomain: "nexum-f9dd7.firebaseapp.com",
//   projectId: "nexum-f9dd7",
//   storageBucket: "nexum-f9dd7.firebasestorage.app",
//   messagingSenderId: "1002459896279",
//   appId: "1:1002459896279:web:841b85b3abf025e8f15392"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// export const db = getFirestore(app);
