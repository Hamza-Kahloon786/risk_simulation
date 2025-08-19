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























// frontend/src/services/api.js - FIXED WITH CORRECT MONTE CARLO ENDPOINT
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://selfless-flow-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
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

// SCENARIOS API - FIXED WITH CORRECT ENDPOINTS TO MATCH BACKEND
export const scenariosAPI = {
  getAll: async () => {
    const response = await api.get('/scenarios/')
    return response.data
  },
  getById: async (id) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    console.log('Getting scenario by ID:', id)
    const response = await api.get(`/scenarios/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/scenarios/', data)
    return response.data
  },
  update: async (id, data) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    const response = await api.put(`/scenarios/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    const response = await api.delete(`/scenarios/${id}`)
    return response.data
  },
  // FIXED: Use the correct analysis endpoint from your backend
  runAnalysis: async (id, simulationData = {}) => {
    if (!validateScenarioId(id)) {
      throw new Error(`Invalid scenario ID provided: ${id}`)
    }
    
    console.log('Running Monte Carlo analysis for scenario:', id)
    console.log('Simulation data (optional):', simulationData)
    
    // Use your actual backend endpoint: /api/analysis/scenarios/{id}/run-analysis
    // This endpoint doesn't seem to require simulation data based on your backend code
    const response = await api.post(`/analysis/scenarios/${id}/run-analysis`)
    return response.data
  },
}

// DASHBOARD API - ENHANCED WITH NEW ENDPOINTS
export const dashboardAPI = {
  getOverview: async () => {
    try {
      const response = await api.get('/dashboard/overview')
      return response.data
    } catch (error) {
      console.warn('Dashboard overview endpoint not available, using fallback')
      // Fallback to scenarios endpoint for dashboard data
      const scenariosResponse = await api.get('/scenarios/')
      return scenariosResponse.data
    }
  },
  getTrends: async () => {
    try {
      const response = await api.get('/dashboard/trends')
      return response.data
    } catch (error) {
      console.warn('Dashboard trends endpoint not available')
      return { trendData: [], period: '30', groupBy: 'day' }
    }
  },
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/recent-activity?limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn('Dashboard recent activity endpoint not available')
      return { activities: [] }
    }
  },
}

// RISK EVENTS API - FIXED WITH BETTER VALIDATION
export const riskEventsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      console.warn('Invalid scenario ID for risk events, returning empty array:', scenarioId)
      return { data: [] }
    }
    try {
      console.log('Getting risk events for scenario:', scenarioId)
      const response = await api.get(`/scenarios/${scenarioId}/risk-events/`)
      return response.data
    } catch (error) {
      console.warn('Failed to fetch risk events:', error.message)
      return { data: [] }
    }
  },
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    const response = await api.post(`/scenarios/${scenarioId}/risk-events/`, data)
    return response.data
  },
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.put(`/scenarios/${scenarioId}/risk-events/${id}/`, data)
    return response.data
  },
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or event ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.delete(`/scenarios/${scenarioId}/risk-events/${id}/`)
    return response.data
  },
}

// BUSINESS ASSETS API - FIXED WITH BETTER VALIDATION
export const businessAssetsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      console.warn('Invalid scenario ID for business assets, returning empty array:', scenarioId)
      return { data: [] }
    }
    try {
      console.log('Getting business assets for scenario:', scenarioId)
      const response = await api.get(`/scenarios/${scenarioId}/business-assets/`)
      return response.data
    } catch (error) {
      console.warn('Failed to fetch business assets:', error.message)
      return { data: [] }
    }
  },
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    const response = await api.post(`/scenarios/${scenarioId}/business-assets/`, data)
    return response.data
  },
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.put(`/scenarios/${scenarioId}/business-assets/${id}/`, data)
    return response.data
  },
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or asset ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.delete(`/scenarios/${scenarioId}/business-assets/${id}/`)
    return response.data
  },
}

// DEFENSE SYSTEMS API - FIXED WITH BETTER VALIDATION
export const defenseSystemsAPI = {
  getByScenario: async (scenarioId) => {
    if (!validateScenarioId(scenarioId)) {
      console.warn('Invalid scenario ID for defense systems, returning empty array:', scenarioId)
      return { data: [] }
    }
    try {
      console.log('Getting defense systems for scenario:', scenarioId)
      const response = await api.get(`/scenarios/${scenarioId}/defense-systems/`)
      return response.data
    } catch (error) {
      console.warn('Failed to fetch defense systems:', error.message)
      return { data: [] }
    }
  },
  create: async (scenarioId, data) => {
    if (!validateScenarioId(scenarioId)) {
      throw new Error(`Invalid scenario ID provided: ${scenarioId}`)
    }
    const response = await api.post(`/scenarios/${scenarioId}/defense-systems/`, data)
    return response.data
  },
  update: async (scenarioId, id, data) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.put(`/scenarios/${scenarioId}/defense-systems/${id}/`, data)
    return response.data
  },
  delete: async (scenarioId, id) => {
    if (!validateScenarioId(scenarioId) || !id) {
      throw new Error(`Invalid scenario ID or defense system ID provided: ${scenarioId}, ${id}`)
    }
    const response = await api.delete(`/scenarios/${scenarioId}/defense-systems/${id}/`)
    return response.data
  },
}

// DEFENSES API - FIXED
export const defensesAPI = {
  getAll: async () => {
    const response = await api.get('/defenses/')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/defenses/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/defenses/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/defenses/${id}`)
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/defenses/stats/summary')
    return response.data
  },
}

// EVENTS API - FIXED
export const eventsAPI = {
  getAll: async () => {
    const response = await api.get('/events/')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/events/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/events/${id}/`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/events/${id}/`)
    return response.data
  },
}

// LOCATIONS API - FIXED
export const locationsAPI = {
  getAll: async () => {
    const response = await api.get('/locations/')
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/locations/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/locations/${id}/`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/locations/${id}/`)
    return response.data
  },
}

export default api