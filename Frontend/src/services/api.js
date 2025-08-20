// // frontend/src/services/api.js - FIXED SCENARIO ID VALIDATION
// import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Add auth token to all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// // Helper function to validate scenario ID
// const validateScenarioId = (id) => {
//   if (!id || id === 'undefined' || id === 'null' || id.toString().trim() === '') {
//     console.warn('Invalid scenario ID:', id)
//     return false
//   }
//   return true
// }

// // SCENARIOS API - FIXED WITH BETTER VALIDATION
// export const scenariosAPI = {
//   getAll: async () => {
//     const response = await api.get('/scenarios/')
//     return response.data
//   },
//   getById: async (id) => {
//     if (!validateScenarioId(id)) {
//       throw new Error(`Invalid scenario ID provided: ${id}`)
//     }
//     console.log('Getting scenario by ID:', id)
//     const response = await api.get(`/scenarios/${id}`)
//     return response.data
//   },
//   create: async (data) => {
//     const response = await api.post('/scenarios/', data)
//     return response.data
//   },
//   update: async (id, data) => {
//     if (!validateScenarioId(id)) {
//       throw new Error(`Invalid scenario ID provided: ${id}`)
//     }
//     const response = await api.put(`/scenarios/${id}`, data)
//     return response.data
//   },
//   delete: async (id) => {
//     if (!validateScenarioId(id)) {
//       throw new Error(`Invalid scenario ID provided: ${id}`)
//     }
//     const response = await api.delete(`/scenarios/${id}`)
//     return response.data
//   },
//   runAnalysis: async (id) => {
//     if (!validateScenarioId(id)) {
//       throw new Error(`Invalid scenario ID provided: ${id}`)
//     }
//     const response = await api.post(`/analysis/scenarios/${id}/run-analysis`)
//     return response.data
//   },
// }

// // RISK EVENTS API - FIXED WITH BETTER VALIDATION
// export const riskEventsAPI = {
//   getByScenario: async (scenarioId) => {
//     if (!validateScenarioId(scenarioId)) {
//       console.warn('Invalid scenario ID for risk events, returning empty array:', scenarioId)
//       return { data: [] }
//     }
//     try {
//       console.log('Getting risk events for scenario:', scenarioId)
//       const response = await api.get(`/scenarios/${scenarioId}/risk-events/`)
//       return response.data
//     } catch (error) {
//       console.warn('Failed to fetch risk events:', error.message)
//       return { data: [] }
//     }
//   },
//   create: async (scenarioId, data) => {
//     if (!validateScenarioId(scenarioId)) {
//       throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
//     }
//     const response = await api.post(`/scenarios/${scenarioId}/risk-events/`, data)
//     return response.data
//   },
//   update: async (scenarioId, id, data) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.put(`/scenarios/${scenarioId}/risk-events/${id}/`, data)
//     return response.data
//   },
//   delete: async (scenarioId, id) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.delete(`/scenarios/${scenarioId}/risk-events/${id}/`)
//     return response.data
//   },
// }

// // BUSINESS ASSETS API - FIXED WITH BETTER VALIDATION
// export const businessAssetsAPI = {
//   getByScenario: async (scenarioId) => {
//     if (!validateScenarioId(scenarioId)) {
//       console.warn('Invalid scenario ID for business assets, returning empty array:', scenarioId)
//       return { data: [] }
//     }
//     try {
//       console.log('Getting business assets for scenario:', scenarioId)
//       const response = await api.get(`/scenarios/${scenarioId}/business-assets/`)
//       return response.data
//     } catch (error) {
//       console.warn('Failed to fetch business assets:', error.message)
//       return { data: [] }
//     }
//   },
//   create: async (scenarioId, data) => {
//     if (!validateScenarioId(scenarioId)) {
//       throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
//     }
//     const response = await api.post(`/scenarios/${scenarioId}/business-assets/`, data)
//     return response.data
//   },
//   update: async (scenarioId, id, data) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.put(`/scenarios/${scenarioId}/business-assets/${id}/`, data)
//     return response.data
//   },
//   delete: async (scenarioId, id) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.delete(`/scenarios/${scenarioId}/business-assets/${id}/`)
//     return response.data
//   },
// }

