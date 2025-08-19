// frontend/src/components/ScenarioCanvas/BusinessAssetModal.jsx - UPDATED TO MATCH DESIGN
import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'

const BusinessAssetModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    value: 1000000,
    criticality: 'medium'
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Asset name is required'
    }
    
    if (formData.value < 1000) {
      newErrors.value = 'Asset value must be at least $1,000'
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
      type: 'critical_system', // Default type based on design
      value: parseFloat(formData.value),
      description: formData.description?.trim() || '',
      criticality: formData.criticality,
      location: formData.location?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  // Helper functions
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return `${value.toLocaleString()}`
  }

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getCriticalityDescription = (criticality) => {
    switch (criticality) {
      case 'low': return 'Minor impact on operations'
      case 'medium': return 'Moderate impact on operations'
      case 'high': return 'Critical to business operations'
      default: return 'Moderate impact on operations'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-lg">🏢</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Business Asset Details</h3>
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
              <label className="block text-sm font-medium text-white mb-2">Asset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none`}
                placeholder="Critical System"
                required
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Primary Data Center"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white h-24 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Mission-critical IT infrastructure"
            />
          </div>

          {/* Asset Properties */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-6">Asset Properties</h4>
            
            {/* Asset Valuation */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white">Asset Valuation</label>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-400">Total value (USD)</span>
                <span className="float-right text-lg font-bold text-cyan-400">{formatValue(formData.value)}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1000"
                  max="100000000"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((formData.value - 1000) / 99999000) * 100}%, #374151 ${((formData.value - 1000) / 99999000) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>$1K</span>
                  <span>$100K</span>
                  <span>$10M</span>
                  <span>$100M</span>
                </div>
              </div>
            </div>

            {/* Business Criticality */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white mb-4">Business Criticality</label>
              <div className="space-y-3">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.criticality === 'low' 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 hover:border-green-500/50'
                  }`}
                  onClick={() => setFormData({...formData, criticality: 'low'})}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.criticality === 'low' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-500'
                    }`}>
                      {formData.criticality === 'low' && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-400">Low (25% impact multiplier)</p>
                      <p className="text-xs text-gray-400">Minor impact on operations</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.criticality === 'medium' 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-gray-600 hover:border-yellow-500/50'
                  }`}
                  onClick={() => setFormData({...formData, criticality: 'medium'})}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.criticality === 'medium' 
                        ? 'bg-yellow-500 border-yellow-500' 
                        : 'border-gray-500'
                    }`}>
                      {formData.criticality === 'medium' && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-400">Medium (60% impact multiplier)</p>
                      <p className="text-xs text-gray-400">Moderate impact on operations</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.criticality === 'high' 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-gray-600 hover:border-red-500/50'
                  }`}
                  onClick={() => setFormData({...formData, criticality: 'high'})}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.criticality === 'high' 
                        ? 'bg-red-500 border-red-500' 
                        : 'border-gray-500'
                    }`}>
                      {formData.criticality === 'high' && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-400">High (100% impact multiplier)</p>
                      <p className="text-xs text-gray-400">Critical to business operations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-white mb-3">Asset Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valuation:</span>
                  <span className="text-cyan-400 font-bold">{formatValue(formData.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Criticality:</span>
                  <span className={`font-medium ${getCriticalityColor(formData.criticality)}`}>
                    {formData.criticality.charAt(0).toUpperCase() + formData.criticality.slice(1)} ({
                      formData.criticality === 'low' ? '60%' :
                      formData.criticality === 'medium' ? '60%' : '60%'
                    })
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{formData.location || 'Primary Data Center'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button 
              type="button"
              className="p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete Asset"
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
                <span>Save Asset</span>
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
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  )
}

export default BusinessAssetModal
              