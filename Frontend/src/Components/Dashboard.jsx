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
  RefreshCw
} from 'lucide-react'
import { scenariosAPI, eventsAPI, defensesAPI } from '../services/api'

const Dashboard = () => {
  const [scenarios, setScenarios] = useState([])
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
        // Handle case where API doesn't return success flag
        setEvents(eventsRes.value.data || [])
      }
      
      // Process defenses
      if (defensesRes.status === 'fulfilled' && defensesRes.value.success) {
        setDefenses(defensesRes.value.data || [])
      } else if (defensesRes.status === 'fulfilled' && defensesRes.value.data) {
        // Handle case where API doesn't return success flag
        setDefenses(defensesRes.value.data || [])
      }
      
      // Calculate stats after data is loaded
      calculateStats(scenariosData, defenseStatsRes.value?.data || {}, eventsRes.value?.data || [], defensesRes.value?.data || [])
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load some dashboard data')
      // Still calculate stats with available data
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
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
      
      return date.toLocaleDateString()
    } catch (error) {
      return 'Just now'
    }
  }

  // Calculate risk distribution from real events data
  const riskDistribution = React.useMemo(() => {
    if (events.length === 0) {
      // Return default static data if no events
      return [
        { name: 'Cyber Threats', value: 34, color: 'bg-red-500' },
        { name: 'Operational', value: 28, color: 'bg-orange-500' },
        { name: 'Financial', value: 22, color: 'bg-yellow-500' },
        { name: 'Regulatory', value: 16, color: 'bg-blue-500' },
      ]
    }

    const categoryCount = events.reduce((acc, event) => {
      let category = (event.category || 'operational').toLowerCase()
      
      // Map variations to standard categories
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Risk Simulation Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your organization's risk posture and scenario outcomes</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={loadDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link to="/scenarios" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Scenario</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-300">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Risk Score</p>
              <p className="text-2xl font-bold text-white">{stats.totalRiskScore}%</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className={`text-sm ${getRiskColor(stats.totalRiskScore)}`}>
                  {scenarios.length > 0 
                    ? (stats.totalRiskScore > 50 ? 'High Risk' : stats.totalRiskScore > 25 ? 'Medium Risk' : 'Low Risk')
                    : 'No Data'
                  }
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Scenarios</p>
              <p className="text-2xl font-bold text-white">{stats.activeScenarios}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-blue-400 text-sm">{scenarios.length} total</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical Events</p>
              <p className="text-2xl font-bold text-white">{stats.criticalVulnerabilities}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-red-400 text-sm">{events.length} total events</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Defense Coverage</p>
              <p className="text-2xl font-bold text-white">{stats.defenseCoverage}%</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-green-400 text-sm">
                  {defenseStats.total_cost 
                    ? `$${((defenseStats.total_cost || 0) / 1000000).toFixed(1)}M invested`
                    : `${defenses.length} systems`
                  }
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Scenarios */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Scenarios</h2>
              <Link to="/scenarios" className="text-blue-400 hover:text-blue-300 text-sm">
                View All ({scenarios.length})
              </Link>
            </div>
            
            <div className="space-y-4">
              {scenarios.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No scenarios created yet</p>
                  <Link to="/scenarios" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                    Create your first scenario
                  </Link>
                </div>
              ) : (
                scenarios.slice(0, 5).map((scenario) => (
                  <div key={scenario.id || scenario._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${getStatusColor(scenario.status)} rounded-full`}></div>
                      <div>
                        <p className="font-medium text-white">{scenario.name}</p>
                        <p className="text-sm text-gray-400">
                          {getRelativeTimeString(scenario.updated_at)} • {(scenario.status || 'Draft').charAt(0).toUpperCase() + (scenario.status || 'draft').slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${getRiskColor(scenario.risk_score || 0)}`}>
                        {scenario.risk_score ? `${Math.round(scenario.risk_score)}%` : '0%'} Risk
                      </span>
                      <Link to={`/scenarios/${scenario.id || scenario._id}`} className="text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Risk Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {riskDistribution.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`} 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-sm">
              <p>Using sample data</p>
              <Link to="/events" className="text-blue-400 hover:text-blue-300">
                Add events for real distribution
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard