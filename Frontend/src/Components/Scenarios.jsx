// frontend/src/components/Scenarios.jsx - WITH THEME SUPPORT
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, Edit, Trash2, BarChart3 } from 'lucide-react'
import { scenariosAPI } from '../services/api'
import CreateScenarioModal from './Modals/CreateScenarioModal'
import { useTheme } from '../contexts/ThemeContext'

const Scenarios = () => {
  const navigate = useNavigate()
  const { themeClasses, isDarkMode } = useTheme()
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadScenarios()
  }, [])

  const loadScenarios = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await scenariosAPI.getAll()
      console.log('Scenarios loaded:', response)
      
      if (response.success && response.data) {
        setScenarios(response.data)
      } else if (Array.isArray(response)) {
        setScenarios(response)
      } else {
        setScenarios([])
      }
    } catch (error) {
      console.error('Error loading scenarios:', error)
      setError('Failed to load scenarios')
      setScenarios([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenScenario = (scenario) => {
    console.log('Opening scenario:', scenario)
    
    // Extract the ID from the scenario object
    const scenarioId = scenario.id || scenario._id
    
    if (!scenarioId) {
      console.error('No ID found in scenario:', scenario)
      setError('Invalid scenario: missing ID')
      return
    }
    
    console.log('Navigating to scenario ID:', scenarioId)
    navigate(`/scenarios/${scenarioId}`)
  }

  const handleDeleteScenario = async (scenario, e) => {
    e.stopPropagation() // Prevent opening scenario when clicking delete
    
    if (!window.confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
      return
    }

    try {
      const scenarioId = scenario.id || scenario._id
      await scenariosAPI.delete(scenarioId)
      await loadScenarios() // Reload the list
    } catch (error) {
      console.error('Error deleting scenario:', error)
      setError('Failed to delete scenario')
    }
  }

  const handleCreateScenario = (newScenario) => {
    // The modal will handle navigation, we just need to refresh the list
    loadScenarios()
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
    <div className={`p-8 min-h-screen ${themeClasses.bg.dashboard}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
            Risk Scenarios
          </h1>
          <p className={`mt-1 ${themeClasses.text.muted}`}>
            Create and manage your risk simulation scenarios
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Scenario</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id || scenario._id}
            onClick={() => handleOpenScenario(scenario)}
            className={`
              rounded-lg p-6 border cursor-pointer transition-all duration-200 hover:shadow-lg
              ${themeClasses.bg.card}
              ${isDarkMode 
                ? 'border-gray-700 hover:border-gray-600' 
                : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }
            `}
          >
            {/* Scenario Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                    {scenario.name}
                  </h3>
                  <p className={`text-sm ${themeClasses.text.muted}`}>
                    {scenario.description || 'No description provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scenario.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  scenario.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                  scenario.status === 'ready' ? 'bg-yellow-500/20 text-yellow-400' :
                  isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {(scenario.status || 'draft').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Scenario Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-xs ${themeClasses.text.muted}`}>Risk Score</p>
                <p className={`text-lg font-bold ${themeClasses.text.primary} break-words`}>
                  {(() => {
                    const riskScore = scenario.risk_score || 0;
                    // Format the number to max 2 decimal places and remove trailing zeros
                    const formatted = typeof riskScore === 'number' 
                      ? parseFloat(riskScore.toFixed(2))
                      : parseFloat(parseFloat(riskScore).toFixed(2));
                    return `${formatted}%`;
                  })()}
                </p>
              </div>
              <div>
                <p className={`text-xs ${themeClasses.text.muted}`}>Created</p>
                <p className={`text-sm ${themeClasses.text.primary}`}>
                  {scenario.created_at ? new Date(scenario.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`
              flex items-center justify-between pt-4 border-t
              ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenScenario(scenario)
                }}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">Open Scenario</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle edit functionality
                    console.log('Edit scenario:', scenario)
                  }}
                  className={`
                    p-1 transition-colors
                    ${isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title="Edit Scenario"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDeleteScenario(scenario, e)}
                  className={`
                    p-1 transition-colors hover:text-red-400
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                  `}
                  title="Delete Scenario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Debug Info (remove in production) */}
            <div className={`
              mt-2 text-xs border-t pt-2
              ${isDarkMode 
                ? 'text-gray-500 border-gray-700' 
                : 'text-gray-400 border-gray-200'
              }
            `}>
              ID: {scenario.id || scenario._id || 'No ID'}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {scenarios.length === 0 && (
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
    </div>
  )
}

export default Scenarios