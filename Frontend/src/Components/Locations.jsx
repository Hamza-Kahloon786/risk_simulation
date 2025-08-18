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
import { useTheme } from '../contexts/ThemeContext'

// API base URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

const Locations = () => {
  const { themeClasses, isDarkMode } = useTheme()
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
    if (score < 60) return isDarkMode ? 'text-gray-300' : 'text-gray-800'
    if (score < 80) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRiskBadge = (score) => {
    if (score < 30) return 'bg-green-500/20 text-green-400'
    if (score < 60) return isDarkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-200 text-gray-800'
    if (score < 80) return 'bg-orange-500/20 text-orange-400'
    return 'bg-red-500/20 text-red-400'
  }

  const getLocationIcon = (type) => {
    switch (type) {
      case 'headquarters': return <Building className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      case 'datacenter': return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      case 'office': return <Building className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      case 'manufacturing': return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      default: return <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
    }
  }

  // Format numbers for display
  const formatCurrency = (amount, decimals = 1) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(decimals)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(decimals)}K`
    return `$${amount.toFixed(0)}`
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
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.bg.dashboard}`}>
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className={`${themeClasses.text.primary} text-lg`}>Loading locations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg.dashboard}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${themeClasses.text.primary} mb-2`}>
              Business Locations
            </h1>
            <p className={`${themeClasses.text.muted} text-sm sm:text-base`}>
              Monitor financial performance and risk across all locations
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedLocation(null)
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-colors text-white text-sm sm:text-base min-h-[44px]"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Location</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalRevenue > 0 ? formatCurrency(totalStats.totalRevenue) : '$0'}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Annual Revenue</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalProfit > 0 ? formatCurrency(totalStats.totalProfit, 0) : '$0'}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Monthly Profit</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalLoss > 0 ? formatCurrency(totalStats.totalLoss, 0) : '$0'}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Monthly Loss</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalEmployees || 0}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Total Employees</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalAttacks || 0}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Security Incidents</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-lg sm:text-2xl font-bold ${themeClasses.text.primary} truncate`}>
                  {totalStats.totalDefenseSpending > 0 ? formatCurrency(totalStats.totalDefenseSpending, 0) : '$0'}
                </p>
                <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Defense Spending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className={`
                ${themeClasses.bg.card} rounded-lg p-4 sm:p-6 border transition-all duration-200
                ${isDarkMode 
                  ? 'border-gray-700 hover:border-gray-600' 
                  : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Location Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.text.primary} truncate`}>
                      {location.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${themeClasses.text.muted} truncate`}>
                      {location.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                  <button 
                    onClick={() => handleEdit(location)}
                    className={`
                      p-1.5 sm:p-2 rounded transition-colors
                      ${isDarkMode 
                        ? 'text-gray-400 hover:text-blue-400' 
                        : 'text-gray-500 hover:text-blue-600'
                      }
                    `}
                    title="Edit Location"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(location.id)}
                    className={`
                      p-1.5 sm:p-2 rounded transition-colors hover:text-red-400
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                    title="Delete Location"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className={`
                  rounded-lg p-2 sm:p-3
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}
                `}>
                  <p className={`text-xs ${themeClasses.text.muted} mb-1`}>Annual Revenue</p>
                  <p className={`text-sm sm:text-lg font-bold ${themeClasses.text.primary} truncate`}>
                    {formatCurrency(location.annualRevenue || 0)}
                  </p>
                </div>
                <div className={`
                  rounded-lg p-2 sm:p-3
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}
                `}>
                  <p className={`text-xs ${themeClasses.text.muted} mb-1`}>Monthly Profit</p>
                  <p className="text-sm sm:text-lg font-bold text-green-400 truncate">
                    {formatCurrency(location.monthlyProfit || 0, 0)}
                  </p>
                </div>
                <div className={`
                  rounded-lg p-2 sm:p-3
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}
                `}>
                  <p className={`text-xs ${themeClasses.text.muted} mb-1`}>Monthly Loss</p>
                  <p className="text-sm sm:text-lg font-bold text-red-400 truncate">
                    {formatCurrency(location.monthlyLoss || 0, 0)}
                  </p>
                </div>
                <div className={`
                  rounded-lg p-2 sm:p-3
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}
                `}>
                  <p className={`text-xs ${themeClasses.text.muted} mb-1`}>Employees</p>
                  <p className={`text-sm sm:text-lg font-bold ${themeClasses.text.primary}`}>
                    {location.employees || 0}
                  </p>
                </div>
              </div>

              {/* Risk Information */}
              <div className={`
                border-t pt-4
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Risk Assessment</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(location.riskScore || 0)}`}>
                    {location.riskScore || 0}% Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm mb-4">
                  <div>
                    <p className={`${themeClasses.text.muted} mb-1`}>Recent Attacks</p>
                    <p className={`font-medium ${
                      (location.recentAttacks || 0) > 3 
                        ? 'text-red-400' 
                        : (location.recentAttacks || 0) > 1 
                          ? (isDarkMode ? 'text-gray-300' : 'text-gray-800')
                          : 'text-green-400'
                    }`}>
                      {location.recentAttacks || 0} incidents
                    </p>
                  </div>
                  <div>
                    <p className={`${themeClasses.text.muted} mb-1`}>Defense Budget</p>
                    <p className={`font-medium ${themeClasses.text.primary} truncate`}>
                      {formatCurrency(location.defenseSpending || 0, 0)}
                    </p>
                  </div>
                </div>

                {location.lastIncident && (
                  <div className="mb-3">
                    <p className={`text-xs ${themeClasses.text.muted} mb-1`}>Last Incident</p>
                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                      {new Date(location.lastIncident).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            <div className={`${themeClasses.bg.card} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl sm:text-2xl font-bold ${themeClasses.text.primary}`}>
                    {selectedLocation ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddModal(false)
                      setSelectedLocation(null)
                      resetForm()
                    }}
                    className={`${themeClasses.text.muted} hover:text-red-400 p-2 transition-colors`}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Location Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        required
                        placeholder="Enter location name"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                      >
                        <option value="office">Office</option>
                        <option value="headquarters">Headquarters</option>
                        <option value="datacenter">Data Center</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`
                        w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                        }
                      `}
                      required
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Employees
                      </label>
                      <input
                        type="number"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Annual Revenue ($)
                      </label>
                      <input
                        type="number"
                        name="annual_revenue"
                        value={formData.annual_revenue}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Monthly Profit ($)
                      </label>
                      <input
                        type="number"
                        name="monthly_profit"
                        value={formData.monthly_profit}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Monthly Loss ($)
                      </label>
                      <input
                        type="number"
                        name="monthly_loss"
                        value={formData.monthly_loss}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Risk Score (%)
                      </label>
                      <input
                        type="number"
                        name="risk_score"
                        value={formData.risk_score}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Defense Spending ($)
                      </label>
                      <input
                        type="number"
                        name="defense_spending"
                        value={formData.defense_spending}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Recent Attacks
                      </label>
                      <input
                        type="number"
                        name="recent_attacks"
                        value={formData.recent_attacks}
                        onChange={handleInputChange}
                        className={`
                          w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                          }
                        `}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                    <button 
                      onClick={() => {
                        setShowAddModal(false)
                        setSelectedLocation(null)
                        resetForm()
                      }}
                      className={`
                        px-6 py-3 rounded-lg font-semibold transition-colors min-h-[44px]
                        ${isDarkMode 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }
                      `}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 min-h-[44px]"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
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

export default Locations