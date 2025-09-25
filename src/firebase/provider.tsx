'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: ReactNode;
} & FirebaseContextValue) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useFirestore() {
  return useFirebase().firestore;
}

export function useAuth() {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading, auth };
}

// A hook that returns the current user.
export function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}