// // DEFENSE SYSTEMS API - FIXED WITH BETTER VALIDATION
// export const defenseSystemsAPI = {
//   getByScenario: async (scenarioId) => {
//     if (!validateScenarioId(scenarioId)) {
//       console.warn('Invalid scenario ID for defense systems, returning empty array:', scenarioId)
//       return { data: [] }
//     }
//     try {
//       console.log('Getting defense systems for scenario:', scenarioId)
//       const response = await api.get(`/scenarios/${scenarioId}/defense-systems/`)
//       return response.data
//     } catch (error) {
//       console.warn('Failed to fetch defense systems:', error.message)
//       return { data: [] }
//     }
//   },
//   create: async (scenarioId, data) => {
//     if (!validateScenarioId(scenarioId)) {
//       throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
//     }
//     const response = await api.post(`/scenarios/${scenarioId}/defense-systems/`, data)
//     return response.data
//   },
//   update: async (scenarioId, id, data) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.put(`/scenarios/${scenarioId}/defense-systems/${id}/`, data)
//     return response.data
//   },
//   delete: async (scenarioId, id) => {
//     if (!validateScenarioId(scenarioId) || !id) {
//       throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
//     }
//     const response = await api.delete(`/scenarios/${scenarioId}/defense-systems/${id}/`)
//     return response.data
//   },
// }

// // DEFENSES API - FIXED
// export const defensesAPI = {
//   getAll: async () => {
//     const response = await api.get('/defenses/')
//     return response.data
//   },
//   create: async (data) => {
//     const response = await api.post('/defenses/', data)
//     return response.data
//   },
//   update: async (id, data) => {
//     const response = await api.put(`/defenses/${id}`, data)
//     return response.data
//   },
//   delete: async (id) => {
//     const response = await api.delete(`/defenses/${id}`)
//     return response.data
//   },
//   getStats: async () => {
//     const response = await api.get('/defenses/stats/summary')
//     return response.data
//   },
// }

// // EVENTS API - FIXED
// export const eventsAPI = {
//   getAll: async () => {
//     const response = await api.get('/events/')
//     return response.data
//   },
//   create: async (data) => {
//     const response = await api.post('/events/', data)
//     return response.data
//   },
//   update: async (id, data) => {
//     const response = await api.put(`/events/${id}/`, data)
//     return response.data
//   },
//   delete: async (id) => {
//     const response = await api.delete(`/events/${id}/`)
//     return response.data
//   },
// }

// // LOCATIONS API - FIXED
// export const locationsAPI = {
//   getAll: async () => {
//     const response = await api.get('/locations/')
//     return response.data
//   },
//   create: async (data) => {
//     const response = await api.post('/locations/', data)
//     return response.data
//   },
//   update: async (id, data) => {
//     const response = await api.put(`/locations/${id}/`, data)
//     return response.data
//   },
//   delete: async (id) => {
//     const response = await api.delete(`/locations/${id}/`)
//     return response.data
//   },
// }

// // DASHBOARD API - FIXED
// export const dashboardAPI = {
//   getOverview: async () => {
//     const response = await api.get('/dashboard/stats/overview')
//     return response.data
//   },
//   getTrends: async () => {
//     const response = await api.get('/dashboard/stats/trends')
//     return response.data
//   },
//   getRecentActivity: async (limit = 10) => {
//     const response = await api.get(`/dashboard/recent-activity?limit=${limit}`)
//     return response.data
//   },
// }

// export default api






















// frontend/src/services/api.js - COMPLETE AND FfIXED
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Handle auth errors and response logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    // Log error responses
    console.error(`API Error: ${error.response?.status || 'Network'} ${error.config?.url}`, error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('401 error detected, clearing auth')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isAuthenticated')
      
      // Only redirect if we're not already on auth pages
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper function to validate scenario ID
const validateScenarioId = (id) => {
  if (!id || id === 'undefined' || id === 'null' || id.toString().trim() === '') {
    console.warn('Invalid scenario ID:', id)
    return false
  }
  return true
}

// Helper function to handle API responses consistently
const handleApiResponse = (response) => {
  if (response.data) {
    return response.data
  }
  return response
}

// Helper function to handle API errors consistently
const handleApiError = (error, context = '') => {
  console.error(`${context} API Error:`, error.response?.data || error.message)
  
  if (error.response?.data) {
    throw error.response.data
  }
  
  throw {
    success: false,
    detail: error.message || 'An unexpected error occurred',
    status: error.response?.status || 500
  }
}

// SCENARIOS API
export const scenariosAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/scenarios/')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Get All Scenarios')
    }
  },
  
  getById: async (id) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    try {
      const response = await api.get(`/scenarios/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Get Scenario ${id}`)
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/scenarios/', data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Create Scenario')
    }
  },
  
  update: async (id, data) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    try {
      const response = await api.put(`/scenarios/${id}`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Scenario ${id}`)
    }
  },
  
  delete: async (id) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    try {
      const response = await api.delete(`/scenarios/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Scenario ${id}`)
    }
  },
  
  runAnalysis: async (id, simulationData = {}) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    
    try {
      console.log('Running Monte Carlo analysis for scenario:', id)
      const response = await api.post(`/analysis/scenarios/${id}/run-analysis`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Run Analysis for Scenario ${id}`)
    }
  },
}

