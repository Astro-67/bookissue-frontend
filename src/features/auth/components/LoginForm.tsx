import React, { useState } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { Logo } from '../../../ui/Logo'
import { useLogin } from '../../../hooks/api'
import type { LoginCredentials } from '../../../types/api'

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    loginMutation.mutate(formData, {
      onSuccess: () => {
        // Set redirecting state to show loading and prevent form flash
        setIsRedirecting(true)
        // Don't navigate here - let the root component handle the redirect
        // The AuthContext will update and trigger the redirect logic in __root.tsx
      },
      onError: () => {
        // Reset redirecting state on error
        setIsRedirecting(false)
        // Error is already handled by the mutation state
      },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  // Show loading screen if redirecting after successful login
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div>
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Book Issue Tracker System
          </p>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {showPassword ? (
                  <RiEyeOffLine className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <RiEyeLine className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending || isRedirecting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : isRedirecting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Redirecting...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {loginMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm text-center">
                {(loginMutation.error as any)?.response?.data?.detail || 
                 (loginMutation.error as any)?.response?.data?.message ||
                 (loginMutation.error as any)?.message || 
                 'Login failed. Please check your credentials.'}
              </p>
            </div>
          )}

          <div className="mt-6 ">
           
          </div>
        </form>
      </div>
    </div>
  )
}
