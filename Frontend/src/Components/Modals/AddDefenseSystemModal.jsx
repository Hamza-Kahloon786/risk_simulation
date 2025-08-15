// Nozama-chatbot/Frontend/src/Components/Modals/AddDefenseSystemModal.jsx
import React, { useState } from 'react'
import { X, Shield } from 'lucide-react'
import { DEFENSE_SYSTEM_TYPES } from '../../utils/constants'

const AddDefenseSystemModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: DEFENSE_SYSTEM_TYPES.SECURITY_CONTROL,
    description: '',
    effectiveness: 80,
    cost: 50000,
    coverage_percentage: 90,
    maintenance_cost: 5000
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

  const defenseSystemTypes = [
    { value: DEFENSE_SYSTEM_TYPES.SECURITY_CONTROL, label: 'Security Control', description: 'Firewalls, monitoring' },
    { value: DEFENSE_SYSTEM_TYPES.BUSINESS_CONTINUITY, label: 'Business Continuity', description: 'DR, redundancy' },
    { value: DEFENSE_SYSTEM_TYPES.INSURANCE_COVERAGE, label: 'Insurance Coverage', description: 'Risk transfer, coverage' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Defense System</h2>
              <p className="text-sm text-gray-400">Define a defense mechanism for your scenario</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Defense Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Advanced Firewall System"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Defense Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                {defenseSystemTypes.map(type => (
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
              placeholder="Describe the defense system and how it protects against risks..."
              className="input-field w-full h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Effectiveness (%)
              </label>
              <input
                type="number"
                name="effectiveness"
                value={formData.effectiveness}
                onChange={handleChange}
                min="1"
                max="100"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Coverage (%)
              </label>
              <input
                type="number"
                name="coverage_percentage"
                value={formData.coverage_percentage}
                onChange={handleChange}
                min="1"
                max="100"
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Implementation Cost ($)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Annual Maintenance ($)
              </label>
              <input
                type="number"
                name="maintenance_cost"
                value={formData.maintenance_cost}
                onChange={handleChange}
                min="0"
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Add Defense System
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

export default AddDefenseSystemModal