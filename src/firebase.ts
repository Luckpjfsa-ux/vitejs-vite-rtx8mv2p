import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB3RdurcPcj12YorfreEPzi9XtX8vAC0MI',
  authDomain: 'caca-ao-tesouro-real.firebaseapp.com',
  databaseURL: 'https://caca-ao-tesouro-real-default-rtdb.firebaseio.com',
  projectId: 'caca-ao-tesouro-real',
  storageBucket: 'caca-ao-tesouro-real.appspot.com',
  messagingSenderId: '173789750089',
  appId: '1:173789750089:web:76f1f141f314c7b6ab698',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Realtime Database
export const database = getDatabase(app);
