// frontend/src/components/Events.jsx - FIXED VERSION
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
  X
} from 'lucide-react'

// FIXED: Import from the corrected API service
import { eventsAPI } from '../services/api'

const Events = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [error, setError] = useState('')
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

  // Helper function to safely format numbers
  const safeNumber = (value, defaultValue = 0) => {
    return typeof value === 'number' && !isNaN(value) ? value : defaultValue
  }

  // Helper function to safely format strings
  const safeString = (value, defaultValue = '') => {
    return typeof value === 'string' ? value : defaultValue
  }

  // Helper function to safely format arrays
  const safeArray = (value, defaultValue = []) => {
    return Array.isArray(value) ? value : defaultValue
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterType, filterSeverity])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Loading events...')
      const response = await eventsAPI.getAll()
      console.log('Events API response:', response)
      
      // FIXED: Handle different response formats from backend
      let eventsData = []
      
      if (response && response.success && Array.isArray(response.data)) {
        // Backend returns {success: true, data: [...]}
        eventsData = response.data
      } else if (Array.isArray(response)) {
        // Backend returns array directly
        eventsData = response
      } else if (response && Array.isArray(response.data)) {
        // Backend returns {data: [...]}
        eventsData = response.data
      } else {
        console.warn('Unexpected response format:', response)
        eventsData = []
      }
      
      console.log('Processed events data:', eventsData)
      
      // Transform the data to match frontend expectations with null safety
      const transformedData = eventsData.map(event => ({
        id: event.id || event._id || '',
        name: safeString(event.name),
        type: safeString(event.type),
        severity: safeString(event.severity),
        date: safeString(event.date),
        duration: safeString(event.duration),
        location: safeString(event.location),
        description: safeString(event.description),
        revenueImpact: safeNumber(event.revenueImpact || event.revenue_impact),
        downtime: safeNumber(event.downtime),
        affectedSystems: safeArray(event.affectedSystems || event.affected_systems),
        recoveryTime: safeString(event.recoveryTime || event.recovery_time),
        status: safeString(event.status),
        preventionCost: safeNumber(event.preventionCost || event.prevention_cost),
        actualLoss: safeNumber(event.actualLoss || event.actual_loss),
        employees_affected: safeNumber(event.employees_affected)
      }))
      
      setEvents(transformedData)
      
    } catch (error) {
      console.error('Error loading events:', error)
      setError(`Failed to load events: ${error.message}`)
      // Fallback to sample data on error
      setEvents(getSampleEvents())
    } finally {
      setLoading(false)
    }
  }

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
      }
    ]
  }

  const handleCreateSampleData = async () => {
    try {
      setLoading(true)
      
      // Create sample events manually since the endpoint might not exist
      const sampleEvents = getSampleEvents()
      
      for (const event of sampleEvents) {
        try {
          await eventsAPI.create(event)
        } catch (createError) {
          console.warn('Could not create sample event:', createError)
        }
      }
      
      await loadEvents()
    } catch (err) {
      console.error('Error creating sample data:', err)
      setError('Failed to create sample data')
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
        type: formData.type,
        severity: formData.severity,
        date: new Date(formData.date).toISOString(),
        duration: formData.duration,
        location: formData.location,
        description: formData.description,
        revenue_impact: -Math.abs(Number(formData.revenue_impact)), // Ensure negative
        downtime: Number(formData.downtime),
        affected_systems: formData.affected_systems,
        recovery_time: formData.recovery_time,
        status: formData.status,
        prevention_cost: Number(formData.prevention_cost),
        actual_loss: Number(formData.actual_loss),
        employees_affected: Number(formData.employees_affected)
      }

      let response
      
      if (selectedEvent) {
        // Update existing event
        response = await eventsAPI.update(selectedEvent.id, payload)
      } else {
        // Create new event
        response = await eventsAPI.create(payload)
      }
      
      console.log('Event save response:', response)
      
      // Reload events to get updated data
      await loadEvents()
      
      setShowAddModal(false)
      setSelectedEvent(null)
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      setError(`Error saving event: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (eventId) => {
    if (!eventId) {
      console.error('No event ID provided')
      return
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(eventId)
        
        // Reload events to get updated list
        await loadEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
        setError(`Error deleting event: ${error.message}`)
      }
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

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'cyber_attack': return <Zap className="w-5 h-5" />
      case 'supply_disruption': return <Building className="w-5 h-5" />
      case 'operational_risk': return <AlertTriangle className="w-5 h-5" />
      case 'legal_action': return <Activity className="w-5 h-5" />
      default: return <AlertTriangle className="w-5 h-5" />
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-white text-lg">Loading events...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Risk Events & Incidents</h1>
            <p className="text-gray-400 mt-1">Track security incidents and their business impact</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleCreateSampleData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Sample Data</span>
            </button>
            <button 
              onClick={() => {
                setSelectedEvent(null)
                resetForm()
                setShowAddModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center space-x-2 font-semibold transition-colors text-white"
            >
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.totalLoss / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-400">Total Revenue Loss</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalStats.totalDowntime}h</p>
                <p className="text-xs text-gray-400">Total Downtime</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{events.length}</p>
                <p className="text-xs text-gray-400">Total Incidents</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${(totalStats.preventionSpending / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-400">Prevention Spending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Events List */}
        <div className="space-y-4 pb-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Event Icon */}
                  <div className={`w-12 h-12 ${getEventTypeColor(event.type)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    {getEventTypeIcon(event.type)}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{safeString(event.name)}</h3>
                        <p className="text-sm text-gray-400 mb-2">{safeString(event.description)}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {safeString(event.severity).toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {safeString(event.status).replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Event Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Revenue Impact</p>
                        <p className="text-sm font-bold text-red-400">${Math.abs(safeNumber(event.revenueImpact)).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Downtime</p>
                        <p className="text-sm font-bold text-orange-400">{safeNumber(event.downtime)}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-white">{safeString(event.location)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Date</p>
                        <p className="text-sm font-medium text-white">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
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

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="text-gray-400 hover:text-blue-400 p-2 rounded transition-colors"
                    title="Edit Event"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="text-gray-400 hover:text-red-400 p-2 rounded transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria, or create some sample data</p>
            <button 
              onClick={handleCreateSampleData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Sample Data
            </button>
          </div>
        )}

        {/* Add/Edit Event Modal */}
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

// Event Modal Component
const EventModal = ({ event, formData, onInputChange, onSystemsChange, onSubmit, onCancel, saving }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">
              {event ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cyber_attack">Cyber Attack</option>
                  <option value="supply_disruption">Supply Disruption</option>
                  <option value="operational_risk">Operational Risk</option>
                  <option value="legal_action">Legal Action</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="resolved">Resolved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="investigating">Investigating</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the event details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Revenue Impact ($)</label>
                <input
                  type="number"
                  name="revenue_impact"
                  value={formData.revenue_impact}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prevention Cost ($)</label>
                <input
                  type="number"
                  name="prevention_cost"
                  value={formData.prevention_cost}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Employees Affected</label>
                <input
                  type="number"
                  name="employees_affected"
                  value={formData.employees_affected}
                  onChange={onInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter systems separated by commas (e.g., CRM, Email Server, Database)"
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple systems with commas</p>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button 
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
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