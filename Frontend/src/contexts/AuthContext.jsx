// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

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
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const userData = data.data;
          setUser(userData)
          setToken(savedToken)
          
          // Update localStorage with fresh user data
          AuthStorage.setUser(userData);
          AuthStorage.setAuthStatus(true);
        } else {
          // Clear invalid session
          AuthStorage.clearAll();
          setToken(null)
          setUser(null)
        }
      } else {
        // Clear invalid session
        AuthStorage.clearAll();
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Only clear on network errors if token seems invalid
      if (error.name !== 'TypeError') {
        AuthStorage.clearAll();
        setToken(null)
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { access_token, user: userData } = data.data
        
        // Update localStorage
        AuthStorage.setToken(access_token);
        AuthStorage.setUser(userData);
        AuthStorage.setAuthStatus(true);
        
        // Update state
        setToken(access_token)
        setUser(userData)
        
        return { success: true, user: userData }
      } else {
        const errorMessage = data.detail || 'Login failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
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

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
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
        const errorMessage = data.detail || 'Registration failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
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

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const updatedUser = data.data;
        
        // Update localStorage and state
        AuthStorage.setUser(updatedUser);
        setUser(updatedUser)
        
        return { success: true, user: updatedUser }
      } else {
        const errorMessage = data.detail || 'Profile update failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
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

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, message: data.message }
      } else {
        const errorMessage = data.detail || 'Password change failed'
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.'
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