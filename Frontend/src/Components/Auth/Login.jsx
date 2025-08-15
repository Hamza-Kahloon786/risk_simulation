// frontend/src/components/Auth/Login.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Header'
import Footer from '../Footer'
import Hero1 from "../../assets/Hero1.jpg"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const { login, loading, error, isAuthenticated, clearError } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Clear errors when component unmounts or form changes
  useEffect(() => {
    return () => clearError()
  }, [clearError])

  useEffect(() => {
    if (error) {
      setLocalError(error)
      clearError()
    }
  }, [error, clearError])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (localError) {
      setLocalError('')
    }
  }

  const validateForm = () => {
    if (!formData.email) {
      setLocalError('Email is required')
      return false
    }
    if (!formData.password) {
      setLocalError('Password is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setLocalError(result.error || 'Login failed')
      }
    } catch (error) {
      setLocalError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-128px)] bg-[#0B0F1A] text-white">
        {/* Left Image */}
        <div className="hidden md:block">
          <img
            src={Hero1}
            alt="RiskSim Enterprise"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center px-6">
          <div className="bg-[#101624] p-8 rounded-xl w-full max-w-md shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-[#E6E8EE]">
              Welcome Back
            </h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Error Message */}
              {localError && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-300 text-sm">{localError}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="my-6 text-center text-sm text-[#9CA3B0]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
              >
                Sign up
              </Link>
            </div>

            {/* Demo Credentials */}
            {/* <div className="mt-6 p-4 bg-[#0B0F1A] rounded-lg border border-white/10">
              <h3 className="text-sm font-medium text-[#9CA3B0] mb-2">Demo Credentials</h3>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Email: demo@risksim.com</p>
                <p>Password: Demo123!</p>
              </div>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login