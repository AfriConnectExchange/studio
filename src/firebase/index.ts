'use client';

// This file is no longer the primary service entry point.
// It is kept for any legacy components that might still reference it.
// New components should use the Supabase client directly from @/lib/supabase/client.

// The Firebase-related exports are commented out to prevent accidental use.
// They can be removed once all components are migrated to Supabase.

/*
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}
*/

// export * from './provider';
// export * from './client-provider';
// export * from './firestore/use-collection';
// export * from './firestore/use-doc';
// export * from './non-blocking-updates';
// export * from './non-blocking-login';
// export * from './errors';
// export * from './error-emitter';

console.log("Firebase services have been deprecated in favor of Supabase.");
