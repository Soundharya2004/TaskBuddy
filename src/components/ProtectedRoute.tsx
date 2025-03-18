"use client"

import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoadingScreen from "./LoadingScreen"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log("ProtectedRoute: User authenticated, rendering protected content")
  return <>{children}</>
}

export default ProtectedRoute

