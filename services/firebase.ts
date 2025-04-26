// Arquivo: nexum/services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAm3SjfedThFlZjBy7ZXSyk1ZRNkMdLo4g",
    authDomain: "nexum-f9dd7.firebaseapp.com",
    projectId: "nexum-f9dd7",
    storageBucket: "nexum-f9dd7.firebasestorage.app",
    messagingSenderId: "1002459896279",
    appId: "1:1002459896279:web:841b85b3abf025e8f15392"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Exporta o módulo de autenticação
export const auth = getAuth(app);
