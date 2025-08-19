import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { scenariosAPI, eventsAPI, defensesAPI, dashboardAPI } from '../services/api'

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

// Dashboard Component with Real API Integration
const Dashboard = () => {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState([])
  const { themeClasses, isDarkMode } = useTheme()
  const [defenseStats, setDefenseStats] = useState({})
  const [events, setEvents] = useState([])
  const [defenses, setDefenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [stats, setStats] = useState({
    totalRiskScore: 0,
    activeScenarios: 0,
    criticalVulnerabilities: 0,
    defenseCoverage: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading fresh dashboard data...')
      
      // Clear existing data first to avoid showing stale data
      setScenarios([])
      setEvents([])
      setDefenses([])
      setDefenseStats({})
      setStats({
        totalRiskScore: 0,
        activeScenarios: 0,
        criticalVulnerabilities: 0,
        defenseCoverage: 0
      })
      
      // Load all data in parallel
      const [
        scenariosResponse,
        eventsResponse,
        defensesResponse,
        defenseStatsResponse,
        dashboardOverviewResponse
      ] = await Promise.allSettled([
        scenariosAPI.getAll(),
        eventsAPI.getAll(),
        defensesAPI.getAll(),
        defensesAPI.getStats(),
        dashboardAPI.getOverview()
      ])

      // Handle scenarios data
      let scenariosData = []
      if (scenariosResponse.status === 'fulfilled') {
        const rawData = scenariosResponse.value
        scenariosData = Array.isArray(rawData) 
          ? rawData 
          : rawData?.data || rawData?.scenarios || []
        setScenarios(scenariosData)
        console.log('Loaded scenarios:', scenariosData.length)
      } else {
        console.warn('Failed to load scenarios:', scenariosResponse.reason?.message)
        setScenarios([])
      }

      // Handle events data
      let eventsData = []
      if (eventsResponse.status === 'fulfilled') {
        const rawData = eventsResponse.value
        eventsData = Array.isArray(rawData) 
          ? rawData 
          : rawData?.data || rawData?.events || []
        setEvents(eventsData)
        console.log('Loaded events:', eventsData.length)
      } else {
        console.warn('Failed to load events:', eventsResponse.reason?.message)
        setEvents([])
      }

      // Handle defenses data
      let defensesData = []
      if (defensesResponse.status === 'fulfilled') {
        const rawData = defensesResponse.value
        defensesData = Array.isArray(rawData) 
          ? rawData 
          : rawData?.data || rawData?.defenses || []
        setDefenses(defensesData)
        console.log('Loaded defenses:', defensesData.length)
      } else {
        console.warn('Failed to load defenses:', defensesResponse.reason?.message)
        setDefenses([])
      }

      // Handle defense stats
      let defenseStatsData = {}
      if (defenseStatsResponse.status === 'fulfilled') {
        defenseStatsData = defenseStatsResponse.value || {}
        setDefenseStats(defenseStatsData)
      } else {
        console.warn('Failed to load defense stats:', defenseStatsResponse.reason?.message)
        setDefenseStats({})
      }

      // Use dashboard overview if available, otherwise calculate from individual data
      if (dashboardOverviewResponse.status === 'fulfilled' && dashboardOverviewResponse.value) {
        const overview = dashboardOverviewResponse.value
        console.log('Using dashboard overview data:', overview)
        setStats({
          totalRiskScore: overview.total_risk_score || 0,
          activeScenarios: overview.active_scenarios || 0,
          criticalVulnerabilities: overview.critical_vulnerabilities || 0,
          defenseCoverage: overview.defense_coverage || 0
        })
      } else {
        console.log('Calculating stats from individual data sources')
        calculateStats(scenariosData, defenseStatsData, eventsData, defensesData)
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
      // Reset all data to empty state on error
      setScenarios([])
      setEvents([])
      setDefenses([])
      setDefenseStats({})
      setStats({
        totalRiskScore: 0,
        activeScenarios: 0,
        criticalVulnerabilities: 0,
        defenseCoverage: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (scenariosData, defenseStatsData, eventsData, defensesData) => {
    try {
      console.log('Calculating stats with data:', {
        scenarios: scenariosData.length,
        events: eventsData.length,
        defenses: defensesData.length,
        sampleScenario: scenariosData[0]
      })

      // Active scenarios count
      const activeCount = scenariosData.filter(s => 
        (s.status || '').toLowerCase() === 'active'
      ).length
      
      // Calculate average risk score from ALL scenarios (not just active ones)
      let avgRiskScore = 0
      if (scenariosData.length > 0) {
        const validScenarios = scenariosData.filter(s => {
          const riskScore = parseFloat(s.risk_score || s.riskScore || 0)
          return !isNaN(riskScore) && riskScore > 0
        })
        
        if (validScenarios.length > 0) {
          const totalRisk = validScenarios.reduce((sum, s) => {
            const riskScore = parseFloat(s.risk_score || s.riskScore || 0)
            console.log(`Scenario "${s.name}" risk score:`, riskScore)
            return sum + riskScore
          }, 0)
          avgRiskScore = totalRisk / validScenarios.length
        }
      }
      
      // Count critical vulnerabilities from events
      const criticalEvents = eventsData.filter(e => {
        const severity = (e.severity || '').toLowerCase()
        const riskScore = parseFloat(e.risk_score || e.riskScore || 0)
        return severity === 'critical' || severity === 'high' || riskScore > 70
      }).length
      
      // Defense coverage calculation - more realistic approach
      let defenseCoverage = 0
      if (defenseStatsData.coverage_percentage !== undefined) {
        defenseCoverage = defenseStatsData.coverage_percentage
      } else if (defenseStatsData.defense_coverage !== undefined) {
        defenseCoverage = defenseStatsData.defense_coverage
      } else {
        // Calculate based on scenarios and defenses
        if (defensesData.length > 0) {
          // Each defense system provides coverage
          defenseCoverage = Math.min(defensesData.length * 25, 95) // Each defense = 25% coverage, max 95%
        } else if (scenariosData.length > 0) {
          // Base coverage calculation - assume some baseline security
          const completedScenarios = scenariosData.filter(s => 
            (s.status || '').toLowerCase() === 'completed'
          ).length
          const totalScenarios = scenariosData.length
          
          // Base coverage of 30% + additional coverage based on completed scenarios
          defenseCoverage = 30 + (completedScenarios / totalScenarios) * 40
        } else {
          defenseCoverage = 25 // Minimum baseline coverage
        }
      }

      const calculatedStats = {
        totalRiskScore: Math.round(avgRiskScore * 10) / 10,
        activeScenarios: activeCount,
        criticalVulnerabilities: criticalEvents,
        defenseCoverage: Math.round(defenseCoverage * 10) / 10
      }

      console.log('Final calculated stats:', calculatedStats)

      setStats(calculatedStats)
      
    } catch (error) {
      console.error('Error calculating stats:', error)
      setStats({
        totalRiskScore: 0,
        activeScenarios: 0,
        criticalVulnerabilities: 0,
        defenseCoverage: 0
      })
    }
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
    console.log('Calculating risk distribution with events:', events.length)
    
    if (events.length === 0) {
      console.log('No events found, showing no data state')
      return [
        { name: 'No Data Available', value: 100, color: 'bg-gray-500' }
      ]
    }

    const categoryCount = events.reduce((acc, event) => {
      let category = (event.category || event.type || 'operational').toLowerCase()
      
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

    const result = categories
      .map(cat => ({
        name: cat.name,
        value: total > 0 ? Math.round(((categoryCount[cat.key] || 0) / total) * 100) : 0,
        color: cat.color
      }))
      .filter(item => item.value > 0) // Only show categories with data

    console.log('Risk distribution result:', result)
    return result.length > 0 ? result : [{ name: 'No Data Available', value: 100, color: 'bg-gray-500' }]
  }, [events])

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase()
    switch (statusLower) {
      case 'active': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getRiskColor = (riskScore) => {
    const score = parseFloat(riskScore || 0)
    if (score >= 70) return 'text-red-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-green-400'
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Default theme classes if themeClasses is undefined
  const tc = themeClasses || {
    bg: { dashboard: 'bg-gray-50', card: 'bg-white', secondary: 'bg-gray-100' },
    text: { primary: 'text-gray-900', secondary: 'text-gray-700', muted: 'text-gray-500', accent: 'text-blue-600' },
    border: { primary: 'border-gray-200', secondary: 'border-gray-300' },
    hover: { bg: 'hover:bg-gray-100' },
    button: { primary: 'bg-blue-600 hover:bg-blue-700 text-white', secondary: 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300' }
  }

  return (
    <div className={`min-h-screen ${tc.bg.dashboard} transition-colors duration-300`}>
      {/* Container with responsive padding */}
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 max-w-[2000px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start mb-2">
                <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${tc.text.primary} leading-tight`}>
                  Risk Simulation Dashboard
                </h1>
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
              </div>
              <p className={`text-sm sm:text-base ${tc.text.secondary} mt-1 sm:mt-2`}>
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
                  ${tc.button.secondary}
                `}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button 
                className={`
                  flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 rounded-lg transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base
                  ${tc.button.primary}
                `}
                onClick={() => navigate('/scenarios/new')}
              >
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

        {/* Loading State */}
        {loading && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
              <p className="text-blue-300 text-sm sm:text-base">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          
          {/* Total Risk Score Card */}
          <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6 ${tc.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${tc.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Total Risk Score</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${tc.text.primary} mb-1`}>
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
          <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6 ${tc.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${tc.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Active Scenarios</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${tc.text.primary} mb-1`}>
                  {stats.activeScenarios}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`${tc.text.accent} text-xs sm:text-sm`}>{scenarios.length} total</span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Activity className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          {/* Critical Events Card */}
          <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6 ${tc.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${tc.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Critical Events</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${tc.text.primary} mb-1`}>
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
          <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6 ${tc.hover.bg} transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className={`${tc.text.muted} text-xs sm:text-sm mb-1 sm:mb-2`}>Defense Coverage</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${tc.text.primary} mb-1`}>
                  {stats.defenseCoverage}%
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 text-xs sm:text-sm truncate">
                    {defenses.length} defense systems
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
            <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-bold ${tc.text.primary}`}>Recent Scenarios</h2>
                <button 
                  className={`flex items-center space-x-1 ${tc.text.accent} hover:${tc.text.accent}/80 text-sm sm:text-base transition-colors touch-manipulation`}
                  onClick={() => navigate('/scenarios')}
                >
                  <span>View All ({scenarios.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {scenarios.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className={`w-16 h-16 ${tc.bg.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <BarChart3 className={`w-8 h-8 ${tc.text.muted}`} />
                    </div>
                    <p className={`${tc.text.muted} mb-3`}>
                      {loading ? 'Loading scenarios...' : 'No scenarios found'}
                    </p>
                    {!loading && (
                      <button className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors touch-manipulation ${tc.button.primary}`}>
                        <Plus className="w-4 h-4" />
                        <span>Create your first scenario</span>
                      </button>
                    )}
                  </div>
                ) : (
                  scenarios.slice(0, 5).map((scenario) => (
                    <div 
                      key={scenario.id} 
                      className={`group p-3 sm:p-4 ${tc.bg.secondary} rounded-lg ${tc.hover.bg} transition-all duration-200 border border-transparent hover:${tc.border.secondary}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 ${getStatusColor(scenario.status)} rounded-full mt-2 flex-shrink-0`}></div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-medium ${tc.text.primary} text-sm sm:text-base mb-1 truncate`}>
                              {scenario.name || scenario.title || 'Unnamed Scenario'}
                            </p>
                            <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm ${tc.text.muted}`}>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{getRelativeTimeString(scenario.updated_at || scenario.updatedAt || scenario.created_at || scenario.createdAt)}</span>
                              </div>
                              <span className="hidden sm:inline">•</span>
                              <span className="capitalize">
                                {scenario.status || 'draft'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0 ml-3">
                          <div className="text-right">
                            <span className={`text-xs sm:text-sm font-medium ${getRiskColor(scenario.risk_score || scenario.riskScore || 0)}`}>
                              {scenario.risk_score || scenario.riskScore ? `${Math.round(scenario.risk_score || scenario.riskScore)}%` : '0%'}
                            </span>
                            <p className={`text-xs ${tc.text.muted}`}>Risk</p>
                          </div>
                          <button className={`p-2 ${tc.text.muted} ${tc.hover.text} ${tc.hover.bg} rounded-lg transition-all duration-200 touch-manipulation`}>
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
            <div className={`${tc.bg.card} border ${tc.border.primary} rounded-lg p-4 sm:p-6`}>
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BarChart3 className={`w-5 h-5 ${tc.text.muted}`} />
                <h3 className={`text-lg font-semibold ${tc.text.primary}`}>Risk Distribution</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {riskDistribution.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className={`text-sm sm:text-base ${tc.text.secondary} font-medium`}>{item.name}</span>
                      <span className={`text-sm sm:text-base font-bold ${tc.text.primary}`}>{item.value}%</span>
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

              <div className={`text-center py-4 sm:py-6 mt-6 border-t ${tc.border.primary}`}>
                <p className={`${tc.text.muted} text-sm mb-2`}>
                  {events.length > 0 
                    ? `Distribution based on ${events.length} events` 
                    : 'No event data available'
                  }
                </p>
                {events.length > 0 ? (
                  <button className={`inline-flex items-center space-x-1 ${tc.text.accent} hover:${tc.text.accent}/80 text-sm transition-colors touch-manipulation`}>
                    <span>View detailed analysis</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <p className={`${tc.text.muted} text-xs`}>
                    Create scenarios and events to see risk distribution
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard