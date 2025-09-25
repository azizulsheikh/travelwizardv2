'use client';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getPerformance } from 'firebase/performance';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { createContext, ReactNode, useContext } from 'react';
import { FirebaseProvider, useFirebase } from './provider';

const APP_NAME = 'default';

// This is the config for the Firebase project. It is safe to expose this to the client.
// It is NOT a secret. It is used to identify the project and to allow the client to connect to it.
const firebaseConfig = {"apiKey":"your-api-key","authDomain":"your-auth-domain","projectId":"your-project-id","storageBucket":"your-storage-bucket","messagingSenderId":"your-messaging-sender-id","appId":"your-app-id"};

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (app) {
    return { app, auth, firestore };
  }

  app = initializeApp(firebaseConfig, APP_NAME);
  auth = getAuth(app);
  firestore = getFirestore(app);

  if (process.env.NODE_ENV === 'development') {
    // These lines connect the Firebase services to the emulators.
    // The emulators must be running for this to work.
    // This is only for development and will not be included in the production build.
    console.log('Connecting to Firebase emulators');
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    const functions = getFunctions(app);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    const storage = getStorage(app);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }

  isSupported().then((supported) => {
    if (supported) {
      // getAnalytics(app);
      // getPerformance(app);
    }
  });

  return { app, auth, firestore };
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = initializeFirebase();

  if (!firebase) {
    return <>{children}</>;
  }
  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}

export function useFirebaseClient() {
  return useFirebase();
}
