// Firebase Configuration for Web SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyDtkSFKvCRXNCimSdTBKSlnsT-35nok_ho",
  authDomain: "budgetgoat-e6fd2.firebaseapp.com",
  projectId: "budgetgoat-e6fd2",
  storageBucket: "budgetgoat-e6fd2.firebasestorage.app",
  messagingSenderId: "616944058051",
  appId: "1:616944058051:android:74934880df425f77e82c76",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
// Note: Analytics requires additional setup for web SDK
// const analytics = getAnalytics(app);

// Export Firebase services
export { auth, firestore };

// Helper functions for common Firebase operations
export const FirebaseHelpers = {
  // Authentication helpers
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Firestore helpers
  addDocument: async (collection: string, data: any) => {
    try {
      const docRef = await firestore().collection(collection).add({
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Add document error:', error);
      return { success: false, error: error.message };
    }
  },

  updateDocument: async (collection: string, docId: string, data: any) => {
    try {
      await firestore().collection(collection).doc(docId).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Update document error:', error);
      return { success: false, error: error.message };
    }
  },

  deleteDocument: async (collection: string, docId: string) => {
    try {
      await firestore().collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error) {
      console.error('Delete document error:', error);
      return { success: false, error: error.message };
    }
  },

  getCollection: async (collection: string, userId?: string) => {
    try {
      let query = firestore().collection(collection);
      
      if (userId) {
        query = query.where('userId', '==', userId);
      }
      
      const snapshot = await query.orderBy('createdAt', 'desc').get();
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return { success: true, data: documents };
    } catch (error) {
      console.error('Get collection error:', error);
      return { success: false, error: error.message };
    }
  },

  // Analytics helpers
  logEvent: async (eventName: string, parameters?: any) => {
    try {
      await analytics().logEvent(eventName, parameters);
      return { success: true };
    } catch (error) {
      console.error('Analytics log event error:', error);
      return { success: false, error: error.message };
    }
  },
};

export default FirebaseHelpers;
