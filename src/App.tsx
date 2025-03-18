"use client"

import { useEffect, useState } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingScreen from "./components/LoadingScreen"
import AuthDebugger from "./components/AuthDebugger"

function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false)

  useEffect(() => {
    // Only run this effect once when loading becomes false
    if (!loading && !initialAuthCheckComplete) {
      setInitialAuthCheckComplete(true)

      if (user) {
        console.log("Initial auth check complete: User is authenticated, current path:", location.pathname)

        // Only redirect if not already on dashboard
        if (location.pathname !== "/dashboard") {
          console.log("Redirecting to dashboard")
          navigate("/dashboard", { replace: true })
        }
      } else {
        console.log("Initial auth check complete: User is not authenticated")

        // Only redirect if not already on login
        if (location.pathname !== "/login") {
          console.log("Redirecting to login")
          navigate("/login", { replace: true })
        }
      }
    }
  }, [loading, user, navigate, location.pathname, initialAuthCheckComplete])

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <>
        <LoadingScreen />
        <AuthDebugger />
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
      <AuthDebugger />
    </>
  )
}

export default App

