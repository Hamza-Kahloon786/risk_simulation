// frontend/src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

// Public Pages
import Home from './pages/Home'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'

// Protected Components
import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard'
import Scenarios from './Components/Scenarios'
import ScenarioCanvas from './Components/ScenarioCanvas'
import Locations from './Components/Locations'
import Events from './Components/Events'
import Defenses from './Components/Defenses'

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

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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
            <ProtectedLayout>
              <ScenarioCanvas />
            </ProtectedLayout>
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

        {/* Catch all route - redirect to home for unauthenticated users */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App