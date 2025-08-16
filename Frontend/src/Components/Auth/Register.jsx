// frontend/src/components/Auth/Register.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Building, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Header'
// import Footer from '../Footer'
import Hero1 from "../../assets/Hero1.jpg"

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const { register, loading, error, isAuthenticated, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      setLocalError(error)
      clearError()
    }
  }, [error, clearError])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (localError) setLocalError('')
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
    if (!formData.confirmPassword) {
      setLocalError('Please confirm your password')
      return false
    }
    if (!formData.full_name) {
      setLocalError('Full name is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError('Please enter a valid email address')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        company: formData.company || undefined
      }

      const result = await register(userData)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setLocalError(result.error || 'Registration failed')
      }
    } catch (error) {
      setLocalError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">
      <Header />
      
      {/* Main content with flex-1 to take remaining space */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 bg-[#0B0F1A] text-white">
        {/* Left Image */}
        <div className="hidden md:block">
          <img
            src={Hero1}
            alt="RiskSim Enterprise"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form - Added proper padding and centering */}
        <div className="flex items-center justify-center px-6 py-8 min-h-full">
          <div className="bg-[#101624] p-8 rounded-xl w-full max-w-md shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-[#E6E8EE]">
              Create Account
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

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Company <span className="text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#9CA3B0] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 bg-[#0B0F1A] border border-white/20 rounded-lg text-[#E6E8EE] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder="Confirm your password"
                  />
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Terms */}
              <div className="text-center">
                <p className="text-xs text-[#9CA3B0]">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>

            <div className="my-6 text-center text-sm text-[#9CA3B0]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Uncomment when you want to add footer back */}
      {/* <Footer /> */}
    </div>
  )
}

export default Register