// DASHBOARD API - FIXED TO MATCH BACKEND ENDPOINTS
export const dashboardAPI = {
  getOverview: async () => {
    try {
      // Use the correct backend endpoint: /dashboard/stats/overview
      const response = await api.get('/dashboard/stats/overview')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Dashboard stats/overview endpoint not available, using scenarios fallback')
        try {
          const scenariosResponse = await api.get('/scenarios/')
          const scenariosData = handleApiResponse(scenariosResponse)
          const scenarios = Array.isArray(scenariosData) ? scenariosData : scenariosData?.data || []
          return {
            success: true,
            data: {
              overview: {
                total_risk_score: scenarios.length > 0 ? scenarios.reduce((sum, s) => sum + (s.risk_score || 0), 0) / scenarios.length : 0,
                active_scenarios: scenarios.filter(s => s.status === 'active').length,
                total_scenarios: scenarios.length,
                critical_events: 0,
                total_events: 0,
                defense_coverage: 0,
                defense_count: 0
              },
              risk_distribution: {},
              recent_activity: { scenarios_updated: 0, new_events: 0 },
              locations_count: 0
            }
          }
        } catch (fallbackError) {
          return { 
            success: true, 
            data: {
              overview: {
                total_risk_score: 0,
                active_scenarios: 0,
                total_scenarios: 0,
                critical_events: 0,
                total_events: 0,
                defense_coverage: 0,
                defense_count: 0
              },
              risk_distribution: {},
              recent_activity: { scenarios_updated: 0, new_events: 0 },
              locations_count: 0
            }
          }
        }
      } else {
        handleApiError(error, 'Dashboard Overview')
      }
    }
  },
  
  getTrends: async () => {
    try {
      // Use the correct backend endpoint: /dashboard/stats/trends
      const response = await api.get('/dashboard/stats/trends')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Dashboard stats/trends endpoint not available')
        return { 
          success: true, 
          data: { 
            monthly_trends: [], 
            total_scenarios: 0, 
            total_events: 0, 
            total_defenses: 0 
          } 
        }
      } else {
        handleApiError(error, 'Dashboard Trends')
      }
    }
  },
  
  getRecentActivity: async (limit = 10) => {
    try {
      // This endpoint path is correct in your backend
      const response = await api.get(`/dashboard/recent-activity?limit=${limit}`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Dashboard recent-activity endpoint not available')
        return { success: true, data: [] }
      } else {
        handleApiError(error, 'Dashboard Recent Activity')
      }
    }
  },
  
  getRiskAnalysis: async () => {
    try {
      // Additional endpoint available in your backend
      const response = await api.get('/dashboard/risk-analysis')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Dashboard risk-analysis endpoint not available')
        return { 
          success: true, 
          data: {
            risk_score_distribution: { low: 0, medium: 0, high: 0, critical: 0 },
            event_severity_analysis: { low: 0, medium: 0, high: 0, critical: 0 },
            defense_effectiveness: { excellent: 0, good: 0, fair: 0, poor: 0 },
            overall_risk_posture: 'low',
            metrics: {
              average_scenario_risk: 0,
              average_defense_effectiveness: 0,
              total_scenarios: 0,
              total_events: 0,
              total_defenses: 0
            }
          }
        }
      } else {
        handleApiError(error, 'Dashboard Risk Analysis')
      }
    }
  }
}

// RISK EVENTS API
export const riskEventsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      return { success: true, data: [] }
    }
    try {
      const response = await api.get(`/scenarios/${scenarioId}/risk-events/`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      return { success: true, data: [] }
    }
  },
  
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    try {
      const response = await api.post(`/scenarios/${scenarioId}/risk-events/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Create Risk Event for Scenario ${scenarioId}`)
    }
  },
  
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.put(`/scenarios/${scenarioId}/risk-events/${id}/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Risk Event ${id} for Scenario ${scenarioId}`)
    }
  },
  
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.delete(`/scenarios/${scenarioId}/risk-events/${id}/`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Risk Event ${id} for Scenario ${scenarioId}`)
    }
  },
}

// BUSINESS ASSETS API
export const businessAssetsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      return { success: true, data: [] }
    }
    try {
      const response = await api.get(`/scenarios/${scenarioId}/business-assets/`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      return { success: true, data: [] }
    }
  },
  
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    try {
      const response = await api.post(`/scenarios/${scenarioId}/business-assets/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Create Business Asset for Scenario ${scenarioId}`)
    }
  },
  
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.put(`/scenarios/${scenarioId}/business-assets/${id}/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Business Asset ${id} for Scenario ${scenarioId}`)
    }
  },
  
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.delete(`/scenarios/${scenarioId}/business-assets/${id}/`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Business Asset ${id} for Scenario ${scenarioId}`)
    }
  },
}

// DEFENSE SYSTEMS API
export const defenseSystemsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      return { success: true, data: [] }
    }
    try {
      const response = await api.get(`/scenarios/${scenarioId}/defense-systems/`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      return { success: true, data: [] }
    }
  },
  
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    try {
      const response = await api.post(`/scenarios/${scenarioId}/defense-systems/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Create Defense System for Scenario ${scenarioId}`)
    }
  },
  
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.put(`/scenarios/${scenarioId}/defense-systems/${id}/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Defense System ${id} for Scenario ${scenarioId}`)
    }
  },
  
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
    }
    try {
      const response = await api.delete(`/scenarios/${scenarioId}/defense-systems/${id}/`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Defense System ${id} for Scenario ${scenarioId}`)
    }
  },
}

// DEFENSES API
export const defensesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/defenses/')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      handleApiError(error, 'Get All Defenses')
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/defenses/', data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Create Defense')
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/defenses/${id}`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Defense ${id}`)
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/defenses/${id}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Defense ${id}`)
    }
  },
  
  getStats: async () => {
    try {
      const response = await api.get('/defenses/stats/summary')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: { coverage_percentage: 0, total_defenses: 0 } }
      }
      handleApiError(error, 'Get Defense Stats')
    }
  },
}

// EVENTS API
export const eventsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/events/')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      handleApiError(error, 'Get All Events')
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/events/', data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Create Event')
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/events/${id}/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Event ${id}`)
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/events/${id}/`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Event ${id}`)
    }
  },
}

// LOCATIONS API
export const locationsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/locations/')
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [] }
      }
      handleApiError(error, 'Get All Locations')
    }
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/locations/', data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Create Location')
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await api.put(`/locations/${id}/`, data)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Update Location ${id}`)
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/locations/${id}/`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Delete Location ${id}`)
    }
  },
}

// ANALYSIS API - ADD THIS TO YOUR api.js
export const analysisAPI = {
  storeResults: async (scenarioId, results) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    try {
      const response = await api.post(`/analysis/scenarios/${scenarioId}/results`, results)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Store Analysis Results for Scenario ${scenarioId}`)
    }
  },

  getResults: async (scenarioId, limit = 10) => {
    if (!validateScenarioId(scenarioId)) {
      return { success: true, data: [], method: 'none' }
    }
    try {
      const response = await api.get(`/analysis/scenarios/${scenarioId}/results?limit=${limit}`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, data: [], results_count: 0 }
      }
      handleApiError(error, `Get Analysis Results for Scenario ${scenarioId}`)
    }
  },

  runAnalysis: async (scenarioId, options = {}) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    try {
      const response = await api.post(`/analysis/scenarios/${scenarioId}/run-analysis`, options)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, `Run Monte Carlo Analysis for Scenario ${scenarioId}`)
    }
  },

  getSummary: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      return { success: true, summary: { total_analyses: 0 } }
    }
    try {
      const response = await api.get(`/analysis/scenarios/${scenarioId}/results/summary`)
      return handleApiResponse(response)
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: true, summary: { total_analyses: 0 } }
      }
      handleApiError(error, `Get Analysis Summary for Scenario ${scenarioId}`)
    }
  }
}
// AUTH API
export const authAPI = {
  login: async (credentials) => {
    try {
      const tempToken = localStorage.getItem('token')
      localStorage.removeItem('token')
      
      const response = await api.post('/auth/login', credentials)
      
      if (tempToken && !response.data?.success) {
        localStorage.setItem('token', tempToken)
      }
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Login')
    }
  },
  
  register: async (userData) => {
    try {
      const tempToken = localStorage.getItem('token')
      localStorage.removeItem('token')
      
      const response = await api.post('/auth/register', userData)
      
      if (tempToken && !response.data?.success) {
        localStorage.setItem('token', tempToken)
      }
      
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Register')
    }
  },
  
  me: async () => {
    try {
      const response = await api.get('/auth/me')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Get Current User')
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return handleApiResponse(response)
    } catch (error) {
      console.error('Logout API error:', error.response?.data || error.message)
      return { success: true, message: 'Logged out locally' }
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Update Profile')
    }
  },
  
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, 'Change Password')
    }
  },
}

// Utility function to test API connectivity
export const testApiConnectivity = async () => {
  const tests = []
  
  // Test public endpoints
  const endpoints = [
    { name: 'Scenarios', fn: () => scenariosAPI.getAll() },
    { name: 'Events', fn: () => eventsAPI.getAll() },
    { name: 'Locations', fn: () => locationsAPI.getAll() },
    { name: 'Defenses', fn: () => defensesAPI.getAll() }
  ]
  
  for (const endpoint of endpoints) {
    try {
      await endpoint.fn()
      tests.push({ name: endpoint.name, status: 'success' })
    } catch (error) {
      tests.push({ 
        name: endpoint.name, 
        status: 'failed', 
        error: error.message || error.detail || 'Unknown error' 
      })
    }
  }
  
  return tests
}

export default api