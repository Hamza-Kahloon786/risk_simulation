// frontend/src/components/Scenarios.jsx - FIXED WITH WORKING EDIT/DELETE
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  BarChart3, 
  Search, 
  RefreshCw, 
  ChevronDown,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  Eye,
  MoreVertical
} from 'lucide-react'
import { scenariosAPI } from '../services/api'
import CreateScenarioModal from './Modals/CreateScenarioModal'
// import EditScenarioModal from './Modals/EditScenarioModal'
import { useTheme } from '../contexts/ThemeContext'

const Scenarios = () => {
  const navigate = useNavigate()
  const { themeClasses, isDarkMode } = useTheme()
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingScenario, setEditingScenario] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    loadScenarios()
  }, [])

  const loadScenarios = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Loading scenarios from API...')
      const response = await scenariosAPI.getAll()
      console.log('API Response:', response)
      
      let scenariosData = []
      
      // Handle different response formats from API
      if (response?.success && Array.isArray(response.data)) {
        scenariosData = response.data
      } else if (response?.data && Array.isArray(response.data)) {
        scenariosData = response.data
      } else if (Array.isArray(response)) {
        scenariosData = response
      } else if (response?.scenarios && Array.isArray(response.scenarios)) {
        scenariosData = response.scenarios
      } else {
        console.warn('Unexpected API response format:', response)
        scenariosData = []
      }
      
      console.log('Processed scenarios data:', scenariosData)
      setScenarios(scenariosData)
      
    } catch (error) {
      console.error('Error loading scenarios:', error)
      setError(`Failed to load scenarios: ${error.message}`)
      setScenarios([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenScenario = (scenario) => {
    console.log('Opening scenario:', scenario)
    
    // Extract ID from scenario object - handle different field names
    const scenarioId = scenario.id || scenario._id || scenario.scenario_id
    
    if (!scenarioId) {
      console.error('No ID found in scenario:', scenario)
      setError('Invalid scenario: missing ID')
      return
    }
    
    console.log('Navigating to scenario ID:', scenarioId)
    navigate(`/scenarios/${scenarioId}`)
  }

  const handleEditScenario = (scenario, e) => {
    if (e) e.stopPropagation()
    
    const scenarioId = scenario.id || scenario._id || scenario.scenario_id
    if (!scenarioId) {
      console.error('No ID found in scenario:', scenario)
      setError('Invalid scenario: missing ID')
      return
    }
    
    console.log('Editing scenario:', scenario)
    setEditingScenario(scenario)
    setShowEditModal(true)
  }

  const handleDeleteScenario = async (scenario, e) => {
    if (e) e.stopPropagation()
    
    const scenarioId = scenario.id || scenario._id || scenario.scenario_id
    const scenarioName = scenario.name || scenario.title || 'this scenario'
    
    if (!scenarioId) {
      setError('Cannot delete scenario: missing ID')
      return
    }

    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete "${scenarioName}"?\n\nThis action cannot be undone and will permanently remove:\n• The scenario and all its data\n• Associated risk events\n• Business assets\n• Defense systems\n• Analysis results`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setDeleteLoading(scenarioId)
      setError('')
      
      console.log('Deleting scenario:', scenarioId)
      
      // Call the API to delete the scenario
      await scenariosAPI.delete(scenarioId)
      
      console.log('Scenario deleted successfully from database')
      
      // Remove the scenario from local state immediately for better UX
      setScenarios(prevScenarios => 
        prevScenarios.filter(s => 
          (s.id || s._id || s.scenario_id) !== scenarioId
        )
      )
      
      // Show success message briefly
      setError(`Successfully deleted "${scenarioName}"`)
      setTimeout(() => setError(''), 3000) // Clear success message after 3 seconds
      
    } catch (error) {
      console.error('Error deleting scenario:', error)
      setError(`Failed to delete "${scenarioName}": ${error.message}`)
      
      // If delete failed, reload scenarios to ensure consistency
      loadScenarios()
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleCreateScenario = async (newScenario) => {
    console.log('New scenario created:', newScenario)
    setShowCreateModal(false)
    // Reload scenarios to get the latest data
    await loadScenarios()
  }

  const handleUpdateScenario = async (updatedScenario) => {
    console.log('Scenario updated:', updatedScenario)
    setShowEditModal(false)
    setEditingScenario(null)
    // Reload scenarios to get the latest data
    await loadScenarios()
  }

  const handleRunAnalysis = async (scenario, e) => {
    if (e) e.stopPropagation()
    
    const scenarioId = scenario.id || scenario._id || scenario.scenario_id
    if (!scenarioId) {
      setError('Cannot run analysis: missing scenario ID')
      return
    }

    try {
      console.log('Running analysis for scenario:', scenarioId)
      
      // Call the run analysis API
      const result = await scenariosAPI.runAnalysis(scenarioId)
      console.log('Analysis started:', result)
      
      // Show success message
      setError(`Analysis started for "${scenario.name || 'scenario'}". Results will be available shortly.`)
      setTimeout(() => setError(''), 5000)
      
      // Reload scenarios to get updated status
      await loadScenarios()
      
    } catch (error) {
      console.error('Error running analysis:', error)
      setError(`Failed to start analysis: ${error.message}`)
    }
  }

  // Calculate real-time stats from actual data
  const calculateStats = () => {
    const total = scenarios.length
    
    // Count scenarios by actual status values
    const ready = scenarios.filter(s => {
      const status = (s.status || '').toLowerCase()
      return status === 'ready' || status === 'completed'
    }).length
    
    // Count high-risk scenarios using actual risk_score or calculated values
    const highRisk = scenarios.filter(s => {
      const riskScore = s.risk_score || s.riskScore || 0
      const p90Impact = s.p90_impact || s.p90Impact || 0
      return riskScore >= 80 || p90Impact >= 500000 // P90 > $500K
    }).length
    
    // Calculate average risk score from actual data
    const avgRisk = total > 0 
      ? Math.round(scenarios.reduce((sum, s) => {
          const riskScore = s.risk_score || s.riskScore || 0
          return sum + riskScore
        }, 0) / total)
      : 0
    
    return { total, ready, highRisk, avgRisk }
  }

  const stats = calculateStats()

  // Filter scenarios based on search and status with real data
  const filteredScenarios = scenarios.filter(scenario => {
    const name = scenario.name || scenario.title || ''
    const description = scenario.description || scenario.desc || ''
    const status = scenario.status || 'draft'
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All Status' || 
                         status.toLowerCase() === statusFilter.toLowerCase() ||
                         (statusFilter === 'Draft' && !status)
    
    return matchesSearch && matchesStatus
  })

  // Helper function to format time ago with real dates
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '2h ago' // fallback for missing dates
    
    try {
      const now = new Date()
      const date = new Date(dateString)
      const diffMs = now - date
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      
      if (diffHours < 1) return 'Just now'
      if (diffHours < 24) return `${diffHours}h ago`
      
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays < 7) return `${diffDays}d ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
      
      return date.toLocaleDateString()
    } catch (error) {
      console.warn('Invalid date format:', dateString)
      return '2h ago'
    }
  }

  // Helper function to format P50 impact with real data
  const formatP50Impact = (scenario) => {
    const p50 = scenario.p50_impact || scenario.p50Impact || scenario.median_impact || 0
    
    if (p50 >= 1000000) {
      return `$${(p50 / 1000000).toFixed(1)}M`
    } else if (p50 >= 1000) {
      return `$${Math.round(p50 / 1000)}K`
    } else if (p50 > 0) {
      return `$${Math.round(p50)}`
    }
    
    return '$0'
  }

  // Helper function to get scenario status with real data
  const getScenarioStatus = (scenario) => {
    const status = scenario.status || 'draft'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  // Helper function to get risk events count with real data
  const getRiskEventsCount = (scenario) => {
    return scenario.risk_events_count || 
           scenario.riskEventsCount || 
           scenario.components?.risk_events?.length || 
           scenario.risk_events?.length || 
           1
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeClasses.bg.dashboard}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={themeClasses.text.muted}>Loading scenarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen ${themeClasses.bg.dashboard}`}>
      {/* Header Section */}
      <div className="mb-8">
        {/* Title and Button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              <h1 className="text-2xl font-bold">Risk Scenarios</h1>
              <p className="text-blue-100 text-sm">Create, manage, and execute risk simulation scenarios</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Scenario</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.text.muted}`} />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-12 pr-4 py-3 rounded-lg border transition-colors
                ${themeClasses.bg.card}
                ${isDarkMode 
                  ? 'border-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900 placeholder-gray-500'
                }
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
              `}
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`
                  appearance-none pl-4 pr-10 py-3 rounded-lg border transition-colors cursor-pointer
                  ${themeClasses.bg.card}
                  ${isDarkMode 
                    ? 'border-gray-700 text-white' 
                    : 'border-gray-300 text-gray-900'
                  }
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                `}
              >
                <option>All Status</option>
                <option>Draft</option>
                <option>Ready</option>
                <option>Running</option>
                <option>Completed</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.text.muted} pointer-events-none`} />
            </div>
            <button
              onClick={loadScenarios}
              disabled={loading}
              className={`
                px-4 py-3 rounded-lg border transition-colors flex items-center space-x-2 disabled:opacity-50
                ${themeClasses.bg.card}
                ${isDarkMode 
                  ? 'border-gray-700 text-white hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Using Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`
            rounded-lg p-4 border
            ${themeClasses.bg.card}
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.muted}`}>Total Scenarios</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`
            rounded-lg p-4 border
            ${themeClasses.bg.card}
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.muted}`}>Ready to Run</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.ready}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`
            rounded-lg p-4 border
            ${themeClasses.bg.card}
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.muted}`}>High Risk</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.highRisk}</p>
                <p className={`text-xs ${themeClasses.text.muted}`}>P90 {">"} $500K</p>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`
            rounded-lg p-4 border
            ${themeClasses.bg.card}
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.muted}`}>Avg Risk Score</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.avgRisk}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Message */}
      {error && (
        <div className={`mb-6 p-4 rounded-lg border ${
          error.includes('Successfully') 
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center justify-between">
            <p>{error}</p>
            <button 
              onClick={() => setError('')}
              className={`ml-4 ${
                error.includes('Successfully') 
                  ? 'text-green-300 hover:text-green-200' 
                  : 'text-red-300 hover:text-red-200'
              } text-xs`}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Scenarios Grid - Using Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => {
          const scenarioId = scenario.id || scenario._id || scenario.scenario_id
          const isDeleting = deleteLoading === scenarioId
          
          return (
            <div
              key={scenarioId}
              className={`
                rounded-lg p-6 border cursor-pointer transition-all duration-200 hover:shadow-lg group relative
                ${themeClasses.bg.card}
                ${isDarkMode 
                  ? 'border-gray-700 hover:border-gray-600' 
                  : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }
                ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={() => !isDeleting && handleOpenScenario(scenario)}
            >
              {/* Delete Loading Overlay */}
              {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                    <span className="text-sm">Deleting...</span>
                  </div>
                </div>
              )}

              {/* Scenario Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} truncate`}>
                      {scenario.name || scenario.title || 'Untitled Scenario'}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                      (scenario.status || '').toLowerCase() === 'completed' ? 'bg-green-500/20 text-green-400' :
                      (scenario.status || '').toLowerCase() === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      (scenario.status || '').toLowerCase() === 'ready' ? 'bg-yellow-500/20 text-yellow-400' :
                      isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getScenarioStatus(scenario)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className={`w-4 h-4 ${themeClasses.text.muted}`} />
                      <span className={themeClasses.text.muted}>
                        {formatTimeAgo(scenario.created_at || scenario.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className={`w-4 h-4 ${themeClasses.text.muted}`} />
                      <span className={themeClasses.text.muted}>
                        {getRiskEventsCount(scenario)}/10
                      </span>
                    </div>
                  </div>
                  {!(scenario.has_results || scenario.hasResults || scenario.analysis_results) && (
                    <div className="flex items-center space-x-1 mb-4">
                      <div className={`w-2 h-2 rounded-full bg-gray-400`}></div>
                      <span className={`text-sm ${themeClasses.text.muted}`}>No results</span>
                    </div>
                  )}
                </div>
                
                {/* Action Menu */}
                <div className="relative group/menu">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={`
                      p-1 opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDarkMode 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`
                    absolute right-0 top-8 w-40 rounded-lg border shadow-lg z-10 py-1
                    opacity-0 group-hover/menu:opacity-100 transition-opacity pointer-events-none group-hover/menu:pointer-events-auto
                    ${themeClasses.bg.card}
                    ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                  `}>
                    <button
                      onClick={(e) => handleEditScenario(scenario, e)}
                      className={`
                        w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors
                        ${isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => handleRunAnalysis(scenario, e)}
                      className={`
                        w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors
                        ${isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Activity className="w-4 h-4" />
                      <span>Run Analysis</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteScenario(scenario, e)}
                      disabled={isDeleting}
                      className={`
                        w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors
                        text-red-400 hover:bg-red-500/10 disabled:opacity-50
                      `}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scenario Stats - Right aligned with real data */}
              <div className="flex justify-end mb-4">
                <div className="text-right">
                  <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                    {formatP50Impact(scenario)}
                  </p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>P50 Impact</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between space-x-2">
                <button
                  onClick={(e) => handleEditScenario(scenario, e)}
                  disabled={isDeleting}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors disabled:opacity-50
                    ${isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenScenario(scenario)
                  }}
                  disabled={isDeleting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
              </div>

              {/* Debug Info - Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className={`
                  mt-2 text-xs border-t pt-2
                  ${isDarkMode 
                    ? 'text-gray-500 border-gray-700' 
                    : 'text-gray-400 border-gray-200'
                  }
                `}>
                  ID: {scenarioId || 'No ID'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State - No search results */}
      {filteredScenarios.length === 0 && scenarios.length > 0 && (
        <div className="text-center py-16">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
          `}>
            <Search className={`w-8 h-8 ${themeClasses.text.muted}`} />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${themeClasses.text.primary}`}>
            No scenarios found
          </h3>
          <p className={`mb-6 ${themeClasses.text.muted}`}>
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('All Status')
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Empty State - No scenarios at all */}
      {scenarios.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
          `}>
            <BarChart3 className={`w-8 h-8 ${themeClasses.text.muted}`} />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${themeClasses.text.primary}`}>
            No scenarios yet
          </h3>
          <p className={`mb-6 ${themeClasses.text.muted}`}>
            Create your first risk scenario to get started
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Scenario</span>
          </button>
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <CreateScenarioModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateScenario}
        />
      )}

      {/* Edit Scenario Modal */}
      {showEditModal && editingScenario && (
        <EditScenarioModal
          scenario={editingScenario}
          onClose={() => {
            setShowEditModal(false)
            setEditingScenario(null)
          }}
          onSubmit={handleUpdateScenario}
        />
      )}
    </div>
  )
}

export default Scenarios