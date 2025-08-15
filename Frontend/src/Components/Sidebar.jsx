import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Database, 
  MapPin, 
  Zap, 
  Shield,
  LogOut,
  User,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scenarios', href: '/scenarios', icon: FileText },
  ]
  
  const dataNavigation = [
    { name: 'Locations', href: '/locations', icon: MapPin },
    { name: 'Events', href: '/events', icon: Zap },
    { name: 'Defenses', href: '/defenses', icon: Shield },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force navigation even if logout API fails
      navigate('/login')
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-700 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">RiskSim</h1>
          <p className="text-sm text-gray-400">Enterprise</p>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
                            (item.href === '/dashboard' && location.pathname === '/')
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          {/* Data Section */}
          <div className="pt-6">
            <div className="flex items-center space-x-2 px-3 mb-3">
              <Database className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">Data</span>
            </div>
            {dataNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* User Profile - Fixed at bottom */}
      <div className="border-t border-gray-700 p-4 flex-shrink-0">
        <div className="relative">
          {/* User Info with Dropdown */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {getUserInitials(user?.full_name)}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.company || 'Risk Analyst'}
              </p>
            </div>
            {showUserMenu ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg border border-gray-600 shadow-lg">
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 border-b border-gray-600">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Add profile/settings navigation here if needed
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    handleLogout()
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-red-300 hover:bg-red-600 hover:text-white rounded-md transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Info */}
        <div className="text-xs text-green-400 mb-4">Pro Plan</div>

        {/* Quick Logout Button (Alternative) */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar