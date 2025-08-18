import React, { useState, useEffect } from 'react'
import { 
  Zap, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  DollarSign,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  Activity,
  Clock,
  Building,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Save,
  X,
  Menu,
  MoreVertical
} from 'lucide-react'

const Events = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    type: 'cyber_attack',
    severity: 'medium',
    date: '',
    duration: '',
    location: '',
    description: '',
    revenue_impact: 0,
    downtime: 0,
    affected_systems: [],
    recovery_time: '',
    status: 'resolved',
    prevention_cost: 0,
    actual_loss: 0,
    employees_affected: 0
  })

  // Helper functions
  const safeNumber = (value, defaultValue = 0) => {
    return typeof value === 'number' && !isNaN(value) ? value : defaultValue
  }

  const safeString = (value, defaultValue = '') => {
    return typeof value === 'string' ? value : defaultValue
  }

  const safeArray = (value, defaultValue = []) => {
    return Array.isArray(value) ? value : defaultValue
  }

  // Sample data
  const getSampleEvents = () => {
    return [
      {
        id: '1',
        name: 'Ransomware Attack - NYC Office',
        type: 'cyber_attack',
        severity: 'critical',
        date: '2024-02-15',
        duration: '48 hours',
        location: 'New York Headquarters',
        description: 'Advanced ransomware infiltrated through phishing email, encrypted critical databases',
        revenueImpact: -850000,
        downtime: 48,
        affectedSystems: ['CRM', 'Financial Database', 'Email Server'],
        recoveryTime: '24 hours',
        status: 'resolved',
        preventionCost: 80000,
        actualLoss: 450000,
        employees_affected: 45
      },
      {
        id: '2',
        name: 'Power Grid Failure',
        type: 'operational_risk',
        severity: 'medium',
        date: '2024-01-20',
        duration: '6 hours',
        location: 'London Office',
        description: 'Regional power outage affected office operations, backup generators failed after 2 hours',
        revenueImpact: -125000,
        downtime: 6,
        affectedSystems: ['All Office Systems', 'VoIP'],
        recoveryTime: '6 hours',
        status: 'resolved',
        preventionCost: 15000,
        actualLoss: 125000,
        employees_affected: 120
      },
      {
        id: '3',
        name: 'Data Breach Investigation',
        type: 'cyber_attack',
        severity: 'high',
        date: '2024-03-10',
        duration: '72 hours',
        location: 'Data Center A',
        description: 'Unauthorized access detected in customer database, investigation ongoing',
        revenueImpact: -320000,
        downtime: 12,
        affectedSystems: ['Customer Database', 'API Gateway'],
        recoveryTime: '48 hours',
        status: 'investigating',
        preventionCost: 45000,
        actualLoss: 280000,
        employees_affected: 25
      },
      {
        id: '4',
        name: 'Supply Chain Disruption',
        type: 'supply_disruption',
        severity: 'high',
        date: '2024-03-05',
        duration: '5 days',
        location: 'Manufacturing Plant',
        description: 'Key supplier factory closure due to natural disaster affected production',
        revenueImpact: -750000,
        downtime: 120,
        affectedSystems: ['Production Line', 'Inventory Management'],
        recoveryTime: '72 hours',
        status: 'in_progress',
        preventionCost: 25000,
        actualLoss: 600000,
        employees_affected: 200
      }
    ]
  }

  useEffect(() => {
    setEvents(getSampleEvents())
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterType, filterSeverity])

  const filterEvents = () => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event => 
        safeString(event.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeString(event.location).toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeString(event.description).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(event => event.severity === filterSeverity)
    }

    setFilteredEvents(filtered)
  }

  const handleCreateSampleData = () => {
    setEvents(getSampleEvents())
    setError('')
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        revenueImpact: -Math.abs(Number(formData.revenue_impact)),
        downtime: Number(formData.downtime),
        preventionCost: Number(formData.prevention_cost),
        actualLoss: Number(formData.actual_loss),
        employees_affected: Number(formData.employees_affected),
        affectedSystems: formData.affected_systems
      }

      if (selectedEvent) {
        setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : e))
      } else {
        setEvents(prev => [...prev, newEvent])
      }
      
      setShowAddModal(false)
      setSelectedEvent(null)
      resetForm()
    } catch (error) {
      setError(`Error saving event: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId))
    }
  }

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setFormData({
      name: safeString(event.name),
      type: safeString(event.type, 'cyber_attack'),
      severity: safeString(event.severity, 'medium'),
      date: event.date ? event.date.split('T')[0] : '',
      duration: safeString(event.duration),
      location: safeString(event.location),
      description: safeString(event.description),
      revenue_impact: Math.abs(safeNumber(event.revenueImpact)),
      downtime: safeNumber(event.downtime),
      affected_systems: safeArray(event.affectedSystems),
      recovery_time: safeString(event.recoveryTime),
      status: safeString(event.status, 'resolved'),
      prevention_cost: safeNumber(event.preventionCost),
      actual_loss: safeNumber(event.actualLoss),
      employees_affected: safeNumber(event.employees_affected)
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'cyber_attack',
      severity: 'medium',
      date: '',
      duration: '',
      location: '',
      description: '',
      revenue_impact: 0,
      downtime: 0,
      affected_systems: [],
      recovery_time: '',
      status: 'resolved',
      prevention_cost: 0,
      actual_loss: 0,
      employees_affected: 0
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSystemsChange = (e) => {
    const systems = e.target.value.split(',').map(s => s.trim()).filter(s => s)
    setFormData(prev => ({
      ...prev,
      affected_systems: systems
    }))
  }

  const toggleMobileMenu = (eventId) => {
    setShowMobileMenu(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }))
  }

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'cyber_attack': return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'supply_disruption': return <Building className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'operational_risk': return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'legal_action': return <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
      default: return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'cyber_attack': return 'bg-red-500'
      case 'supply_disruption': return 'bg-orange-500'
      case 'operational_risk': return 'bg-yellow-500'
      case 'legal_action': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'low': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400'
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const totalStats = events.reduce((acc, event) => ({
    totalLoss: acc.totalLoss + Math.abs(safeNumber(event.revenueImpact)),
    totalDowntime: acc.totalDowntime + safeNumber(event.downtime),
    affectedEmployees: acc.affectedEmployees + safeNumber(event.employees_affected),
    preventionSpending: acc.preventionSpending + safeNumber(event.preventionCost)
  }), {
    totalLoss: 0,
    totalDowntime: 0,
    affectedEmployees: 0,
    preventionSpending: 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-500" />
          <span className="text-white text-base sm:text-lg">Loading events...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Mobile-First Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Risk Events & Incidents
              </h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Track security incidents and their business impact
              </p>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button 
                onClick={handleCreateSampleData}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sample Data</span>
              </button>
              <button 
                onClick={() => {
                  setSelectedEvent(null)
                  resetForm()
                  setShowAddModal(true)
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 font-semibold transition-colors text-white text-sm sm:text-base touch-manipulation"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Responsive Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  ${(totalStats.totalLoss / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-400">Total Revenue Loss</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  {totalStats.totalDowntime}h
                </p>
                <p className="text-xs text-gray-400">Total Downtime</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {events.length}
                </p>
                <p className="text-xs text-gray-400">Total Incidents</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-700 col-span-2 lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  ${(totalStats.preventionSpending / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-400">Prevention Spending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Filters */}
        <div className="mb-4 sm:mb-6">
          {/* Search Bar */}
          <div className="relative mb-3 sm:mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center space-x-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white hover:bg-gray-600 transition-colors touch-manipulation"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden sm:flex flex-1 gap-3 sm:gap-4">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
              >
                <option value="all">All Types</option>
                <option value="cyber_attack">Cyber Attacks</option>
                <option value="supply_disruption">Supply Disruption</option>
                <option value="operational_risk">Operational Risk</option>
                <option value="legal_action">Legal Action</option>
              </select>

              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="sm:hidden mt-3 space-y-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
              >
                <option value="all">All Types</option>
                <option value="cyber_attack">Cyber Attacks</option>
                <option value="supply_disruption">Supply Disruption</option>
                <option value="operational_risk">Operational Risk</option>
                <option value="legal_action">Legal Action</option>
              </select>

              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Responsive Events List */}
        <div className="space-y-3 sm:space-y-4 pb-6 sm:pb-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 ${getEventTypeColor(event.type)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white mb-1 break-words">
                          {safeString(event.name)}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {safeString(event.severity).toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {safeString(event.status).replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => toggleMobileMenu(event.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors touch-manipulation"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showMobileMenu[event.id] && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button 
                            onClick={() => {
                              handleEdit(event)
                              toggleMobileMenu(event.id)
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gray-600 flex items-center space-x-2 touch-manipulation"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => {
                              handleDelete(event.id)
                              toggleMobileMenu(event.id)
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-600 flex items-center space-x-2 touch-manipulation"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 break-words">
                    {safeString(event.description)}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Revenue Impact</p>
                      <p className="text-sm font-bold text-red-400">
                        ${Math.abs(safeNumber(event.revenueImpact)).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Downtime</p>
                      <p className="text-sm font-bold text-orange-400">
                        {safeNumber(event.downtime)}h
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Location</p>
                      <p className="text-sm font-medium text-white truncate">
                        {safeString(event.location)}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-medium text-white">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Affected Systems */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Affected Systems:</p>
                    <div className="flex flex-wrap gap-1">
                      {safeArray(event.affectedSystems).slice(0, 3).map((system, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {system}
                        </span>
                      ))}
                      {safeArray(event.affectedSystems).length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          +{safeArray(event.affectedSystems).length - 3} more
                        </span>
                      )}
                      {safeArray(event.affectedSystems).length === 0 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">None specified</span>
                      )}
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400 mb-1">Prevention</p>
                      <p className="font-medium text-blue-400">${safeNumber(event.preventionCost).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Actual Loss</p>
                      <p className="font-medium text-red-400">${safeNumber(event.actualLoss).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Recovery</p>
                      <p className="font-medium text-white">{safeString(event.recoveryTime) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Layout */}
              <div className="hidden sm:block p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Event Icon */}
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${getEventTypeColor(event.type)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                      {getEventTypeIcon(event.type)}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-semibold text-white mb-1 break-words">
                            {safeString(event.name)}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2 break-words">
                            {safeString(event.description)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {safeString(event.severity).toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {safeString(event.status).replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Event Metrics Grid */}
                      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-400">Revenue Impact</p>
                          <p className="text-sm font-bold text-red-400">
                            ${Math.abs(safeNumber(event.revenueImpact)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Downtime</p>
                          <p className="text-sm font-bold text-orange-400">{safeNumber(event.downtime)}h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-sm font-medium text-white truncate">{safeString(event.location)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="text-sm font-medium text-white">
                            {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Duration</p>
                          <p className="text-sm font-medium text-white">{safeString(event.duration)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Affected Staff</p>
                          <p className="text-sm font-medium text-white">{safeNumber(event.employees_affected)}</p>
                        </div>
                      </div>

                      {/* Affected Systems */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Affected Systems:</p>
                        <div className="flex flex-wrap gap-2">
                          {safeArray(event.affectedSystems).map((system, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                              {system}
                            </span>
                          ))}
                          {safeArray(event.affectedSystems).length === 0 && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">None specified</span>
                          )}
                        </div>
                      </div>

                      {/* Financial Impact */}
                      <div className="border-t border-gray-700 pt-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Prevention Cost</p>
                            <p className="font-medium text-blue-400">${safeNumber(event.preventionCost).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Actual Loss</p>
                            <p className="font-medium text-red-400">${safeNumber(event.actualLoss).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Recovery Time</p>
                            <p className="font-medium text-white">{safeString(event.recoveryTime) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="text-gray-400 hover:text-blue-400 p-2 rounded transition-colors touch-manipulation"
                      title="Edit Event"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="text-gray-400 hover:text-red-400 p-2 rounded transition-colors touch-manipulation"
                      title="Delete Event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base px-4">
              Try adjusting your search or filter criteria, or create some sample data
            </p>
            <button 
              onClick={handleCreateSampleData}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base touch-manipulation"
            >
              Create Sample Data
            </button>
          </div>
        )}

        {/* Responsive Add/Edit Event Modal */}
        {showAddModal && (
          <EventModal
            event={selectedEvent}
            formData={formData}
            onInputChange={handleInputChange}
            onSystemsChange={handleSystemsChange}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowAddModal(false)
              setSelectedEvent(null)
              resetForm()
            }}
            saving={saving}
          />
        )}
      </div>
    </div>
  )
}

// Responsive Event Modal Component
const EventModal = ({ event, formData, onInputChange, onSystemsChange, onSubmit, onCancel, saving }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {event ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 touch-manipulation"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Form Fields - Mobile First */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  required
                  placeholder="Enter event name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                >
                  <option value="cyber_attack">Cyber Attack</option>
                  <option value="supply_disruption">Supply Disruption</option>
                  <option value="operational_risk">Operational Risk</option>
                  <option value="legal_action">Legal Action</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                >
                  <option value="resolved">Resolved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="investigating">Investigating</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  required
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  required
                  placeholder="e.g., 2 hours, 1 day"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows="3"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                placeholder="Describe the event details..."
              />
            </div>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Revenue Impact ($)</label>
                <input
                  type="number"
                  name="revenue_impact"
                  value={formData.revenue_impact}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  min="0"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Downtime (hours)</label>
                <input
                  type="number"
                  name="downtime"
                  value={formData.downtime}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prevention Cost ($)</label>
                <input
                  type="number"
                  name="prevention_cost"
                  value={formData.prevention_cost}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  min="0"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Actual Loss ($)</label>
                <input
                  type="number"
                  name="actual_loss"
                  value={formData.actual_loss}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Employees Affected</label>
                <input
                  type="number"
                  name="employees_affected"
                  value={formData.employees_affected}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Recovery Time</label>
                <input
                  type="text"
                  name="recovery_time"
                  value={formData.recovery_time}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  placeholder="e.g., 4 hours, Ongoing"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Affected Systems</label>
              <input
                type="text"
                value={formData.affected_systems.join(', ')}
                onChange={onSystemsChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                placeholder="Enter systems separated by commas (e.g., CRM, Email Server, Database)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple systems with commas</p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-700">
              <button 
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base touch-manipulation"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{event ? 'Update Event' : 'Add Event'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Events