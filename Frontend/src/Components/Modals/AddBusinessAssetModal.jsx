import React, { useState } from 'react'
import { X, Building } from 'lucide-react'
import { BUSINESS_ASSET_TYPES } from '../../utils/constants'

const AddBusinessAssetModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: BUSINESS_ASSET_TYPES.CRITICAL_SYSTEM,
    description: '',
    value: 500000,
    criticality: 'high',
    location: '',
    dependencies: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const businessAssetTypes = [
    { value: BUSINESS_ASSET_TYPES.CRITICAL_SYSTEM, label: 'Critical System', description: 'IT infrastructure, databases' },
    { value: BUSINESS_ASSET_TYPES.BUSINESS_LOCATION, label: 'Business Location', description: 'Offices, plants' },
    { value: BUSINESS_ASSET_TYPES.DATA_ASSET, label: 'Data Asset', description: 'Customer data, IP' },
    { value: BUSINESS_ASSET_TYPES.KEY_PERSONNEL, label: 'Key Personnel', description: 'Critical staff, expertise' }
  ]

  const criticalityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'critical', label: 'Critical', color: 'text-red-400' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Business Asset</h2>
              <p className="text-sm text-gray-400">Define a critical business asset for your scenario</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Asset Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Primary Database Server"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Asset Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                {businessAssetTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the business asset and its importance..."
              className="input-field w-full h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Asset Value ($)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Criticality Level
              </label>
              <select
                name="criticality"
                value={formData.criticality}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                {criticalityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Data Center A"
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Add Business Asset
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBusinessAssetModal