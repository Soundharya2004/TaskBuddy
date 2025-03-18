"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingScreen from "./components/LoadingScreen"

function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only redirect if we're not already on the dashboard and user is logged in
    if (!loading && user && location.pathname !== "/dashboard") {
      console.log("App: User authenticated, redirecting to dashboard:", user.uid)
      navigate("/dashboard")
    }
  }, [user, loading, navigate, location.pathname])

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App

  