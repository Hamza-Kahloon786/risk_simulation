import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Shield,
  Plus,
  BarChart3,
  Eye,
  RefreshCw,
  ChevronRight,
  Calendar,
  Clock,
  Sun,
  Moon,
  Zap,
  TrendingDown,
  DollarSign,
  Building
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Theme Toggle Button Component
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200 hover:scale-105
        ${isDarkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }
      `}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}

// Dashboard Component with Theme Integration
const Dashboard = () => {
  const [scenarios, setScenarios] = useState([])
  const { safeThemeClasses = {}, isDarkMode = true } = useTheme() || {}
  const [defenseStats, setDefenseStats] = useState({})
  const [events, setEvents] = useState([])
  const [defenses, setDefenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Default theme classes as fallback
  const defaultThemeClasses = {
    bg: {
      dashboard: 'bg-gray-50',
      card: 'bg-white',
      secondary: 'bg-gray-100'
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
      accent: 'text-blue-600'
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300'
    },
    hover: {
      bg: 'hover:bg-gray-100'
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'
    }
  }

  // Merge theme classes with defaults
  const safeThemeClasses = {
    bg: { ...defaultThemeClasses.bg, ...themeClasses.bg },
    text: { ...defaultThemeClasses.text, ...themeClasses.text },
    border: { ...defaultThemeClasses.border, ...themeClasses.border },
    hover: { ...defaultThemeClasses.hover, ...themeClasses.hover },
    button: { ...defaultThemeClasses.button, ...themeClasses.button }
  }
  
  const [stats, setStats] = useState({
    totalRiskScore: 0,
    activeScenarios: 0,
    criticalVulnerabilities: 0,
    defenseCoverage: 0
  })

  // Sample data
  const sampleScenarios = [
    {
      id: '1',
      name: 'Advanced Persistent Threat - Financial Systems',
      status: 'active',
      risk_score: 85,
      updated_at: '2024-08-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Supply Chain Ransomware Attack',
      status: 'active',
      risk_score: 72,
      updated_at: '2024-08-14T16:45:00Z'
    },
    {
      id: '3',
      name: 'Data Center Natural Disaster Recovery',
      status: 'draft',
      risk_score: 45,
      updated_at: '2024-08-13T09:15:00Z'
    },
    {
      id: '4',
      name: 'Third-Party Vendor Breach Simulation',
      status: 'completed',
      risk_score: 38,
      updated_at: '2024-08-12T14:20:00Z'
    },
    {
      id: '5',
      name: 'IoT Device Network Compromise',
      status: 'active',
      risk_score: 67,
      updated_at: '2024-08-11T11:30:00Z'
    }
  ]

  const sampleEvents = [
    { id: '1', category: 'cyber_security', severity: 'critical', risk_score: 90 },
    { id: '2', category: 'operational', severity: 'high', risk_score: 75 },
    { id: '3', category: 'financial', severity: 'medium', risk_score: 45 },
    { id: '4', category: 'regulatory', severity: 'low', risk_score: 25 }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Set sample data for demo
      setScenarios(sampleScenarios)
      setEvents(sampleEvents)
      
      // Calculate stats with sample data
      calculateStats(sampleScenarios, {}, sampleEvents, [])
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load some dashboard data')
      calculateStats([], {}, [], [])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (scenariosData, defenseStatsData, eventsData, defensesData) => {
    // Active scenarios count
    const activeCount = scenariosData.filter(s => s.status === 'active').length
    
    // Calculate average risk score from scenarios
    const avgRiskScore = scenariosData.length > 0 
      ? scenariosData.reduce((sum, s) => sum + (parseFloat(s.risk_score) || 0), 0) / scenariosData.length 
      : 0
    
    // Count critical vulnerabilities from events
    const criticalEvents = eventsData.filter(e => {
      const severity = (e.severity || '').toLowerCase()
      const riskScore = parseFloat(e.risk_score) || 0
      return severity === 'critical' || severity === 'high' || riskScore > 70
    }).length
    
    // Defense coverage from stats or calculate from defenses
    let defenseCoverage = 85.5 // Sample value
    
    setStats({
      totalRiskScore: Math.round(avgRiskScore * 10) / 10,
      activeScenarios: activeCount,
      criticalVulnerabilities: criticalEvents,
      defenseCoverage: Math.round(defenseCoverage * 10) / 10
    })
  }

  const getRelativeTimeString = (dateString) => {
    if (!dateString) return 'Just now'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)
      
      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
      
      return date.toLocaleDateString()
    } catch (error) {
      return 'Just now'
    }
  }

  // Calculate risk distribution from real events data
  const riskDistribution = React.useMemo(() => {
    if (events.length === 0) {
      return [
        { name: 'Cyber Threats', value: 34, color: 'bg-red-500' },
        { name: 'Operational', value: 28, color: 'bg-orange-500' },
        { name: 'Financial', value: 22, color: 'bg-yellow-500' },
        { name: 'Regulatory', value: 16, color: 'bg-blue-500' },
      ]
    }

    const categoryCount = events.reduce((acc, event) => {
      let category = (event.category || 'operational').toLowerCase()
      
      if (category.includes('cyber') || category.includes('security')) {
        category = 'cyber_security'
      } else if (category.includes('financial') || category.includes('finance')) {
        category = 'financial'
      } else if (category.includes('regulatory') || category.includes('compliance')) {
        category = 'regulatory'
      } else {
        category = 'operational'
      }
      
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    const total = events.length
    const categories = [
      { name: 'Cyber Threats', key: 'cyber_security', color: 'bg-red-500' },
      { name: 'Operational', key: 'operational', color: 'bg-orange-500' },
      { name: 'Financial', key: 'financial', color: 'bg-yellow-500' },
      { name: 'Regulatory', key: 'regulatory', color: 'bg-blue-500' },
    ]

    return categories.map(cat => ({
      name: cat.name,
      value: total > 0 ? Math.round(((categoryCount[cat.key] || 0) / total) * 100) : 0,
      color: cat.color
    }))
  }, [events])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskColor = (riskScore) => {
    if (riskScore >= 70) return 'text-red-400'
    if (riskScore >= 40) return 'text-yellow-400'
    return 'text-green-400'
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className={`min-h-screen ${safeThemeClasses.bg.dashboard} transition-colors duration-300`}>
      {/* Container with responsive padding */}
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 max-w-[2000px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start mb-2">
                <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${safeThemeClasses.text.primary} leading-tight`}>
                  Risk Simulation Dashboard
                </h1>
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
              </div>
              <p className={`text-sm sm:text-base ${safeThemeClasses.text.secondary} mt-1 sm:mt-2`}>
                Monitor your organization's risk posture and scenario outcomes
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <button 
                onClick={loadDashboardData}
                disabled={loading}
                className={`
                  flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 rounded-lg transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] text-sm sm:text-base
                  ${safeThemeClasses.button.secondary}
                `}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className={`
                flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 rounded-lg transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base
                ${safeThemeClasses.button.primary}
              `}>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Scenario</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          
          {/* Total Risk Score Card */}
          <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6 ${safeThemeClasses.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${safeThemeClasses.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Total Risk Score</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${safeThemeClasses.text.primary} mb-1`}>
                  {stats.totalRiskScore}%
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs sm:text-sm font-medium ${getRiskColor(stats.totalRiskScore)}`}>
                    {scenarios.length > 0 
                      ? (stats.totalRiskScore > 50 ? 'High Risk' : stats.totalRiskScore > 25 ? 'Medium Risk' : 'Low Risk')
                      : 'No Data'
                    }
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>

          {/* Active Scenarios Card */}
          <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6 ${safeThemeClasses.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${safeThemeClasses.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Active Scenarios</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${safeThemeClasses.text.primary} mb-1`}>
                  {stats.activeScenarios}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`${safeThemeClasses.text.accent} text-xs sm:text-sm`}>{scenarios.length} total</span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Activity className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          {/* Critical Events Card */}
          <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6 ${safeThemeClasses.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${safeThemeClasses.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Critical Events</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${safeThemeClasses.text.primary} mb-1`}>
                  {stats.criticalVulnerabilities}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-red-400 text-xs sm:text-sm">{events.length} total events</span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          {/* Defense Coverage Card */}
          <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6 ${safeThemeClasses.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${safeThemeClasses.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Defense Coverage</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${safeThemeClasses.text.primary} mb-1`}>
                  {stats.defenseCoverage}%
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 text-xs sm:text-sm truncate">
                    5 defense systems
                  </span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Recent Scenarios Section */}
          <div className="xl:col-span-2 order-1">
            <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-bold ${safeThemeClasses.text.primary}`}>Recent Scenarios</h2>
                <button className={`flex items-center space-x-1 ${safeThemeClasses.text.accent} hover:${safeThemeClasses.text.accent}/80 text-sm sm:text-base transition-colors touch-manipulation`}>
                  <span>View All ({scenarios.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {scenarios.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className={`w-16 h-16 ${safeThemeClasses.bg.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <BarChart3 className={`w-8 h-8 ${safeThemeClasses.text.muted}`} />
                    </div>
                    <p className={`${safeThemeClasses.text.muted} mb-3`}>No scenarios created yet</p>
                    <button className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors touch-manipulation ${safeThemeClasses.button.primary}`}>
                      <Plus className="w-4 h-4" />
                      <span>Create your first scenario</span>
                    </button>
                  </div>
                ) : (
                  scenarios.slice(0, 5).map((scenario) => (
                    <div 
                      key={scenario.id} 
                      className={`group p-3 sm:p-4 ${safeThemeClasses.bg.secondary} rounded-lg ${safeThemeClasses.hover.bg} transition-all duration-200 border border-transparent hover:${safeThemeClasses.border.secondary}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 ${getStatusColor(scenario.status)} rounded-full mt-2 flex-shrink-0`}></div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium ${safeThemeClasses.text.primary} text-sm sm:text-base mb-1 truncate`}>
                              {scenario.name}
                            </p>
                            <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm ${safeThemeClasses.text.muted}`}>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{getRelativeTimeString(scenario.updated_at)}</span>
                              </div>
                              <span className="hidden sm:inline">•</span>
                              <span className="capitalize">
                                {scenario.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0 ml-3">
                          <div className="text-right">
                            <span className={`text-xs sm:text-sm font-medium ${getRiskColor(scenario.risk_score || 0)}`}>
                              {scenario.risk_score ? `${Math.round(scenario.risk_score)}%` : '0%'}
                            </span>
                            <p className={`text-xs ${safeThemeClasses.text.muted}`}>Risk</p>
                          </div>
                          <button className={`p-2 ${safeThemeClasses.text.muted} ${safeThemeClasses.hover.text} ${safeThemeClasses.hover.bg} rounded-lg transition-all duration-200 touch-manipulation`}>
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Risk Distribution Section */}
          <div className="order-2">
            <div className={`${safeThemeClasses.bg.card} border ${safeThemeClasses.border.primary} rounded-lg p-4 sm:p-6`}>
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BarChart3 className={`w-5 h-5 ${safeThemeClasses.text.muted}`} />
                <h3 className={`text-lg font-semibold ${safeThemeClasses.text.primary}`}>Risk Distribution</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {riskDistribution.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className={`text-sm sm:text-base ${safeThemeClasses.text.secondary} font-medium`}>{item.name}</span>
                      <span className={`text-sm sm:text-base font-bold ${safeThemeClasses.text.primary}`}>{item.value}%</span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 sm:h-3 overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`text-center py-4 sm:py-6 mt-6 border-t ${safeThemeClasses.border.primary}`}>
                <p className={`${safeThemeClasses.text.muted} text-sm mb-2`}>Distribution based on current events</p>
                <button className={`inline-flex items-center space-x-1 ${safeThemeClasses.text.accent} hover:${safeThemeClasses.text.accent}/80 text-sm transition-colors touch-manipulation`}>
                  <span>View detailed analysis</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
