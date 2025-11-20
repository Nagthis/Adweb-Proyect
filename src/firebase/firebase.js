import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase. Las variables de entorno se encuentran
// definidas en el archivo .env.local (no versionado). Utilice
// .env.example como referencia para configurar su propio proyecto de
// Firebase.
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

// Inicializa la aplicación de Firebase con la configuración anterior.
const firebaseApp = initializeApp(firebaseConfig);

// Exporta los servicios de autenticación y base de datos para ser
// utilizados en otras partes de la aplicación (e.g. Vuex store).
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };