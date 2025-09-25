import { initializeFirebase as initializeFirebaseClient, FirebaseClientProvider } from './client-provider';
import { useAuth, useUser, useFirebase, useFirebaseApp, useFirestore } from './provider';

// This is the only function that should be used to initialize Firebase.
export function initializeFirebase() {
    return initializeFirebaseClient();
}

export { FirebaseClientProvider, useAuth, useUser, useFirebase, useFirebaseApp, useFirestore };
