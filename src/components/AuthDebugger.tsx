"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"

const AuthDebugger = () => {
  const { user, loading } = useAuth()
  const [authState, setAuthState] = useState<string>("Initializing...")
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check authentication state
    if (loading) {
      setAuthState("Loading authentication state...")
    } else if (user) {
      setAuthState(`Authenticated as: ${user.email} (${user.uid})`)
    } else {
      setAuthState("Not authenticated")
    }

    // Check environment variables (safe ones only)
    const safeEnvVars: Record<string, string> = {
      PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "Not set",
      AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "Not set",
    }
    setEnvVars(safeEnvVars)
  }, [user, loading])

  if (process.env.NODE_ENV === "production" && !import.meta.env.VITE_ENABLE_DEBUG) {
    return null // Don't show in production unless explicitly enabled
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4 text-xs font-mono z-50">
      <div className="max-w-screen-lg mx-auto">
        <h3 className="font-bold mb-2">Auth Debugger</h3>
        <p>Auth State: {authState}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
        <div className="mt-2">
          <p className="font-bold">Environment Variables:</p>
          <ul>
            {Object.entries(envVars).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-yellow-300">
          Note: This debugger is only visible in development mode or when VITE_ENABLE_DEBUG is set.
        </p>
      </div>
    </div>
  )
}

export default AuthDebugger

