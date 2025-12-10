'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  try {
    let firebaseApp: FirebaseApp;

    if (getApps().length) {
      firebaseApp = getApp();
    } else {
      try {
        // Check for placeholder values
        if (firebaseConfig.apiKey === 'your_api_key' || !firebaseConfig.apiKey) {
          console.warn('Firebase API key is missing or invalid (placeholder). App running in Demo Mode.');
          return { firebaseApp: null, auth: null, firestore: null };
        }

        // Try initializing with config first if available
        if (firebaseConfig.apiKey) {
          firebaseApp = initializeApp(firebaseConfig as FirebaseOptions);
        } else {
          // Fallback to automatic (App Hosting) or throw
          firebaseApp = initializeApp();
        }
      } catch (e) {
        console.warn('Firebase initialization failed. App will run with limited functionality.', e);
        return { firebaseApp: null, auth: null, firestore: null };
      }
    }

    return getSdks(firebaseApp);
  } catch (e) {
    console.error('Unexpected error during Firebase initialization:', e);
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
