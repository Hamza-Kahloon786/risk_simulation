// frontend/src/components/ScenarioCanvas/DefenseSystemModal.jsx - UPDATED TO MATCH DESIGN
import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'

const DefenseSystemModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    effectiveness: 70,
    cost: 100000
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Defense system name is required'
    }
    
    if (formData.effectiveness < 1 || formData.effectiveness > 100) {
      newErrors.effectiveness = 'Effectiveness must be between 1 and 100'
    }
    
    if (formData.cost < 1000) {
      newErrors.cost = 'Cost must be at least $1,000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const cleanData = {
      name: formData.name.trim(),
      type: 'security_control', // Default type
      effectiveness: parseFloat(formData.effectiveness),
      cost: parseFloat(formData.cost),
      description: formData.description?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  // Helper functions
  const formatCost = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return `${value.toLocaleString()}`
  }

  const getEffectivenessLevel = (value) => {
    if (value < 25) return { level: 'Minimal', color: 'text-red-400' }
    if (value < 50) return { level: 'Moderate', color: 'text-yellow-400' }
    if (value < 75) return { level: 'Good', color: 'text-blue-400' }
    if (value < 90) return { level: 'Excellent', color: 'text-green-400' }
    return { level: 'Maximum', color: 'text-green-400' }
  }

  const effectivenessInfo = getEffectivenessLevel(formData.effectiveness)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-lg">🛡</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Defense System Details</h3>
              <p className="text-sm text-gray-400">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Defense Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none`}
              placeholder="Security Control"
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white h-24 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Cybersecurity defense system"
            />
          </div>

          {/* Defense Properties */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-6">Defense Properties</h4>
            
            {/* Risk Mitigation Effectiveness */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Risk Mitigation Effectiveness</label>
                <span className="text-sm text-gray-400">Damage reduction</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">{formData.effectiveness}%</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">Toggle</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={formData.effectiveness}
                  onChange={(e) => setFormData({...formData, effectiveness: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData.effectiveness - 10) / 85) * 100}%, #374151 ${((formData.effectiveness - 10) / 85) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>10% (Minimal)</span>
                  <span>50% (Moderate)</span>
                  <span>80% (Excellent)</span>
                  <span>95% (Maximum)</span>
                </div>
              </div>
            </div>

            {/* Annual Cost */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Annual Cost</label>
                <span className="text-sm text-gray-400">Yearly investment (USD)</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">{formatCost(formData.cost)}</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((formData.cost - 1000) / 9999000) * 100}%, #374151 ${((formData.cost - 1000) / 9999000) * 100}%, #374151 100%)`
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

            {/* Cost-Effectiveness Analysis */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-white mb-3">Cost-Effectiveness Analysis</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cost per % Protection:</span>
                  <span className="text-cyan-400 font-bold">${Math.round(formData.cost / formData.effectiveness).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ROI Rating:</span>
                  <span className={`font-medium ${effectivenessInfo.color}`}>
                    {effectivenessInfo.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Protection Value:</span>
                  <span className="text-green-400 font-bold">{formData.effectiveness}% damage reduction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button 
              type="button"
              className="p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete Defense"
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
                <span>Save Defense</span>
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

export default DefenseSystemModal