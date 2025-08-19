// frontend/src/components/ScenarioCanvas/RiskEventModal.jsx - UPDATED TO MATCH DESIGN
import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'

const RiskEventModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'cyber_attack',
    description: '',
    probability: 15,
    impact_max: 500000,
    duration: 3 // in days
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Risk event name is required'
    }
    
    if (formData.probability < 1 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 1 and 100'
    }
    
    if (formData.impact_max < 1000) {
      newErrors.impact_max = 'Maximum impact must be at least $1,000'
    }
    
    if (formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 hour'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Clean and format data to match backend expectations
    const cleanData = {
      name: formData.name.trim(),
      type: formData.type,
      probability: parseFloat(formData.probability),
      impact_min: Math.round(formData.impact_max * 0.1), // Assume min is 10% of max
      impact_max: parseFloat(formData.impact_max),
      frequency: 1, // Default frequency
      description: formData.description?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  // Helper functions for slider formatting
  const formatProbability = (value) => {
    if (value <= 5) return 'Very Rare (1%)'
    if (value <= 25) return 'Possible (25%)'
    if (value <= 50) return 'Likely (50%)'
    return 'Very Likely (100%)'
  }

  const formatImpact = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return `${value.toLocaleString()}`
  }

  const formatDuration = (value) => {
    if (value < 24) return `${value} Hour${value !== 1 ? 's' : ''}`
    if (value < 168) return `${Math.round(value / 24)} Day${Math.round(value / 24) !== 1 ? 's' : ''}`
    if (value < 720) return `${Math.round(value / 168)} Week${Math.round(value / 168) !== 1 ? 's' : ''}`
    return '30 Days'
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Risk Event Details</h3>
              <p className="text-sm text-gray-400">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Event Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none`}
                placeholder="Cyber Attack"
                required
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Event Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="cyber_attack">Cyber Attack</option>
                <option value="supply_disruption">Supply Disruption</option>
                <option value="operational_risk">Operational Risk</option>
                <option value="legal_action">Legal Action</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white h-24 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Malicious cyber security incident"
            />
          </div>

          {/* Risk Parameters */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-6">Risk Parameters</h4>
            
            {/* Likelihood Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Likelihood ({formData.probability}%)</label>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.probability}%, #374151 ${formData.probability}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Very Rare (1%)</span>
                  <span>Possible (25%)</span>
                  <span>Likely (50%)</span>
                  <span>Very Likely (100%)</span>
                </div>
              </div>
            </div>

            {/* Maximum Financial Impact */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Maximum Financial Impact</label>
                <span className="text-sm font-medium text-orange-400">{formatImpact(formData.impact_max)}</span>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-400">Worst-case loss (USD)</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  value={formData.impact_max}
                  onChange={(e) => setFormData({...formData, impact_max: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((formData.impact_max - 1000) / 9999000) * 100}%, #374151 ${((formData.impact_max - 1000) / 9999000) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>$1K</span>
                  <span>$100K</span>
                  <span>$1M</span>
                  <span>$10M</span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Duration ({formatDuration(formData.duration)})</label>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="720"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData.duration - 1) / 719) * 100}%, #374151 ${((formData.duration - 1) / 719) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>1 Hour</span>
                  <span>1 Day</span>
                  <span>1 Week</span>
                  <span>30 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button 
              type="button"
              className="p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete Event"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Save Event</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  )
}

export default RiskEventModal// frontend/src/components/ScenarioCanvas/RiskEventModal.jsx
