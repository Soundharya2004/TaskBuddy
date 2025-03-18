"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { auth } from "../firebase/config"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener")

    const setupAuth = async () => {
      try {
        // Set persistence to LOCAL to ensure the user stays logged in
        await setPersistence(auth, browserLocalPersistence)
        console.log("AuthProvider: Auth persistence set to LOCAL")

        // Check if we're already authenticated
        const currentUser = auth.currentUser
        if (currentUser) {
          console.log("AuthProvider: Already authenticated as:", currentUser.uid)
          setUser(currentUser)
        }

        setAuthInitialized(true)
      } catch (error) {
        console.error("AuthProvider: Error setting up auth:", error)
        setAuthInitialized(true)
      }
    }

    setupAuth()

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AuthProvider: Auth state changed:", currentUser ? `User ${currentUser.uid}` : "No user")
      setUser(currentUser)
      setLoading(false)
    })

    return () => {
      console.log("AuthProvider: Cleaning up auth state listener")
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      console.log("AuthProvider: Attempting to sign in with Google")
      setLoading(true)

      const provider = new GoogleAuthProvider()
      // Add scopes if needed
      provider.addScope("email")
      provider.addScope("profile")

      // Force account selection even when already signed in
      provider.setCustomParameters({
        prompt: "select_account",
      })

      const result = await signInWithPopup(auth, provider)
      console.log("AuthProvider: Successfully signed in with Google:", result.user.uid)
    } catch (error) {
      console.error("AuthProvider: Error signing in with Google:", error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log("AuthProvider: Attempting to sign out")
      setLoading(true)
      await firebaseSignOut(auth)
      console.log("AuthProvider: Successfully signed out")
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error)
      setLoading(false)
      throw error
    }
  }

  const value = {
    user,
    loading: loading || !authInitialized,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

