/**
 * Firebase Configuration for React Native
 * Uses @react-native-firebase/* native SDKs (NOT web SDK)
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';

// Export Firebase services
export { auth, firestore, analytics };

/**
 * Firebase helper functions for common operations
 */
export const FirebaseHelpers = {
  // Authentication helpers
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      await analytics().logEvent('user_sign_in', { method: 'email' });
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      await analytics().logEvent('user_sign_up', { method: 'email' });
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
      await analytics().logEvent('user_sign_out');
      return { success: true };
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Update document error:', error);
      return { success: false, error: error.message };
    }
  },

  deleteDocument: async (collection: string, docId: string) => {
    try {
      await firestore().collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Get collection error:', error);
      return { success: false, error: error.message };
    }
  },

  // Analytics helpers
  logEvent: async (eventName: string, parameters?: any) => {
    try {
      await analytics().logEvent(eventName, parameters);
      return { success: true };
    } catch (error: any) {
      console.error('Analytics log event error:', error);
      return { success: false, error: error.message };
    }
  },
};

export default FirebaseHelpers;
