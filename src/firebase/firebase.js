import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDe2DCj8HBprNPPDaE8Poze3E2G7l9GC1s",
  authDomain: "admin-cursos-vue.firebaseapp.com",
  projectId: "admin-cursos-vue",
  storageBucket: "admin-cursos-vue.firebasestorage.app",
  messagingSenderId: "753366620876",
  appId:"1:753366620876:web:7608d0a5b06e39ae3a0069"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };