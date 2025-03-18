"use client"

import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"

const Login = () => {
  const { user, signInWithGoogle } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" />
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
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FcGoogle className="text-xl bg-white rounded-full" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

