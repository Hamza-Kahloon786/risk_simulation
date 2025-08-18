// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Clock
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { scenariosAPI, eventsAPI, defensesAPI } from '../services/api'


const Dashboard = () => {
  const [scenarios, setScenarios] = useState([])
  const { themeClasses, isDarkMode } = useTheme() // Add this line
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
      
      // Load scenarios using existing API
      const scenariosResponse = await scenariosAPI.getAll()
      const scenariosData = scenariosResponse.data || []
      setScenarios(scenariosData)
      
      // Load additional data in parallel using the centralized API
      const [defenseStatsRes, eventsRes, defensesRes] = await Promise.allSettled([
        defensesAPI.getStats(),
        eventsAPI.getAll(),
        defensesAPI.getAll()
      ])
      
      // Process defense stats
      if (defenseStatsRes.status === 'fulfilled' && defenseStatsRes.value.success) {
        setDefenseStats(defenseStatsRes.value.data || {})
      }
      
      // Process events
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        setEvents(eventsRes.value.data || [])
      } else if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
        setEvents(eventsRes.value.data || [])
      }
      
      // Process defenses
      if (defensesRes.status === 'fulfilled' && defensesRes.value.success) {
        setDefenses(defensesRes.value.data || [])
      } else if (defensesRes.status === 'fulfilled' && defensesRes.value.data) {
        setDefenses(defensesRes.value.data || [])
      }
      
      // Calculate stats after data is loaded
      calculateStats(scenariosData, defenseStatsRes.value?.data || {}, eventsRes.value?.data || [], defensesRes.value?.data || [])
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load some dashboard data')
      calculateStats(scenarios, {}, [], [])
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
    let defenseCoverage = 0
    if (defenseStatsData.average_effectiveness !== undefined) {
      defenseCoverage = defenseStatsData.average_effectiveness
    } else if (defensesData.length > 0) {
      const totalEffectiveness = defensesData.reduce((sum, d) => sum + (parseFloat(d.effectiveness) || 0), 0)
      defenseCoverage = totalEffectiveness / defensesData.length
    }
    
    setStats({
      totalRiskScore: Math.round(avgRiskScore * 10) / 10,
      activeScenarios: activeCount,
      criticalVulnerabilities: criticalEvents,
      defenseCoverage: Math.round(defenseCoverage * 10) / 10
    })
  }

  // Helper function to format relative date
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
    <div className={`min-h-screen ${themeClasses.bg.dashboard}`}>
      {/* Container with responsive padding */}
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 max-w-[2000px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col  space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl dark:text-white sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                Risk Simulation Dashboard
              </h1>
              <p className="text-sm sm:text-base dark:text-white text-gray-600 mt-1 sm:mt-2">
                Monitor your organization's risk posture and scenario outcomes
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <Link 
                to="/scenarios" 
                className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Scenario</span>
              </Link>
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Total Risk Score</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Scenarios Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Active Scenarios</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.activeScenarios}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-400 text-xs sm:text-sm">{scenarios.length} total</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Critical Events Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Critical Events</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.criticalVulnerabilities}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-red-400 text-xs sm:text-sm">{events.length} total events</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Defense Coverage Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Defense Coverage</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.defenseCoverage}%
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 text-xs sm:text-sm truncate">
                    {defenseStats.total_cost 
                      ? `$${formatNumber(defenseStats.total_cost)} invested`
                      : `${defenses.length} systems`
                    }
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Recent Scenarios Section */}
          <div className="xl:col-span-2 order-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Recent Scenarios</h2>
                <Link 
                  to="/scenarios" 
                  className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm sm:text-base transition-colors touch-manipulation"
                >
                  <span>View All ({scenarios.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {scenarios.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-3">No scenarios created yet</p>
                    <Link 
                      to="/scenarios" 
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create your first scenario</span>
                    </Link>
                  </div>
                ) : (
                  scenarios.slice(0, 5).map((scenario) => (
                    <div 
                      key={scenario.id || scenario._id} 
                      className="group p-3 sm:p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-all duration-200 border border-transparent hover:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className={`w-2 h-2 ${getStatusColor(scenario.status)} rounded-full mt-2 flex-shrink-0`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-white text-sm sm:text-base mb-1 truncate">
                              {scenario.name}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{getRelativeTimeString(scenario.updated_at)}</span>
                              </div>
                              <span className="hidden sm:inline">•</span>
                              <span className="capitalize">
                                {(scenario.status || 'Draft')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0 ml-3">
                          <div className="text-right">
                            <span className={`text-xs sm:text-sm font-medium ${getRiskColor(scenario.risk_score || 0)}`}>
                              {scenario.risk_score ? `${Math.round(scenario.risk_score)}%` : '0%'}
                            </span>
                            <p className="text-xs text-gray-500">Risk</p>
                          </div>
                          <Link 
                            to={`/scenarios/${scenario.id || scenario._id}`} 
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200 touch-manipulation"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
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
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Risk Distribution</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {riskDistribution.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-sm sm:text-base text-gray-300 font-medium">{item.name}</span>
                      <span className="text-sm sm:text-base font-bold text-white">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {events.length === 0 && (
                <div className="text-center py-4 sm:py-6 mt-6 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Using sample data</p>
                  <Link 
                    to="/events" 
                    className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors touch-manipulation"
                  >
                    <span>Add events for real distribution</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard