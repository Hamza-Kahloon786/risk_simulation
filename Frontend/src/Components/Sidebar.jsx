// frontend/src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'
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
  ChevronUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scenarios', href: '/scenarios', icon: FileText },
  ]
  
  const dataNavigation = [
    { name: 'Locations', href: '/locations', icon: MapPin },
    { name: 'Events', href: '/events', icon: Zap },
    { name: 'Defenses', href: '/defenses', icon: Shield },
  ]

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false) // Don't collapse on mobile
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [location.pathname, isMobile])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Mobile overlay
  const MobileOverlay = () => (
    isMobile && isMobileMenuOpen && (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={closeMobileMenu}
      />
    )
  )

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className={`
        flex items-center p-4 sm:p-6 border-b border-gray-700 flex-shrink-0
        ${isCollapsed && !isMobile ? 'justify-center px-2' : 'space-x-3'}
      `}>
        {isMobile && (
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        
        {(!isCollapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">RiskSim</h1>
            <p className="text-xs sm:text-sm text-gray-400">Enterprise</p>
          </div>
        )}

        {/* Desktop Collapse Button */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href || 
                            (item.href === '/dashboard' && location.pathname === '/')
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`
                  flex items-center rounded-lg transition-all duration-200 touch-manipulation
                  ${isCollapsed && !isMobile 
                    ? 'justify-center p-2 mx-1' 
                    : 'space-x-3 px-3 py-2 sm:py-2.5'
                  }
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
                title={isCollapsed && !isMobile ? item.name : ''}
              >
                <Icon className={`flex-shrink-0 ${
                  isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4 sm:w-5 sm:h-5'
                }`} />
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium text-sm sm:text-base min-w-0 truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
          
          {/* Data Section */}
          <div className="pt-4 sm:pt-6">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-2 px-3 mb-2 sm:mb-3">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-400">Data</span>
              </div>
            )}
            
            {(isCollapsed && !isMobile) && (
              <div className="flex justify-center mb-2">
                <div className="w-6 h-px bg-gray-600"></div>
              </div>
            )}
            
            {dataNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center rounded-lg transition-all duration-200 touch-manipulation
                    ${isCollapsed && !isMobile 
                      ? 'justify-center p-2 mx-1' 
                      : 'space-x-3 px-4 sm:px-6 py-2'
                    }
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  title={isCollapsed && !isMobile ? item.name : ''}
                >
                  <Icon className={`flex-shrink-0 ${
                    isCollapsed && !isMobile ? 'w-4 h-4' : 'w-3 h-3 sm:w-4 sm:h-4'
                  }`} />
                  {(!isCollapsed || isMobile) && (
                    <span className="text-xs sm:text-sm min-w-0 truncate">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* User Profile - Fixed at bottom */}
      <div className="border-t border-gray-700 p-3 sm:p-4 flex-shrink-0">
        <div className="relative">
          {/* User Info with Dropdown */}
          {(!isCollapsed || isMobile) && (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 mb-3 sm:mb-4 p-2 rounded-lg hover:bg-gray-700 transition-colors touch-manipulation"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">
                  {getUserInitials(user?.full_name)}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.company || 'Risk Analyst'}
                </p>
              </div>
              {showUserMenu ? (
                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
          )}

          {/* Collapsed User Avatar */}
          {(isCollapsed && !isMobile) && (
            <div className="flex justify-center mb-4">
              <div 
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                title={user?.full_name || 'User'}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="text-xs font-medium text-white">
                  {getUserInitials(user?.full_name)}
                </span>
              </div>
            </div>
          )}

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className={`
              absolute bg-gray-700 rounded-lg border border-gray-600 shadow-xl z-50
              ${isCollapsed && !isMobile 
                ? 'bottom-full right-0 mb-2 w-48' 
                : 'bottom-full left-0 right-0 mb-2'
              }
            `}>
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 border-b border-gray-600">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-xs sm:text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-left touch-manipulation"
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    handleLogout()
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-red-300 hover:bg-red-600 hover:text-white rounded-md transition-colors text-left touch-manipulation"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Info */}
        {(!isCollapsed || isMobile) && (
          <div className="text-xs text-green-400 mb-3 sm:mb-4 px-2">Pro Plan</div>
        )}

        {/* Quick Logout Button */}
        <button 
          onClick={handleLogout}
          className={`
            flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-lg transition-colors touch-manipulation
            ${isCollapsed && !isMobile 
              ? 'w-10 h-10 mx-auto' 
              : 'w-full space-x-2 px-3 sm:px-4 py-2 sm:py-2.5'
            }
          `}
          title={isCollapsed && !isMobile ? 'Logout' : ''}
        >
          <LogOut className={`${isCollapsed && !isMobile ? 'w-4 h-4' : 'w-3 h-3 sm:w-4 sm:h-4'} flex-shrink-0`} />
          {(!isCollapsed || isMobile) && (
            <span className="text-xs sm:text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      <MobileOverlay />
      
      {/* Mobile Menu Button - Only show on mobile when sidebar is closed and not overlapping content */}
      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 touch-manipulation shadow-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 sm:w-72
      `}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex bg-gray-800 border-r border-gray-700 flex-col h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16 xl:w-20' : 'w-64 xl:w-72 2xl:w-80'}
      `}>
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar