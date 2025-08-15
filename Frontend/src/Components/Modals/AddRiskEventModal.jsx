// Nozama-chatbot/Frontend/src/Components/Modals/AddRiskEventModal.jsx
import React, { useState } from 'react'
import { X, Zap } from 'lucide-react'

const RISK_EVENT_TYPES = {
  CYBER_ATTACK: 'cyber_attack',
  SUPPLY_DISRUPTION: 'supply_disruption',
  OPERATIONAL_RISK: 'operational_risk',
  LEGAL_ACTION: 'legal_action',
}

const AddRiskEventModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: RISK_EVENT_TYPES.CYBER_ATTACK,
    description: '',
    probability: 10,
    impact_min: 10000,
    impact_max: 100000,
    frequency: 1
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

  const riskEventTypes = [
    { value: RISK_EVENT_TYPES.CYBER_ATTACK, label: 'Cyber Attack', description: 'Ransomware, data breaches' },
    { value: RISK_EVENT_TYPES.SUPPLY_DISRUPTION, label: 'Supply Disruption', description: 'Supplier failures, logistics' },
    { value: RISK_EVENT_TYPES.OPERATIONAL_RISK, label: 'Operational Risk', description: 'Process failures, human errors' },
    { value: RISK_EVENT_TYPES.LEGAL_ACTION, label: 'Legal Action', description: 'Lawsuits, regulatory issues' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Risk Event</h2>
              <p className="text-sm text-gray-400">Define a potential risk event for your scenario</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Event Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Ransomware Attack"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Event Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                {riskEventTypes.map(type => (
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
              placeholder="Describe the risk event and its potential impact..."
              className="input-field w-full h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Probability (%)
              </label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                min="1"
                max="100"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Min Impact ($)
              </label>
              <input
                type="number"
                name="impact_min"
                value={formData.impact_min}
                onChange={handleChange}
                min="0"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Max Impact ($)
              </label>
              <input
                type="number"
                name="impact_max"
                value={formData.impact_max}
                onChange={handleChange}
                min="0"
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Annual Frequency
            </label>
            <input
              type="number"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="input-field w-full"
              placeholder="Expected occurrences per year"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Add Risk Event
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

export default AddRiskEventModal