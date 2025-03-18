import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Polyfill global for Firebase
if (typeof window !== "undefined") {
  // @ts-ignore
  window.global = window
}

// Make sure all environment variables are defined
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
]

// Check if any required environment variables are missing
const missingEnvVars = requiredEnvVars.filter((varName) => !import.meta.env[varName])
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Log Firebase initialization details
console.log("Firebase initialized with project:", import.meta.env.VITE_FIREBASE_PROJECT_ID)
console.log("Auth domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
console.log("Auth service initialized:", !!auth)
console.log("Firestore service initialized:", !!db)
console.log("Storage service initialized:", !!storage)

// Enable Firestore persistence for offline support
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled")
    })
    .catch((err) => {
      if (err.code === "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn("Firestore persistence failed: Multiple tabs open")
      } else if (err.code === "unimplemented") {
        // The current browser does not support all of the features required to enable persistence
        console.warn("Firestore persistence not supported by this browser")
      } else {
        console.error("Error enabling persistence:", err)
      }
    })
} catch (error) {
  console.error("Error enabling persistence:", error)
}

export default app

