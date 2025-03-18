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

  useEffect(() => {
    console.log("Setting up auth state listener")

    // Set persistence to LOCAL to ensure the user stays logged in
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Auth persistence set to LOCAL")
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error)
      })

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User ${currentUser.uid}` : "No user")
      setUser(currentUser)
      setLoading(false)
    })

    return () => {
      console.log("Cleaning up auth state listener")
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting to sign in with Google")
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log("Successfully signed in with Google:", result.user.uid)
      // Don't return the result to match the Promise<void> return type
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log("Attempting to sign out")
      await firebaseSignOut(auth)
      console.log("Successfully signed out")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

