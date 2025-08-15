// Nozama-chatbot/Frontend/src/Components/Modals/CreateScenarioModal.jsx - FIXED
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, RefreshCw } from 'lucide-react'
import { scenariosAPI } from '../../services/api'

const CreateScenarioModal = ({ onClose, onSubmit }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Scenario name is required')
      return
    }

    try {
      setCreating(true)
      setError('')
      
      console.log('Creating scenario with data:', formData)
      
      // Create the scenario via API
      const response = await scenariosAPI.create({
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      
      console.log('Scenario creation response:', response)
      
      // Extract the scenario ID from the response
      let scenarioId = null
      if (response.success && response.data && response.data.id) {
        scenarioId = response.data.id
      } else if (response.data && response.data._id) {
        scenarioId = response.data._id
      } else if (response.id) {
        scenarioId = response.id
      } else if (response._id) {
        scenarioId = response._id
      }
      
      console.log('Extracted scenario ID:', scenarioId)
      
      if (!scenarioId) {
        throw new Error('No scenario ID returned from server')
      }
      
      // Call the parent's onSubmit if provided
      if (onSubmit) {
        onSubmit(response.data || response)
      }
      
      // Close the modal
      onClose()
      
      // Navigate to the new scenario canvas
      console.log('Navigating to scenario:', scenarioId)
      navigate(`/scenarios/${scenarioId}`)
      
    } catch (error) {
      console.error('Error creating scenario:', error)
      setError(`Failed to create scenario: ${error.message}`)
    } finally {
      setCreating(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Handle keyboard shortcut
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Scenario</h2>
              <p className="text-sm text-gray-400">Start building your risk simulation</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            disabled={creating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Scenario Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Q4 Cyber Risk Assessment"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
              required
              disabled={creating}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">{formData.name.length}/100 characters</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose and scope of this risk scenario..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              maxLength={200}
              disabled={creating}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.description.length}/200 characters</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={creating || !formData.name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {creating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create & Open</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to create and open
          </p>
        </form>
      </div>
    </div>
  )
}

export default CreateScenarioModal