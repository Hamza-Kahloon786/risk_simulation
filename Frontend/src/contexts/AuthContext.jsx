// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Enhanced localStorage utilities for better persistence
const AuthStorage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('userInfo');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('userInfo', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('userInfo'),
  
  getAuthStatus: () => localStorage.getItem('isAuthenticated') === 'true',
  setAuthStatus: (status) => localStorage.setItem('isAuthenticated', status.toString()),
  removeAuthStatus: () => localStorage.removeItem('isAuthenticated'),
  
  clearAll: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
  },
  
  isAuthenticated: () => {
    const token = AuthStorage.getToken();
    const isAuth = AuthStorage.getAuthStatus();
    const user = AuthStorage.getUser();
    return token && isAuth && user;
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => AuthStorage.getUser())
  const [token, setToken] = useState(() => AuthStorage.getToken())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'isAuthenticated' || e.key === 'userInfo') {
        const isAuth = AuthStorage.isAuthenticated();
        
        if (isAuth) {
          const storedToken = AuthStorage.getToken();
          const storedUser = AuthStorage.getUser();
          setToken(storedToken);
          setUser(storedUser);
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = async () => {
    const savedToken = AuthStorage.getToken()
    if (!savedToken) {
      setLoading(false)
      return
    }

    try {
      console.log('Checking auth with token:', savedToken?.substring(0, 20) + '...')
      
      // Use the api instance which already has proper interceptors
      const response = await api.get('/auth/me')
      console.log('Auth check response:', response.data)
      
      const data = response.data
      if (data.success) {
        const userData = data.data;
        setUser(userData)
        setToken(savedToken)

        // Update localStorage with fresh user data
        AuthStorage.setUser(userData);
        AuthStorage.setAuthStatus(true);
      } else {
        console.warn('Auth check failed - invalid response structure')
        // Clear invalid session
        AuthStorage.clearAll();
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error.response?.status, error.response?.data || error.message)
      
      if (error.response?.status === 401) {
        // Token is invalid, clear it
        console.log('Token is invalid, clearing auth data')
        AuthStorage.clearAll();
        setToken(null)
        setUser(null)
      } else {
        // Network error - keep token for offline use
        console.warn('Auth check network error, keeping cached data')
        if (savedToken && AuthStorage.getUser()) {
          setToken(savedToken)
          setUser(AuthStorage.getUser())
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Attempting login for:', email)

      // Use api instance but without token for login
      const response = await api.post('/auth/login', { email, password })
      console.log('Login response:', response.data)

      const data = response.data
      if (data.success) {
        const { access_token, user: userData } = data.data
        
        console.log('Login successful, token received:', access_token?.substring(0, 20) + '...')
        
        // Update localStorage
        AuthStorage.setToken(access_token);
        AuthStorage.setUser(userData);
        AuthStorage.setAuthStatus(true);
        
        // Update state
        setToken(access_token)
        setUser(userData)
        
        return { success: true, user: userData }
      } else {
        const errorMessage = data.detail || data.message || 'Login failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      
      let errorMessage = 'Login failed'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Attempting registration for:', userData.email)

      const response = await api.post('/auth/register', userData)
      console.log('Register response:', response.data)

      const data = response.data
      if (data.success) {
        const { access_token, user: newUser } = data.data
        
        // Update localStorage
        AuthStorage.setToken(access_token);
        AuthStorage.setUser(newUser);
        AuthStorage.setAuthStatus(true);
        
        // Update state
        setToken(access_token)
        setUser(newUser)
        
        return { success: true, user: newUser }
      } else {
        const errorMessage = data.detail || data.message || 'Registration failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message)
      
      let errorMessage = 'Registration failed'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear all storage and state
      AuthStorage.clearAll();
      setToken(null)
      setUser(null)
      setError(null)
      
      // Redirect to home page
      window.location.href = '/';
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.put('/auth/profile', profileData)
      const data = response.data

      if (data.success) {
        const updatedUser = data.data;
        
        // Update localStorage and state
        AuthStorage.setUser(updatedUser);
        setUser(updatedUser)
        
        return { success: true, user: updatedUser }
      } else {
        const errorMessage = data.detail || data.message || 'Profile update failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message)
      
      let errorMessage = 'Profile update failed'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })

      const data = response.data
      if (data.success) {
        return { success: true, message: data.message }
      } else {
        const errorMessage = data.detail || data.message || 'Password change failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Password change error:', error.response?.data || error.message)
      
      let errorMessage = 'Password change failed'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}