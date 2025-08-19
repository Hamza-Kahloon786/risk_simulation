// frontend/src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './Components/ProtectedRoute'
// Public Pages
import Home from './pages/Home'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'

// Protected Components
import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard'
import Scenarios from './Components/Scenarios'
import ScenarioCanvas from './Components/ScenarioCanvas/ScenarioCanvas'
import Locations from './Components/Locations'
import Events from './Components/Events'
import Defenses from './Components/Defenses'

// Component to redirect authenticated users away from auth pages
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Protected Layout Component
const ProtectedLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}

// Routes Component (needs to be inside AuthProvider to use useAuth)
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      
      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route path="/login" element={
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      } />
      <Route path="/register" element={
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      } />
      
      {/* Protected Routes with Dashboard Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/scenarios" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <Scenarios />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/scenarios/:id" element={
        <ProtectedRoute>
          <ScenarioCanvas />
        </ProtectedRoute>
      } />
      
      <Route path="/locations" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <Locations />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/events" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <Events />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/defenses" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <Defenses />
          </ProtectedLayout>
        </ProtectedRoute>
      } />

      {/* Catch all route - redirect based on authentication status */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App