import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
// Using real credentials from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDtkSFKvCRXNCimSdTBKSlnsT-35nok_ho",
  authDomain: "budgetgoat-e6fd2.firebaseapp.com",
  projectId: "budgetgoat-e6fd2",
  storageBucket: "budgetgoat-e6fd2.firebasestorage.app",
  messagingSenderId: "616944058051",
  appId: "1:616944058051:android:74934880df425f77e82c76",
  measurementId: "G-XXXXXXXXXX" // Optional for React Native
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (disabled for React Native)
let analytics: any = null;
// Analytics is disabled for React Native to avoid web-specific code issues
export { analytics };

// Connect to emulators in development
// Disabled for now to prevent connection errors
// if (__DEV__) {
//   try {
//     // Auth emulator
//     if (!auth.emulatorConfig) {
//       connectAuthEmulator(auth, 'http://localhost:9099');
//     }
//     
//     // Firestore emulator
//     if (!db._delegate._databaseId.projectId.includes('demo-')) {
//       connectFirestoreEmulator(db, 'localhost', 8080);
//     }
//     
//     // Storage emulator
//     if (!storage._delegate._host.includes('localhost')) {
//       connectStorageEmulator(storage, 'localhost', 9199);
//     }
//     
//     console.log('🔥 Firebase emulators connected');
//   } catch (error) {
//     console.warn('Firebase emulators not available:', error);
//   }
// }

export default app;