"use client"

import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../hooks/useAuth"
import { Navigate, useNavigate } from "react-router-dom"

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authAttempted, setAuthAttempted] = useState(false)

  // Handle authentication state changes
  useEffect(() => {
    if (user && !loading) {
      console.log("Login: User authenticated, redirecting to dashboard:", user.uid)
      setIsRedirecting(true)

      // Use a timeout to ensure the state update happens before navigation
      setTimeout(() => {
        navigate("/dashboard", { replace: true })
      }, 100)
    }
  }, [user, loading, navigate])

  // Handle Google sign-in
  const handleSignIn = async () => {
    try {
      setError(null)
      setIsRedirecting(true)
      setAuthAttempted(true)
      console.log("Login: Attempting Google sign in")
      await signInWithGoogle()
      // The useEffect above will handle redirection after successful sign-in
    } catch (error) {
      console.error("Login: Error signing in with Google:", error)
      setError("Failed to sign in with Google. Please try again.")
      setIsRedirecting(false)
    }
  }

  // Debug information
  const debugInfo = {
    userState: user ? `Authenticated (${user.uid})` : "Not authenticated",
    loadingState: loading ? "Loading" : "Not loading",
    redirectingState: isRedirecting ? "Redirecting" : "Not redirecting",
    authAttempted: authAttempted ? "Yes" : "No",
  }

  // Show loading state if we're in the process of checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    )
  }

  // Redirect if user is already logged in
  if (user && !isRedirecting) {
    console.log("Login: User already logged in, redirecting to dashboard")
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative px-4">
      {/* Background circles - only visible on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full border border-purple-100 opacity-20"></div>
        <div className="absolute top-[10%] right-[-150px] w-[300px] h-[300px] rounded-full border border-purple-100 opacity-20"></div>
        <div className="absolute bottom-[10%] left-[-100px] w-[250px] h-[250px] rounded-full border border-purple-100 opacity-20"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full border border-purple-100 opacity-20"></div>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-2xl font-bold text-primary">TaskBuddy</h1>
          </div>
          <p className="text-gray-600 text-sm max-w-xs">
            Streamline your workflow and track progress effortlessly with our all-in-one task management app
          </p>
        </div>

        <div className="w-full">
          <button
            onClick={handleSignIn}
            disabled={isRedirecting}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isRedirecting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FcGoogle className="text-xl bg-white rounded-full" />
            <span>{isRedirecting ? "Redirecting..." : "Continue with Google"}</span>
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">{error}</div>
          )}
        </div>

        {/* Debug information - only visible in development */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md w-full text-xs font-mono">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <ul>
              {Object.entries(debugInfo).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

