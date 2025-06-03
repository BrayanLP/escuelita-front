
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
// measurementId is optional for basic auth

const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: appId,
};

let missingVars = false;
let errorMessageDetails = "";

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    missingVars = true;
    errorMessageDetails += `  - ${key} is MISSING\n`;
  } else {
    errorMessageDetails += `  - ${key}: SET (value: ${value.substring(0,5)}...)\n`; // Log first 5 chars for checking
  }
}

if (missingVars) {
  const errorMessage = `
    Firebase configuration error: One or more critical environment variables are missing.
    Please ensure all NEXT_PUBLIC_FIREBASE_ prefixed variables are correctly set in your .env.local file.
    Details:
${errorMessageDetails}
    After adding/correcting them, YOU MUST RESTART your Next.js development server.
  `;
  console.error(errorMessage);
  // Throw an error to stop execution if critical Firebase config is missing
  throw new Error("Critical Firebase environment variables are missing. Check server console for details.");
}


const firebaseConfig = {
  apiKey: apiKey!, // We've checked it's not undefined
  authDomain: authDomain!,
  projectId: projectId!,
  storageBucket: storageBucket!,
  messagingSenderId: messagingSenderId!,
  appId: appId!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
// let firestore: Firestore;
// let storage: Storage;


if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

auth = getAuth(app);
// firestore = getFirestore(app);
// storage = getStorage(app);

export { app, auth /*, firestore, storage */ };
