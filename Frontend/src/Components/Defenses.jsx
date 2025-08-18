// frontend/src/components/Defenses.jsx - FULL THEME SUPPORT
import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Plus,
  Settings,
  BarChart3,
  Clock,
  Users,
  Zap,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Import from the corrected API service
import { defensesAPI } from '../services/api'

const Defenses = () => {
  const { themeClasses, isDarkMode } = useTheme()
  const [defenses, setDefenses] = useState([])
  const [stats, setStats] = useState({
    total_cost: 0,
    total_savings: 0,
    total_incidents_prevented: 0,
    average_roi: 0,
    average_risk_reduction: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDefense, setEditingDefense] = useState(null)

  useEffect(() => {
    loadData()
  }, [filterCategory, filterStatus])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load defenses with proper error handling
      const defensesResponse = await defensesAPI.getAll({
        category: filterCategory,
        status: filterStatus
      })
      
      if (defensesResponse.success) {
        setDefenses(defensesResponse.data || [])
      }
      
      // Load stats with error handling
      try {
        const statsResponse = await defensesAPI.getStats()
        if (statsResponse.success) {
          setStats(statsResponse.data || {})
        }
      } catch (statsError) {
        console.warn('Could not load defense stats:', statsError)
        // Continue without stats - don't break the whole component
      }
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please check your network connection.')
      // Fallback to sample data
      setDefenses(getSampleDefenses())
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSampleData = async () => {
    try {
      setLoading(true)
      
      // Create sample defenses manually since the endpoint might not exist
      const sampleDefenses = getSampleDefenses()
      
      for (const defense of sampleDefenses) {
        try {
          await defensesAPI.create(defense)
        } catch (createError) {
          console.warn('Could not create sample defense:', createError)
        }
      }
      
      await loadData()
    } catch (err) {
      console.error('Error creating sample data:', err)
      setError('Failed to create sample data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDefense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this defense system?')) {
      return
    }
    
    try {
      await defensesAPI.delete(id)
      await loadData()
    } catch (err) {
      console.error('Error deleting defense:', err)
      setError('Failed to delete defense system')
    }
  }

  const handleSaveDefense = async (defenseData) => {
    try {
      if (editingDefense) {
        await defensesAPI.update(editingDefense.id, defenseData)
      } else {
        await defensesAPI.create(defenseData)
      }
      
      setShowAddForm(false)
      setEditingDefense(null)
      await loadData()
    } catch (err) {
      console.error('Error saving defense:', err)
      setError('Failed to save defense system')
    }
  }

  const getSampleDefenses = () => {
    return [
      {
        name: 'Advanced Firewall System',
        category: 'network_security',
        status: 'active',
        effectiveness: 92,
        deployment_date: '2023-06-15',
        last_update: '2024-02-01',
        annual_cost: 180000,
        implementation_cost: 450000,
        maintenance_cost: 15000,
        threats_blocked: 15420,
        incidents_prevented: 8,
        estimated_loss_prevented: 2400000,
        roi: 1233,
        location: 'All Locations',
        vendor: 'SecureNet Pro',
        coverage: ['Network Traffic', 'DDoS Protection', 'Intrusion Detection'],
        uptime: 99.8,
        last_incident: null,
        risk_reduction: 35
      },
      {
        name: 'Endpoint Detection & Response',
        category: 'monitoring',
        status: 'active',
        effectiveness: 88,
        deployment_date: '2023-08-20',
        last_update: '2024-01-15',
        annual_cost: 95000,
        implementation_cost: 180000,
        maintenance_cost: 8000,
        threats_blocked: 8650,
        incidents_prevented: 12,
        estimated_loss_prevented: 1800000,
        roi: 1789,
        location: 'All Endpoints',
        vendor: 'CyberDefense Corp',
        coverage: ['Malware Detection', 'Behavioral Analysis', 'Threat Hunting'],
        uptime: 99.5,
        last_incident: '2024-01-10',
        risk_reduction: 42
      },
      {
        name: 'Security Awareness Training',
        category: 'human_security',
        status: 'active',
        effectiveness: 75,
        deployment_date: '2023-03-01',
        last_update: '2024-01-01',
        annual_cost: 45000,
        implementation_cost: 25000,
        maintenance_cost: 5000,
        threats_blocked: 0,
        incidents_prevented: 6,
        estimated_loss_prevented: 890000,
        roi: 1878,
        location: 'All Employees',
        vendor: 'SecureAware',
        coverage: ['Phishing Simulation', 'Security Policies', 'Incident Response'],
        uptime: 100,
        last_incident: null,
        risk_reduction: 28
      }
    ]
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'network_security': return <Shield className="w-5 h-5" />
      case 'human_security': return <Users className="w-5 h-5" />
      case 'data_protection': return <Activity className="w-5 h-5" />
      case 'access_control': return <CheckCircle className="w-5 h-5" />
      case 'monitoring': return <BarChart3 className="w-5 h-5" />
      case 'risk_transfer': return <TrendingUp className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'network_security': return 'bg-blue-500'
      case 'human_security': return 'bg-green-500'
      case 'data_protection': return 'bg-purple-500'
      case 'access_control': return 'bg-orange-500'
      case 'monitoring': return 'bg-yellow-500'
      case 'risk_transfer': return 'bg-indigo-500'
      default: return 'bg-gray-500'
    }
  }

  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness >= 90) return 'text-green-400'
    if (effectiveness >= 80) return 'text-yellow-400'
    if (effectiveness >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.bg.dashboard}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={themeClasses.text.primary}>Loading defense systems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg.dashboard}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${themeClasses.text.primary}`}>
              Defense Systems & Security
            </h1>
            <p className={`${themeClasses.text.muted} mt-1`}>
              Monitor security investments and their financial returns
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={handleCreateSampleData}
              className="px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              aria-label="Create sample data"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Sample Data</span>
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              aria-label="Add defense"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Defense</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-yellow-300">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className={`${themeClasses.bg.card} p-6 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  ${(stats.total_cost / 1000000).toFixed(1)}M
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>Annual Defense Cost</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} p-6 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  ${(stats.total_savings / 1000000).toFixed(1)}M
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>Loss Prevention</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} p-6 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {Math.round(stats.average_roi || 0)}%
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>Average ROI</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} p-6 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.total_incidents_prevented || 0}
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>Incidents Prevented</p>
              </div>
            </div>
          </div>

          <div className={`${themeClasses.bg.card} p-6 rounded-lg border ${themeClasses.border.primary}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {Math.round(stats.average_risk_reduction || 0)}%
                </p>
                <p className={`text-xs ${themeClasses.text.muted}`}>Risk Reduction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`
              border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
              }
            `}
          >
            <option value="all">All Categories</option>
            <option value="network_security">Network Security</option>
            <option value="human_security">Human Security</option>
            <option value="data_protection">Data Protection</option>
            <option value="access_control">Access Control</option>
            <option value="monitoring">Monitoring</option>
            <option value="risk_transfer">Risk Transfer</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`
              border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
              }
            `}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Defense Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {defenses.map((defense) => (
            <div 
              key={defense.id} 
              className={`
                ${themeClasses.bg.card} p-6 rounded-lg transition-colors border
                ${isDarkMode 
                  ? 'border-gray-700 hover:bg-gray-750' 
                  : 'border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Defense Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getCategoryColor(defense.category)} rounded-lg flex items-center justify-center text-white`}>
                    {getCategoryIcon(defense.category)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                      {defense.name}
                    </h3>
                    <p className={`text-sm ${themeClasses.text.muted} truncate max-w-[70vw] sm:max-w-xs`}>
                      {defense.vendor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    defense.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {defense.status.toUpperCase()}
                  </span>
                  <button 
                    onClick={() => {
                      setEditingDefense(defense)
                      setShowAddForm(true)
                    }}
                    className={`
                      p-1 transition-colors
                      ${isDarkMode 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteDefense(defense.id)}
                    className={`
                      p-1 transition-colors hover:text-red-400
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Effectiveness & Financial Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`text-xs ${themeClasses.text.muted}`}>Effectiveness</p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-lg font-bold ${getEffectivenessColor(defense.effectiveness)}`}>
                      {defense.effectiveness}%
                    </p>
                    <div className={`flex-1 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${defense.effectiveness >= 90 ? 'bg-green-500' : defense.effectiveness >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                        style={{ width: `${defense.effectiveness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`text-xs ${themeClasses.text.muted}`}>ROI</p>
                  <p className="text-lg font-bold text-green-400">{defense.roi}%</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className={themeClasses.text.muted}>Annual Cost</p>
                  <p className={`font-medium ${themeClasses.text.primary}`}>
                    ${(defense.annual_cost / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className={themeClasses.text.muted}>Loss Prevented</p>
                  <p className="font-medium text-green-400">
                    ${(defense.estimated_loss_prevented / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className={themeClasses.text.muted}>Incidents Stopped</p>
                  <p className="font-medium text-blue-400">{defense.incidents_prevented}</p>
                </div>
              </div>

              {/* Coverage Areas */}
              <div className="mb-4">
                <p className={`text-xs ${themeClasses.text.muted} mb-2`}>Coverage:</p>
                <div className="flex flex-wrap gap-1">
                  {defense.coverage?.map((area, index) => (
                    <span 
                      key={index} 
                      className={`
                        px-2 py-1 text-xs rounded
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className={`
                border-t pt-4
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={themeClasses.text.muted}>Uptime</p>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{defense.uptime}%</p>
                  </div>
                  <div>
                    <p className={themeClasses.text.muted}>Risk Reduction</p>
                    <p className="font-medium text-green-400">{defense.risk_reduction}%</p>
                  </div>
                  <div>
                    <p className={themeClasses.text.muted}>Location</p>
                    <p className={`font-medium ${themeClasses.text.primary} text-xs`}>{defense.location}</p>
                  </div>
                  <div>
                    <p className={themeClasses.text.muted}>Last Update</p>
                    <p className={`font-medium ${themeClasses.text.primary} text-xs`}>
                      {defense.last_update ? new Date(defense.last_update).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Threats Blocked */}
              {defense.threats_blocked > 0 && (
                <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">
                      {defense.threats_blocked.toLocaleString()} threats blocked
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {defenses.length === 0 && (
          <div className="text-center py-12">
            <Shield className={`w-16 h-16 ${themeClasses.text.muted} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>
              No defense systems found
            </h3>
            <p className={`${themeClasses.text.muted} mb-4`}>
              Try adjusting your filter criteria or add a new defense system
            </p>
            <button 
              onClick={handleCreateSampleData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Sample Data
            </button>
          </div>
        )}

        {/* Add/Edit Defense Form Modal */}
        {showAddForm && (
          <DefenseForm
            defense={editingDefense}
            onSave={handleSaveDefense}
            onCancel={() => {
              setShowAddForm(false)
              setEditingDefense(null)
            }}
            themeClasses={themeClasses}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  )
}

// Defense Form Component
const DefenseForm = ({ defense, onSave, onCancel, themeClasses, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: defense?.name || '',
    category: defense?.category || 'network_security',
    status: defense?.status || 'active',
    effectiveness: defense?.effectiveness || 80,
    deployment_date: defense?.deployment_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    last_update: defense?.last_update?.split('T')[0] || new Date().toISOString().split('T')[0],
    annual_cost: defense?.annual_cost || 0,
    implementation_cost: defense?.implementation_cost || 0,
    maintenance_cost: defense?.maintenance_cost || 0,
    threats_blocked: defense?.threats_blocked || 0,
    incidents_prevented: defense?.incidents_prevented || 0,
    estimated_loss_prevented: defense?.estimated_loss_prevented || 0,
    location: defense?.location || '',
    vendor: defense?.vendor || '',
    coverage: defense?.coverage?.join(', ') || '',
    uptime: defense?.uptime || 99.9,
    risk_reduction: defense?.risk_reduction || 20
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      deployment_date: new Date(formData.deployment_date).toISOString(),
      last_update: new Date(formData.last_update).toISOString(),
      annual_cost: parseFloat(formData.annual_cost),
      implementation_cost: parseFloat(formData.implementation_cost),
      maintenance_cost: parseFloat(formData.maintenance_cost),
      threats_blocked: parseInt(formData.threats_blocked),
      incidents_prevented: parseInt(formData.incidents_prevented),
      estimated_loss_prevented: parseFloat(formData.estimated_loss_prevented),
      effectiveness: parseInt(formData.effectiveness),
      uptime: parseFloat(formData.uptime),
      risk_reduction: parseInt(formData.risk_reduction),
      coverage: formData.coverage.split(',').map(item => item.trim()).filter(item => item)
    }
    
    onSave(submitData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg.card} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {defense ? 'Edit Defense System' : 'Add New Defense System'}
            </h2>
            <button 
              onClick={onCancel}
              className={`${themeClasses.text.muted} hover:text-red-400 transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                >
                  <option value="network_security">Network Security</option>
                  <option value="human_security">Human Security</option>
                  <option value="data_protection">Data Protection</option>
                  <option value="access_control">Access Control</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="risk_transfer">Risk Transfer</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Effectiveness (%)
                </label>
                <input
                  type="number"
                  name="effectiveness"
                  value={formData.effectiveness}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Risk Reduction (%)
                </label>
                <input
                  type="number"
                  name="risk_reduction"
                  value={formData.risk_reduction}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Annual Cost ($)
                </label>
                <input
                  type="number"
                  name="annual_cost"
                  value={formData.annual_cost}
                  onChange={handleChange}
                  min="0"
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Implementation Cost ($)
                </label>
                <input
                  type="number"
                  name="implementation_cost"
                  value={formData.implementation_cost}
                  onChange={handleChange}
                  min="0"
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Estimated Loss Prevented ($)
                </label>
                <input
                  type="number"
                  name="estimated_loss_prevented"
                  value={formData.estimated_loss_prevented}
                  onChange={handleChange}
                  min="0"
                  required
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Incidents Prevented
                </label>
                <input
                  type="number"
                  name="incidents_prevented"
                  value={formData.incidents_prevented}
                  onChange={handleChange}
                  min="0"
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Threats Blocked
                </label>
                <input
                  type="number"
                  name="threats_blocked"
                  value={formData.threats_blocked}
                  onChange={handleChange}
                  min="0"
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                  Uptime (%)
                </label>
                <input
                  type="number"
                  name="uptime"
                  value={formData.uptime}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className={`
                    w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                    }
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={`
                  w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                  }
                `}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Coverage Areas (comma-separated)
              </label>
              <input
                type="text"
                name="coverage"
                value={formData.coverage}
                onChange={handleChange}
                placeholder="e.g., Network Traffic, DDoS Protection, Intrusion Detection"
                className={`
                  w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                  }
                `}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className={`
                  px-6 py-2 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }
                `}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{defense ? 'Update' : 'Create'} Defense</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Defenses
                     