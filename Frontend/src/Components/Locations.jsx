import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Building,
  Users,
  Activity,
  RefreshCw,
  Save,
  X
} from 'lucide-react'

// API base URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

const LocationsManager = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'office',
    employees: 0,
    annual_revenue: 0,
    monthly_profit: 0,
    monthly_loss: 0,
    risk_score: 0,
    defense_spending: 0,
    recent_attacks: 0,
    status: 'active'
  })

  // Initialize with data from backend
  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`${API_BASE_URL}/locations/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform the data to match frontend expectations
      const transformedData = data.map(location => ({
        id: location._id || location.id,
        name: location.name,
        address: location.address,
        type: location.type,
        employees: location.employees,
        annualRevenue: location.annual_revenue,
        monthlyProfit: location.monthly_profit,
        monthlyLoss: location.monthly_loss,
        recentAttacks: location.recent_attacks,
        riskScore: location.risk_score,
        lastIncident: location.last_incident,
        defenseSpending: location.defense_spending,
        status: location.status
      }))
      
      setLocations(transformedData)
    } catch (error) {
      console.error('Error loading locations:', error)
      setError(`Failed to load locations: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    
    try {
      // Transform form data to match backend schema
      const payload = {
        name: formData.name,
        address: formData.address,
        type: formData.type,
        employees: Number(formData.employees),
        annual_revenue: Number(formData.annual_revenue),
        monthly_profit: Number(formData.monthly_profit),
        monthly_loss: Number(formData.monthly_loss),
        recent_attacks: Number(formData.recent_attacks),
        risk_score: Number(formData.risk_score),
        defense_spending: Number(formData.defense_spending),
        status: formData.status
      }

      let response
      
      if (selectedLocation) {
        // Update existing location
        response = await fetch(`${API_BASE_URL}/locations/${selectedLocation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new location
        response = await fetch(`${API_BASE_URL}/locations/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      // Reload locations to get updated data
      await loadLocations()
      
      setShowAddModal(false)
      setSelectedLocation(null)
      resetForm()
    } catch (error) {
      console.error('Error saving location:', error)
      setError(`Error saving location: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (locationId) => {
    if (!locationId) {
      console.error('No location ID provided')
      return
    }

    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
        }
        
        // Reload locations to get updated list
        await loadLocations()
      } catch (error) {
        console.error('Error deleting location:', error)
        setError(`Error deleting location: ${error.message}`)
      }
    }
  }

  const handleEdit = (location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name || '',
      address: location.address || '',
      type: location.type || 'office',
      employees: location.employees || 0,
      annual_revenue: location.annualRevenue || 0,
      monthly_profit: location.monthlyProfit || 0,
      monthly_loss: location.monthlyLoss || 0,
      risk_score: location.riskScore || 0,
      defense_spending: location.defenseSpending || 0,
      recent_attacks: location.recentAttacks || 0,
      status: location.status || 'active'
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      type: 'office',
      employees: 0,
      annual_revenue: 0,
      monthly_profit: 0,
      monthly_loss: 0,
      risk_score: 0,
      defense_spending: 0,
      recent_attacks: 0,
      status: 'active'
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const getRiskColor = (score) => {
    if (score < 30) return 'text-green-400'
    if (score < 60) return 'text-yellow-400'
    if (score < 80) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRiskBadge = (score) => {
    if (score < 30) return 'bg-green-500/20 text-green-400'
    if (score < 60) return 'bg-yellow-500/20 text-yellow-400'
    if (score < 80) return 'bg-orange-500/20 text-orange-400'
    return 'bg-red-500/20 text-red-400'
  }

  const getLocationIcon = (type) => {
    switch (type) {
      case 'headquarters': return <Building className="w-5 h-5 text-white" />
      case 'datacenter': return <Activity className="w-5 h-5 text-white" />
      case 'office': return <Building className="w-5 h-5 text-white" />
      case 'manufacturing': return <Activity className="w-5 h-5 text-white" />
      default: return <MapPin className="w-5 h-5 text-white" />
    }
  }

  const totalStats = locations.reduce((acc, location) => ({
    totalRevenue: acc.totalRevenue + (location.annualRevenue || 0),
    totalProfit: acc.totalProfit + (location.monthlyProfit || 0),
    totalLoss: acc.totalLoss + (location.monthlyLoss || 0),
    totalEmployees: acc.totalEmployees + (location.employees || 0),
    totalAttacks: acc.totalAttacks + (location.recentAttacks || 0),
    totalDefenseSpending: acc.totalDefenseSpending + (location.defenseSpending || 0)
  }), {
    totalRevenue: 0,
    totalProfit: 0,
    totalLoss: 0,
    totalEmployees: 0,
    totalAttacks: 0,
    totalDefenseSpending: 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-white text-lg">Loading locations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Business Locations</h1>
            <p className="text-gray-400">Monitor financial performance and risk across all locations</p>
          </div>
          <button 
            onClick={() => {
              setSelectedLocation(null)
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Location</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-400">Annual Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.totalProfit / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-400">Monthly Profit</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.totalLoss / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-400">Monthly Loss</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalStats.totalEmployees}</p>
                <p className="text-sm text-gray-400">Total Employees</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalStats.totalAttacks}</p>
                <p className="text-sm text-gray-400">Security Incidents</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.totalDefenseSpending / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-400">Defense Spending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
              {/* Location Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    {getLocationIcon(location.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{location.name}</h3>
                    <p className="text-sm text-gray-400">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(location)}
                    className="text-gray-400 hover:text-blue-400 p-2 rounded transition-colors"
                    title="Edit Location"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(location.id)}
                    className="text-gray-400 hover:text-red-400 p-2 rounded transition-colors"
                    title="Delete Location"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Annual Revenue</p>
                  <p className="text-lg font-bold text-white">${((location.annualRevenue || 0) / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Monthly Profit</p>
                  <p className="text-lg font-bold text-green-400">${((location.monthlyProfit || 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Monthly Loss</p>
                  <p className="text-lg font-bold text-red-400">${((location.monthlyLoss || 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Employees</p>
                  <p className="text-lg font-bold text-white">{location.employees || 0}</p>
                </div>
              </div>

              {/* Risk Information */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Risk Assessment</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(location.riskScore || 0)}`}>
                    {location.riskScore || 0}% Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-400 mb-1">Recent Attacks</p>
                    <p className={`font-medium ${(location.recentAttacks || 0) > 3 ? 'text-red-400' : (location.recentAttacks || 0) > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {location.recentAttacks || 0} incidents
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Defense Budget</p>
                    <p className="font-medium text-white">${((location.defenseSpending || 0) / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {location.lastIncident && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Last Incident</p>
                    <p className="text-xs text-gray-300">{new Date(location.lastIncident).toLocaleDateString()}</p>
                  </div>
                )}

                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (location.status || 'active') === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {(location.status || 'active') === 'active' ? 'Operational' : 'At Risk'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Location Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedLocation ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddModal(false)
                      setSelectedLocation(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Enter location name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="office">Office</option>
                        <option value="headquarters">Headquarters</option>
                        <option value="datacenter">Data Center</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Employees</label>
                      <input
                        type="number"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Annual Revenue ($)</label>
                      <input
                        type="number"
                        name="annual_revenue"
                        value={formData.annual_revenue}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Profit ($)</label>
                      <input
                        type="number"
                        name="monthly_profit"
                        value={formData.monthly_profit}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Loss ($)</label>
                      <input
                        type="number"
                        name="monthly_loss"
                        value={formData.monthly_loss}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Risk Score (%)</label>
                      <input
                        type="number"
                        name="risk_score"
                        value={formData.risk_score}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Defense Spending ($)</label>
                      <input
                        type="number"
                        name="defense_spending"
                        value={formData.defense_spending}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Recent Attacks</label>
                      <input
                        type="number"
                        name="recent_attacks"
                        value={formData.recent_attacks}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button 
                      onClick={() => {
                        setShowAddModal(false)
                        setSelectedLocation(null)
                        resetForm()
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>{selectedLocation ? 'Update Location' : 'Add Location'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationsManager