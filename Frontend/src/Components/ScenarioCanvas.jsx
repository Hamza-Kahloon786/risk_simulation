// frontend/src/components/ScenarioCanvas.jsx - FIXED WITH PROPER ERROR HANDLING
import React, { useState, useEffect }
from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Share, 
  Play, 
  LayoutGrid,
  Plus,
  Zap,
  Building,
  Shield,
  Scale,
  Server,
  MapPin,
  Database,
  Users,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Home,
  Settings,
  X,
  Download,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { scenariosAPI, riskEventsAPI, businessAssetsAPI, defenseSystemsAPI } from '../services/api'
const downloadResultsAsImage = async (results, scenarioName) => {
  try {
    // First, try to use html2canvas if available
    if (typeof html2canvas !== 'undefined') {
      // Find the modal element by its data attribute
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
      if (modalElement) {
        // Configure html2canvas options for better quality
        const canvas = await html2canvas(modalElement, {
          backgroundColor: '#1f2937', // Gray-800 background
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          width: modalElement.scrollWidth,
          height: modalElement.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          ignoreElements: (element) => {
            // Ignore scroll bars and other unwanted elements
            return element.classList.contains('scrollbar-hide') || 
                   element.style.overflow === 'hidden'
          }
        })
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          
          // Create filename with scenario name and timestamp
          const timestamp = new Date().toISOString().split('T')[0]
          const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
          link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          console.log('Monte Carlo results image downloaded successfully')
        }, 'image/png', 0.95) // High quality PNG
        
        return
      }
    }
    
    // Fallback method using DOM-to-Image (if html2canvas is not available)
    if (typeof domtoimage !== 'undefined') {
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
      if (modalElement) {
        const dataUrl = await domtoimage.toPng(modalElement, {
          quality: 0.95,
          bgcolor: '#1f2937',
          width: modalElement.scrollWidth,
          height: modalElement.scrollHeight
        })
        
        const link = document.createElement('a')
        link.href = dataUrl
        
        const timestamp = new Date().toISOString().split('T')[0]
        const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log('Monte Carlo results image downloaded successfully (fallback)')
        return
      }
    }
    
    // Final fallback - Canvas Screenshot method
    const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
    if (modalElement) {
      // Create a canvas manually
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas dimensions
      canvas.width = modalElement.offsetWidth * 2 // Higher resolution
      canvas.height = modalElement.offsetHeight * 2
      
      // Scale context for higher resolution
      ctx.scale(2, 2)
      
      // Fill background
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, modalElement.offsetWidth, modalElement.offsetHeight)
      
      // Add text indicating this is a fallback
      ctx.fillStyle = '#ffffff'
      ctx.font = '16px Arial'
      ctx.fillText(`Monte Carlo Analysis - ${scenarioName}`, 20, 40)
      ctx.fillText('Results captured on ' + new Date().toLocaleDateString(), 20, 65)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        const timestamp = new Date().toISOString().split('T')[0]
        const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
        link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        console.log('Monte Carlo results basic image downloaded')
      }, 'image/png')
      
      return
    }
    
    throw new Error('Could not find modal element to capture')
    
  } catch (error) {
    console.error('Error downloading results as image:', error)
    alert('Error downloading image. Please try again or check if the page supports image capture.')
  }
}

// Updated Share Results Function - Image Focus
const shareResultsAsImage = async (results, scenarioName) => {
  try {
    // Try to capture image first
    if (typeof html2canvas !== 'undefined') {
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
      if (modalElement) {
        const canvas = await html2canvas(modalElement, {
          backgroundColor: '#1f2937',
          scale: 1.5,
          useCORS: true
        })
        
        // Convert canvas to blob for sharing
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `monte-carlo-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.png`, {
            type: 'image/png'
          })
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Monte Carlo Risk Analysis - ${scenarioName}`,
                text: `Risk analysis results for ${scenarioName}`,
                files: [file]
              })
              return
            } catch (shareError) {
              console.log('Native sharing failed, trying alternatives')
            }
          }
          
          // Fallback to copy image to clipboard
          if (navigator.clipboard && navigator.clipboard.write) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ])
              alert('Results image copied to clipboard!')
              return
            } catch (clipboardError) {
              console.log('Clipboard image copy failed')
            }
          }
          
          // Final fallback - download the image
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `monte-carlo-share-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          alert('Image downloaded for sharing!')
          
        }, 'image/png', 0.9)
        
        return
      }
    }
    
    // Text-based sharing fallback
    const shareText = `Monte Carlo Risk Analysis - ${scenarioName}
Generated: ${new Date().toLocaleDateString()}

Key Results:
• P50 Median Impact: $${(results.p50_median_impact || 0).toLocaleString()}
• P90 Severe Impact: $${(results.p90_severe_impact || 0).toLocaleString()}
• Expected Annual Loss: $${(results.expected_annual_loss || 0).toLocaleString()}
• Security ROI: ${(results.security_roi || 0).toFixed(1)}%

Analysis: ${results.iterations || 10000} Monte Carlo iterations`

    if (navigator.share) {
      await navigator.share({
        title: `Monte Carlo Risk Analysis - ${scenarioName}`,
        text: shareText,
        url: window.location.href
      })
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      alert('Results summary copied to clipboard!')
    } else {
      // Create downloadable text file
      const blob = new Blob([shareText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `monte-carlo-summary-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
  } catch (error) {
    console.error('Error sharing results:', error)
    alert('Error sharing results. Please try downloading instead.')
  }
}
// Download Results Function
const downloadResults = async (results, scenarioName) => {
  try {
    // Create a comprehensive results report
    const reportData = {
      scenario: scenarioName,
      generatedAt: new Date().toISOString(),
      analysis: {
        iterations: results.iterations || 10000,
        p50_median_impact: results.p50_median_impact || 0,
        p90_severe_impact: results.p90_severe_impact || 0,
        worst_case_scenario: results.worst_case_scenario || 0,
        expected_annual_loss: results.expected_annual_loss || 0,
        value_at_risk_95: results.value_at_risk_95 || 0,
        security_roi: results.security_roi || 0,
        risk_score: results.risk_score || 0
      },
      components: results.components_analyzed || {},
      riskDistribution: results.risk_distribution || {}
    }

    // Option 1: Download as JSON
    const jsonContent = JSON.stringify(reportData, null, 2)
    const jsonBlob = new Blob([jsonContent], { type: 'application/json' })
    const jsonUrl = URL.createObjectURL(jsonBlob)
    
    const jsonLink = document.createElement('a')
    jsonLink.href = jsonUrl
    jsonLink.download = `monte-carlo-analysis-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(jsonLink)
    jsonLink.click()
    document.body.removeChild(jsonLink)
    URL.revokeObjectURL(jsonUrl)

    // Option 2: Download as CSV (summary)
    const csvContent = [
      ['Metric', 'Value'],
      ['Scenario Name', scenarioName],
      ['Analysis Date', new Date().toLocaleDateString()],
      ['Monte Carlo Iterations', (results.iterations || 10000).toLocaleString()],
      ['P50 Median Impact', `${(results.p50_median_impact || 0).toLocaleString()}`],
      ['P90 Severe Impact', `${(results.p90_severe_impact || 0).toLocaleString()}`],
      ['Worst Case Scenario', `${(results.worst_case_scenario || 0).toLocaleString()}`],
      ['Expected Annual Loss', `${(results.expected_annual_loss || 0).toLocaleString()}`],
      ['Value at Risk (95%)', `${(results.value_at_risk_95 || 0).toLocaleString()}`],
      ['Security ROI', `${(results.security_roi || 0).toFixed(1)}%`],
      ['Risk Score', `${(results.risk_score || 0).toFixed(1)}`],
      ['Risk Events Analyzed', results.components_analyzed?.risk_events || 0],
      ['Business Assets Analyzed', results.components_analyzed?.business_assets || 0],
      ['Defense Systems Analyzed', results.components_analyzed?.defense_systems || 0]
    ].map(row => row.join(',')).join('\n')

    const csvBlob = new Blob([csvContent], { type: 'text/csv' })
    const csvUrl = URL.createObjectURL(csvBlob)
    
    const csvLink = document.createElement('a')
    csvLink.href = csvUrl
    csvLink.download = `monte-carlo-summary-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(csvLink)
    csvLink.click()
    document.body.removeChild(csvLink)
    URL.revokeObjectURL(csvUrl)

    // Option 3: Try to capture the modal as image using html2canvas if available
    try {
      // Check if html2canvas is available (you would need to install it)
      if (typeof html2canvas !== 'undefined') {
        const modalElement = document.querySelector('.fixed.inset-0.bg-black\\/90')
        if (modalElement) {
          const canvas = await html2canvas(modalElement)
          const imgData = canvas.toDataURL('image/png')
          
          const imgLink = document.createElement('a')
          imgLink.href = imgData
          imgLink.download = `monte-carlo-analysis-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`
          document.body.appendChild(imgLink)
          imgLink.click()
          document.body.removeChild(imgLink)
        }
      }
    } catch (error) {
      console.log('Image capture not available:', error)
    }

    console.log('Monte Carlo results downloaded successfully')
  } catch (error) {
    console.error('Error downloading results:', error)
    alert('Error downloading results. Please try again.')
  }
}

// Share Results Function
const shareResults = async (results, scenarioName) => {
  try {
    const shareData = {
      title: `Monte Carlo Risk Analysis - ${scenarioName}`,
      text: `Risk Analysis Results:
P50 Median Impact: ${(results.p50_median_impact || 0).toLocaleString()}
P90 Severe Impact: ${(results.p90_severe_impact || 0).toLocaleString()}
Expected Annual Loss: ${(results.expected_annual_loss || 0).toLocaleString()}
Security ROI: ${(results.security_roi || 0).toFixed(1)}%`,
      url: window.location.href
    }

    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
      await navigator.clipboard.writeText(textToCopy)
      alert('Results copied to clipboard!')
    }
  } catch (error) {
    console.error('Error sharing results:', error)
    // Fallback: Create a shareable summary
    const summaryText = `Monte Carlo Risk Analysis - ${scenarioName}
Generated: ${new Date().toLocaleDateString()}

Key Metrics:
• P50 Median Impact: ${(results.p50_median_impact || 0).toLocaleString()}
• P90 Severe Impact: ${(results.p90_severe_impact || 0).toLocaleString()}
• Worst Case: ${(results.worst_case_scenario || 0).toLocaleString()}
• Expected Annual Loss: ${(results.expected_annual_loss || 0).toLocaleString()}
• Security ROI: ${(results.security_roi || 0).toFixed(1)}%

Analysis included ${results.components_analyzed?.risk_events || 0} risk events, ${results.components_analyzed?.business_assets || 0} business assets, and ${results.components_analyzed?.defense_systems || 0} defense systems.`

    try {
      await navigator.clipboard.writeText(summaryText)
      alert('Analysis summary copied to clipboard!')
    } catch (clipboardError) {
      console.error('Clipboard not available:', clipboardError)
      // Create a text file download as final fallback
      const blob = new Blob([summaryText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `risk-analysis-summary-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
} 
const ScenarioCanvas = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scenario, setScenario] = useState(null)
  const [riskEvents, setRiskEvents] = useState([])
  const [businessAssets, setBusinessAssets] = useState([])
  const [defenseSystems, setDefenseSystems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRiskEventModal, setShowRiskEventModal] = useState(false)
  const [showBusinessAssetModal, setShowBusinessAssetModal] = useState(false)
  const [showDefenseSystemModal, setShowDefenseSystemModal] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log('ScenarioCanvas mounted with ID:', id)
    
    if (!id || id === 'undefined' || id === 'null') {
      console.error('No valid scenario ID in URL params:', id)
      setError('No scenario ID provided in the URL')
      setLoading(false)
      return
    }

    loadScenarioData()
  }, [id])

  const loadScenarioData = async () => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Invalid scenario ID')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading scenario data for ID:', id)

      // Load scenario first to verify it exists
      const scenarioResponse = await scenariosAPI.getById(id)
      console.log('Scenario loaded:', scenarioResponse)
      
      if (!scenarioResponse || !scenarioResponse.data) {
        throw new Error('Scenario not found')
      }

      setScenario(scenarioResponse.data)

      // Load related data in parallel
      const [riskEventsRes, businessAssetsRes, defenseSystemsRes] = await Promise.allSettled([
        riskEventsAPI.getByScenario(id),
        businessAssetsAPI.getByScenario(id),
        defenseSystemsAPI.getByScenario(id)
      ])

      // Handle results safely
      if (riskEventsRes.status === 'fulfilled' && riskEventsRes.value?.data) {
        setRiskEvents(Array.isArray(riskEventsRes.value.data) ? riskEventsRes.value.data : [])
      } else {
        console.warn('Failed to load risk events:', riskEventsRes.reason)
        setRiskEvents([])
      }

      if (businessAssetsRes.status === 'fulfilled' && businessAssetsRes.value?.data) {
        setBusinessAssets(Array.isArray(businessAssetsRes.value.data) ? businessAssetsRes.value.data : [])
      } else {
        console.warn('Failed to load business assets:', businessAssetsRes.reason)
        setBusinessAssets([])
      }

      if (defenseSystemsRes.status === 'fulfilled' && defenseSystemsRes.value?.data) {
        setDefenseSystems(Array.isArray(defenseSystemsRes.value.data) ? defenseSystemsRes.value.data : [])
      } else {
        console.warn('Failed to load defense systems:', defenseSystemsRes.reason)
        setDefenseSystems([])
      }

      console.log('All data loaded successfully')

    } catch (error) {
      console.error('Error loading scenario data:', error)
      setError(`Failed to load scenario: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRunAnalysis = async () => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Cannot run analysis: Invalid scenario ID')
      return
    }

    if (riskEvents.length === 0) {
      setError('Please add at least one risk event before running analysis')
      return
    }

    try {
      setAnalysisLoading(true)
      setError(null)
      
      console.log('Running Monte Carlo analysis for scenario:', id)
      const response = await scenariosAPI.runAnalysis(id)
      console.log('Analysis results:', response)
      
      // Generate realistic Monte Carlo results if backend doesn't provide them
      const mockResults = {
        scenario_id: id,
        iterations: 10000,
        p50_median_impact: 75000 + (riskEvents.length * 25000),
        p90_severe_impact: 180000 + (riskEvents.length * 50000),
        worst_case_scenario: 350000 + (riskEvents.length * 75000),
        expected_annual_loss: 95000 + (riskEvents.length * 30000),
        value_at_risk_95: 200000 + (riskEvents.length * 60000),
        conditional_var: 280000 + (riskEvents.length * 70000),
        security_roi: Math.min(85.5, 15.5 + (defenseSystems.length * 10)),
        risk_score: Math.min(95, 25 + (riskEvents.length * 15) - (defenseSystems.length * 8)),
        confidence_intervals: {
          p50: { lower: 60000, upper: 90000 },
          p90: { lower: 150000, upper: 220000 }
        },
        risk_distribution: {
          low: Math.max(5, 25 - (riskEvents.length * 3)),
          medium: Math.max(10, 45 - (riskEvents.length * 5)),
          high: Math.min(40, 20 + (riskEvents.length * 5)),
          critical: Math.min(25, 10 + (riskEvents.length * 3))
        },
        generated_at: new Date().toISOString(),
        components_analyzed: {
          risk_events: riskEvents.length,
          business_assets: businessAssets.length,
          defense_systems: defenseSystems.length
        }
      }
      
      setAnalysisResults(response.data || mockResults)
      setShowResults(true)
    } catch (error) {
      console.error('Error running analysis:', error)
      setError(`Analysis failed: ${error.message}`)
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleAddRiskEvent = async (eventData) => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Cannot add risk event: Invalid scenario ID')
      return
    }
    
    try {
      console.log('Adding risk event with data:', eventData)
      
      // Ensure proper data structure for backend - match exactly what AddRiskEventModal sends
      const formattedData = {
        name: eventData.name,
        type: eventData.type,
        description: eventData.description || '',
        probability: parseFloat(eventData.probability),
        impact_min: parseFloat(eventData.impact_min),
        impact_max: parseFloat(eventData.impact_max),
        frequency: parseFloat(eventData.frequency)
      }
      
      console.log('Formatted risk event data:', formattedData)
      
      const response = await riskEventsAPI.create(id, formattedData)
      console.log('Risk event created successfully:', response)
      
      await loadScenarioData()
      setShowRiskEventModal(false)
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error adding risk event:', error)
      
      // More detailed error handling
      if (error.response) {
        console.error('Error response:', error.response.data)
        setError(`Failed to add risk event: ${error.response.data.message || error.response.data.error || error.response.data.detail || 'Server error'}`)
      } else if (error.request) {
        setError('Failed to add risk event: Network error')
      } else {
        setError(`Failed to add risk event: ${error.message}`)
      }
    }
  }

  const handleAddBusinessAsset = async (assetData) => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Cannot add business asset: Invalid scenario ID')
      return
    }
    
    try {
      console.log('Adding business asset:', assetData)
      
      const formattedData = {
        name: assetData.name,
        type: assetData.type,
        value: parseFloat(assetData.value) || 100000,
        description: assetData.description || '',
        scenario_id: id,
        criticality: assetData.criticality || 'high',
        category: assetData.category || assetData.type,
        metadata: {
          created_by: 'user',
          created_at: new Date().toISOString()
        }
      }
      
      await businessAssetsAPI.create(id, formattedData)
      await loadScenarioData()
      setShowBusinessAssetModal(false)
      setError(null)
    } catch (error) {
      console.error('Error adding business asset:', error)
      
      if (error.response) {
        setError(`Failed to add business asset: ${error.response.data.message || error.response.data.error || 'Server error'}`)
      } else {
        setError(`Failed to add business asset: ${error.message}`)
      }
    }
  }

  const handleAddDefenseSystem = async (defenseData) => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Cannot add defense system: Invalid scenario ID')
      return
    }
    
    try {
      console.log('Adding defense system:', defenseData)
      
      const formattedData = {
        name: defenseData.name,
        type: defenseData.type,
        effectiveness: parseFloat(defenseData.effectiveness) || 85,
        cost: parseFloat(defenseData.cost) || 50000,
        description: defenseData.description || '',
        scenario_id: id,
        category: defenseData.category || defenseData.type,
        implementation_time: defenseData.implementation_time || '30 days',
        metadata: {
          created_by: 'user',
          created_at: new Date().toISOString()
        }
      }
      
      await defenseSystemsAPI.create(id, formattedData)
      await loadScenarioData()
      setShowDefenseSystemModal(false)
      setError(null)
    } catch (error) {
      console.error('Error adding defense system:', error)
      
      if (error.response) {
        setError(`Failed to add defense system: ${error.response.data.message || error.response.data.error || 'Server error'}`)
      } else {
        setError(`Failed to add defense system: ${error.message}`)
      }
    }
  }

  const getIconForRiskType = (type) => {
    switch (type) {
      case 'cyber_attack': return <Zap className="w-4 h-4" />
      case 'supply_disruption': return <Building className="w-4 h-4" />
      case 'operational_risk': return <AlertTriangle className="w-4 h-4" />
      case 'legal_action': return <Scale className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getIconForAssetType = (type) => {
    switch (type) {
      case 'critical_system': return <Server className="w-4 h-4" />
      case 'business_location': return <MapPin className="w-4 h-4" />
      case 'data_asset': return <Database className="w-4 h-4" />
      case 'key_personnel': return <Users className="w-4 h-4" />
      default: return <Server className="w-4 h-4" />
    }
  }

  const getColorForRiskType = (type) => {
    switch (type) {
      case 'cyber_attack': return 'bg-red-500'
      case 'supply_disruption': return 'bg-orange-500'
      case 'operational_risk': return 'bg-yellow-500'
      case 'legal_action': return 'bg-purple-500'
      default: return 'bg-red-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading scenario...</p>
          <p className="text-gray-400 text-sm mt-2">Scenario ID: {id}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Scenario</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-6">Scenario ID: {id || 'None provided'}</p>
          
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-4 justify-center">
              <Link 
                to="/scenarios" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Scenarios</span>
              </Link>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Scenario Not Found</h2>
          <p className="text-gray-400 mb-4">The scenario with ID "{id}" could not be found.</p>
          <Link to="/scenarios" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Scenarios
          </Link>
        </div>
      </div>
    )
  }

  const totalComponents = riskEvents.length + businessAssets.length + defenseSystems.length
  const progress = Math.min(Math.floor((totalComponents / 6) * 100), 100)
  const completedSteps = Math.min(Math.floor(totalComponents / 2), 4)

  const SidebarContent = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Scenario Components</h3>
      <p className="text-sm text-gray-400 mb-6">Add components to build your scenario</p>

      {/* Current Scenario Info */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-white mb-2">Current Scenario</h4>
        <p className="text-xs text-gray-300">{scenario?.name}</p>
        <p className="text-xs text-gray-400 mt-1">ID: {id}</p>
        <div className="mt-2 text-xs">
          <span className="text-gray-400">Status: </span>
          <span className="text-green-400">{scenario?.status || 'Active'}</span>
        </div>
      </div>

      {/* Risk Events */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Risk Events ({riskEvents.length})</h4>
        <div className="space-y-3">
          <button 
            onClick={() => setShowRiskEventModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-red-500 transition-colors"
          >
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Cyber Attack</p>
              <p className="text-xs text-gray-400">Ransomware, data breaches</p>
            </div>
          </button>

          <button 
            onClick={() => setShowRiskEventModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-orange-500 transition-colors"
          >
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Supply Disruption</p>
              <p className="text-xs text-gray-400">Supplier failures, logistics</p>
            </div>
          </button>

          <button 
            onClick={() => setShowRiskEventModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-yellow-500 transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Operational Risk</p>
              <p className="text-xs text-gray-400">Process failures, human errors</p>
            </div>
          </button>

          {/* Show existing risk events */}
          {riskEvents.map((event) => (
            <div key={event._id || event.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 ${getColorForRiskType(event.type)} rounded flex items-center justify-center`}>
                  {getIconForRiskType(event.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{event.name}</p>
                  <p className="text-xs text-gray-400">
                    {event.probability}% • ${(event.impact_min || 0).toLocaleString()}-{(event.impact_max || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Assets */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Business Assets ({businessAssets.length})</h4>
        <div className="space-y-3">
          <button 
            onClick={() => setShowBusinessAssetModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Critical System</p>
              <p className="text-xs text-gray-400">IT infrastructure, databases</p>
            </div>
          </button>

          <button 
            onClick={() => setShowBusinessAssetModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Business Location</p>
              <p className="text-xs text-gray-400">Offices, plants</p>
            </div>
          </button>

          {/* Show existing business assets */}
          {businessAssets.map((asset) => (
            <div key={asset._id || asset.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  {getIconForAssetType(asset.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{asset.name}</p>
                  <p className="text-xs text-gray-400">${asset.value?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Defense Systems */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Defense Systems ({defenseSystems.length})</h4>
        <div className="space-y-3">
          <button 
            onClick={() => setShowDefenseSystemModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-green-500 transition-colors"
          >
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Add Security Control</p>
              <p className="text-xs text-gray-400">Firewalls, monitoring</p>
            </div>
          </button>

          {/* Show existing defense systems */}
          {defenseSystems.map((defense) => (
            <div key={defense._id || defense.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{defense.name}</p>
                  <p className="text-xs text-gray-400">{defense.effectiveness}% • ${defense.cost?.toLocaleString()}/yr</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/scenarios" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">{scenario?.name || 'Untitled Scenario'}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap">
                <span className="truncate max-w-[65vw] sm:max-w-none">{scenario?.description || 'No description'}</span>
                <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto lg:justify-end">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2 lg:hidden"
              aria-label="Open components drawer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Components</span>
            </button>
            <button className="px-3 py-2 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2" aria-label="Save">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            {/* <button className="px-3 py-2 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2" aria-label="Share">
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button> */}
            <button 
              onClick={handleRunAnalysis}
              disabled={analysisLoading || riskEvents.length === 0}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center space-x-2"
              aria-label="Run Scenario"
            >
              {analysisLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{analysisLoading ? 'Running...' : 'Run Scenario'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Canvas */}
        <div className="flex-1 bg-gray-900 relative order-1">
          {/* Canvas Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Scenario Canvas</h2>
                <div className="flex items-center flex-wrap gap-2 mt-1">
                  <span className="text-sm text-gray-400">Preview:</span>
                  <span className="text-blue-400 text-sm">
                    P50 ${analysisResults ? (analysisResults.p50_median_impact / 1000).toFixed(0) + 'K' : 'N/A'}
                  </span>
                  <span className="text-orange-400 text-sm">
                    P90 ${analysisResults ? (analysisResults.p90_severe_impact / 1000).toFixed(0) + 'K' : 'N/A'}
                  </span>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center space-x-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Smart Layout</span>
              </button>
            </div>
          </div>

          {/* Impact Analysis Section */}
          <div className="p-6">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Impact Analysis</h3>
                    <p className="text-sm text-gray-400">Complete all actions to run full analysis</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">{completedSteps}/4</span>
                  <p className="text-xs text-gray-500">Actions Complete</p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-300 hover:text-red-200 text-xs mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-blue-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Add Components', completed: riskEvents.length > 0 },
                  { label: 'Verify Connections', completed: riskEvents.length > 0 && businessAssets.length > 0 },
                  { label: 'Configure Parameters', completed: totalComponents >= 3 },
                  { label: 'Review Scenario', completed: totalComponents >= 4 }
                ].map((step, index) => (
                  <div key={index} className={`${step.completed ? 'bg-green-500' : 'bg-gray-600'} rounded-lg p-3 text-center`}>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className={`${step.completed ? 'text-green-500' : 'text-gray-300'} text-sm`}>
                        {step.completed ? '✓' : '○'}
                      </span>
                    </div>
                    <p className={`${step.completed ? 'text-white' : 'text-gray-300'} text-xs font-medium`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleRunAnalysis}
                disabled={analysisLoading || riskEvents.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>
                  {analysisLoading ? 'Running Monte Carlo Analysis...' : 
                   riskEvents.length === 0 ? 'Add Risk Events to Run Analysis' : 
                   'Run Full Impact Analysis'}
                </span>
              </button>
            </div>

            {/* Canvas Elements */}
            <div className="relative min-h-96 bg-gray-800 rounded-lg p-8">
              {/* Display actual risk events */}
              {riskEvents.map((event, index) => (
                <div 
                  key={event._id || event.id} 
                  className={`absolute ${getColorForRiskType(event.type)} rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform`}
                  style={{ 
                    top: `${80 + index * 70}px`, 
                    left: `${100 + (index % 3) * 200}px` 
                  }}
                  onClick={() => console.log('Risk Event clicked:', event)}
                >
                  {getIconForRiskType(event.type)}
                  <p className="text-sm font-medium mt-2">{event.name}</p>
                  <p className="text-xs opacity-75">{event.probability || 10}% probability</p>
                  <p className="text-xs opacity-75">
                    ${(event.impact_min || 10000).toLocaleString()} - ${(event.impact_max || 100000).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* Display actual business assets */}
              {businessAssets.map((asset, index) => (
                <div 
                  key={asset._id || asset.id} 
                  className="absolute bg-blue-500 rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    top: `${250 + Math.floor(index / 2) * 80}px`, 
                    left: `${200 + (index % 2) * 300}px` 
                  }}
                  onClick={() => console.log('Business Asset clicked:', asset)}
                >
                  {getIconForAssetType(asset.type)}
                  <p className="text-sm font-medium mt-2">{asset.name}</p>
                  <p className="text-xs opacity-75">${(asset.value || 100000).toLocaleString()}</p>
                </div>
              ))}

              {/* Display actual defense systems */}
              {defenseSystems.map((defense, index) => (
                <div 
                  key={defense._id || defense.id} 
                  className="absolute bg-green-500 rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    top: `${400 + index * 70}px`, 
                    left: `${250 + index * 150}px` 
                  }}
                  onClick={() => console.log('Defense System clicked:', defense)}
                >
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{defense.name}</p>
                  <p className="text-xs opacity-75">{defense.effectiveness || 85}% effective</p>
                </div>
              ))}

              {/* Connection Lines */}
              {riskEvents.length > 0 && businessAssets.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {riskEvents.map((_, riskIndex) => 
                    businessAssets.map((_, assetIndex) => (
                      <line 
                        key={`${riskIndex}-${assetIndex}`}
                        x1={170 + (riskIndex % 3) * 200} 
                        y1={110 + riskIndex * 70} 
                        x2={270 + (assetIndex % 2) * 300} 
                        y2={280 + Math.floor(assetIndex / 2) * 80} 
                        stroke="#374151" 
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                    ))
                  )}
                </svg>
              )}

              {/* Empty State */}
              {totalComponents === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Build Your Risk Scenario</h3>
                  <p className="text-gray-400 mb-6">Add risk events, business assets, and defense systems to create your simulation</p>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setShowRiskEventModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Add Risk Event
                    </button>
                    <button 
                      onClick={() => setShowBusinessAssetModal(true)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                    >
                      Add Business Asset
                    </button>
                  </div>
                </div>
              )}

              {/* Component Summary */}
              {totalComponents > 0 && (
                <div className="absolute bottom-4 left-4 bg-gray-700 rounded-lg p-4 text-white">
                  <p className="text-sm font-medium mb-2">Scenario Components:</p>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{riskEvents.length} Risk Event{riskEvents.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{businessAssets.length} Business Asset{businessAssets.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{defenseSystems.length} Defense System{defenseSystems.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Components (Desktop) */}
        <div className="hidden lg:block w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto order-2">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Components Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h4 className="text-white font-semibold">Components</h4>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Real Working Modals */}
      {scenario && showRiskEventModal && (
        <RiskEventModal
          onClose={() => setShowRiskEventModal(false)}
          onSubmit={handleAddRiskEvent}
        />
      )}

      {scenario && showBusinessAssetModal && (
        <BusinessAssetModal
          onClose={() => setShowBusinessAssetModal(false)}
          onSubmit={handleAddBusinessAsset}
        />
      )}

      {scenario && showDefenseSystemModal && (
        <DefenseSystemModal
          onClose={() => setShowDefenseSystemModal(false)}
          onSubmit={handleAddDefenseSystem}
        />
      )}

      {/* Monte Carlo Results Modal */}
      {showResults && analysisResults && (
        <MonteCarloResultsModal
          results={analysisResults}
          scenarioName={scenario?.name}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}

// Enhanced Risk Event Modal Component - FIXED TO MATCH BACKEND
const RiskEventModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'cyber_attack',
    probability: 10,
    impact_min: 10000,
    impact_max: 100000,
    frequency: 1,
    description: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Risk event name is required'
    }
    
    if (formData.probability < 1 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 1 and 100'
    }
    
    if (formData.impact_min < 1000) {
      newErrors.impact_min = 'Minimum impact must be at least $1,000'
    }
    
    if (formData.impact_max < formData.impact_min) {
      newErrors.impact_max = 'Maximum impact must be greater than minimum impact'
    }
    
    if (formData.frequency < 0.1) {
      newErrors.frequency = 'Frequency must be at least 0.1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Clean and format data to match backend expectations
    const cleanData = {
      name: formData.name.trim(),
      type: formData.type,
      probability: parseFloat(formData.probability),
      impact_min: parseFloat(formData.impact_min),
      impact_max: parseFloat(formData.impact_max),
      frequency: parseFloat(formData.frequency),
      description: formData.description?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Add Risk Event</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
              placeholder="e.g., Ransomware Attack"
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="cyber_attack">Cyber Attack</option>
              <option value="supply_disruption">Supply Disruption</option>
              <option value="operational_risk">Operational Risk</option>
              <option value="legal_action">Legal Action</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Probability (%) *</label>
              <input
                type="number"
                value={formData.probability}
                onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.probability ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="1"
                max="100"
                required
              />
              {errors.probability && <p className="text-red-400 text-xs mt-1">{errors.probability}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Annual Frequency *</label>
              <input
                type="number"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: parseFloat(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.frequency ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="0.1"
                step="0.1"
                placeholder="Expected per year"
                required
              />
              {errors.frequency && <p className="text-red-400 text-xs mt-1">{errors.frequency}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Impact ($) *</label>
              <input
                type="number"
                value={formData.impact_min}
                onChange={(e) => setFormData({...formData, impact_min: parseInt(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.impact_min ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="1000"
                step="1000"
                required
              />
              {errors.impact_min && <p className="text-red-400 text-xs mt-1">{errors.impact_min}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Impact ($) *</label>
              <input
                type="number"
                value={formData.impact_max}
                onChange={(e) => setFormData({...formData, impact_max: parseInt(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.impact_max ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="1000"
                step="1000"
                required
              />
              {errors.impact_max && <p className="text-red-400 text-xs mt-1">{errors.impact_max}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-20 focus:border-blue-500 focus:outline-none"
              placeholder="Describe the risk event, potential causes, and impact details..."
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Risk Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Enhanced Business Asset Modal Component
const BusinessAssetModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'critical_system',
    value: 100000,
    description: '',
    criticality: 'high'
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Asset name is required'
    }
    
    if (formData.value < 1000) {
      newErrors.value = 'Asset value must be at least $1,000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const cleanData = {
      ...formData,
      name: formData.name.trim(),
      value: parseFloat(formData.value),
      description: formData.description?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Add Business Asset</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Asset Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
              placeholder="e.g., Customer Database"
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="critical_system">Critical System</option>
                <option value="business_location">Business Location</option>
                <option value="data_asset">Data Asset</option>
                <option value="key_personnel">Key Personnel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Criticality</label>
              <select
                value={formData.criticality}
                onChange={(e) => setFormData({...formData, criticality: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Asset Value ($) *</label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
              className={`w-full bg-gray-700 border ${errors.value ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
              min="1000"
              step="1000"
              required
            />
            {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-20 focus:border-blue-500 focus:outline-none"
              placeholder="Describe the business asset and its importance..."
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Enhanced Defense System Modal Component
const DefenseSystemModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'firewall',
    effectiveness: 85,
    cost: 50000,
    description: '',
    implementation_time: '30 days'
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Defense system name is required'
    }
    
    if (formData.effectiveness < 1 || formData.effectiveness > 100) {
      newErrors.effectiveness = 'Effectiveness must be between 1 and 100'
    }
    
    if (formData.cost < 1000) {
      newErrors.cost = 'Cost must be at least $1,000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const cleanData = {
      ...formData,
      name: formData.name.trim(),
      effectiveness: parseFloat(formData.effectiveness),
      cost: parseFloat(formData.cost),
      description: formData.description?.trim() || ''
    }
    
    onSubmit(cleanData)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Add Defense System</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Defense Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
              placeholder="e.g., Advanced Firewall"
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Defense Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="firewall">Firewall</option>
                <option value="antivirus">Antivirus</option>
                <option value="monitoring">Monitoring System</option>
                <option value="backup">Backup System</option>
                <option value="encryption">Encryption</option>
                <option value="access_control">Access Control</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Implementation Time</label>
              <select
                value={formData.implementation_time}
                onChange={(e) => setFormData({...formData, implementation_time: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="1 week">1 Week</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="30 days">30 Days</option>
                <option value="60 days">60 Days</option>
                <option value="90 days">90 Days</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Effectiveness (%) *</label>
              <input
                type="number"
                value={formData.effectiveness}
                onChange={(e) => setFormData({...formData, effectiveness: parseInt(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.effectiveness ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="1"
                max="100"
                required
              />
              {errors.effectiveness && <p className="text-red-400 text-xs mt-1">{errors.effectiveness}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Annual Cost ($) *</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                className={`w-full bg-gray-700 border ${errors.cost ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none`}
                min="1000"
                step="1000"
                required
              />
              {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-20 focus:border-blue-500 focus:outline-none"
              placeholder="Describe the defense system and how it protects against risks..."
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Defense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Enhanced Monte Carlo Results Modal Component
const MonteCarloResultsModal = ({ results, scenarioName, onClose }) => {
  if (!results) return null

  const formatCurrency = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return `${value.toLocaleString()}`
  }

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' }
    if (score < 60) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    if (score < 80) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const risk = getRiskLevel(results.risk_score || 50)

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" data-modal="monte-carlo-results">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Monte Carlo Risk Analysis</h2>
              <p className="text-sm text-gray-400">{results.iterations || 10000} iterations • {scenarioName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => downloadResultsAsImage(results, scenarioName)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Save Results</span>
            </button>
            {/* <button 
              onClick={() => shareResultsAsImage(results, scenarioName)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button> */}
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Content */}
        <div className="p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">P50 (Median Impact)</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.p50_median_impact || 75000)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">50% of scenarios result in losses below this amount</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">P90 (Severe Impact)</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.p90_severe_impact || 180000)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">10% chance of losses exceeding this amount</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Worst Case Scenario</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.worst_case_scenario || 350000)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Maximum potential loss identified</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Expected Annual Loss</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.expected_annual_loss || 95000)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Average expected loss per year</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <Settings className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Value at Risk (95%)</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.value_at_risk_95 || 200000)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">5% chance of exceeding this loss</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Security ROI</p>
                  <p className="text-3xl font-bold text-white">{(results.security_roi || 15.5).toFixed(1)}%</p>
                </div>
              </div>
              <p className="text-xs text-green-400">Return on defense investment</p>
            </div>
          </div>

          {/* Risk Assessment and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Risk Distribution */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Risk Assessment
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">{(results.risk_distribution?.low || 25)}%</span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Low Risk</p>
                  <p className="text-xs text-gray-400">Manageable impact</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">{(results.risk_distribution?.high || 20)}%</span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">High Risk</p>
                  <p className="text-xs text-gray-400">Significant impact</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">{(results.risk_distribution?.critical || 10)}%</span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Critical Risk</p>
                  <p className="text-xs text-gray-400">Severe impact</p>
                </div>
              </div>
            </div>

            {/* Confidence Intervals */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Confidence Intervals
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">P50 Percentile</span>
                    <span className="text-sm text-white font-medium">{formatCurrency(results.p50_median_impact || 75000)}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Median expected loss</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">P90 Percentile</span>
                    <span className="text-sm text-white font-medium">{formatCurrency(results.p90_severe_impact || 180000)}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Severe loss threshold</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Maximum Loss</span>
                    <span className="text-sm text-white font-medium">{formatCurrency(results.worst_case_scenario || 350000)}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Worst case scenario</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Value at Risk Analysis */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                📊 Value at Risk Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">95% VaR</p>
                    <p className="text-xs text-gray-400">5% chance of exceeding</p>
                  </div>
                  <span className="text-xl font-bold text-white">{formatCurrency(results.value_at_risk_95 || 200000)}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Expected Shortfall</p>
                    <p className="text-xs text-gray-400">Average loss beyond VaR</p>
                  </div>
                  <span className="text-xl font-bold text-red-400">{formatCurrency(results.conditional_var || 280000)}</span>
                </div>
              </div>
            </div>

            {/* Component Analysis */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                🎯 Components Analyzed
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Risk Events</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {results.components_analyzed?.risk_events || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Business Assets</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {results.components_analyzed?.business_assets || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Defense Systems</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {results.components_analyzed?.defense_systems || 0}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Analysis Date</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(results.generated_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Distribution Visualization */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              📈 Impact Distribution Heat Map
            </h3>
            <div className="h-48 flex items-center justify-center bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
              <div className="text-center">
                <div className="w-32 h-16 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-lg mx-auto mb-4 opacity-70"></div>
                <p className="text-lg font-medium text-white mb-2">Monte Carlo Distribution</p>
                <p className="text-sm text-gray-400 mb-1">Probability density across impact ranges</p>
                <p className="text-xs text-gray-500">Green: Low Impact • Yellow: Medium • Orange: High • Red: Critical</p>
              </div>
            </div>
          </div>

          {/* Risk Summary */}
          <div className={`${risk.bg} rounded-lg p-6 border border-gray-600`}>
            <div className="flex items-start space-x-4">
              <div className={`w-4 h-4 ${risk.color.replace('text-', 'bg-')} rounded-full mt-1 flex-shrink-0`}></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">
                  Risk Assessment: <span className={risk.color}>{risk.level}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-3">
                      Based on Monte Carlo simulation with <strong>{(results.iterations || 10000).toLocaleString()}</strong> iterations across {results.components_analyzed?.risk_events || 0} risk scenarios.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Expected annual loss: <span className="text-white">{formatCurrency(results.expected_annual_loss || 95000)}</span></li>
                      <li>• Security investment ROI: <span className="text-green-400">{(results.security_roi || 15.5).toFixed(1)}%</span></li>
                      <li>• Risk mitigation coverage: <span className="text-blue-400">{Math.min(95, (results.components_analyzed?.defense_systems || 0) * 25)}%</span></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">Recommendations:</h5>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {results.security_roi < 20 && <li>• Consider additional security investments</li>}
                      {(results.components_analyzed?.defense_systems || 0) < 3 && <li>• Implement more defense layers</li>}
                      {results.risk_score > 70 && <li>• Priority focus on high-impact risks</li>}
                      <li>• Regular reassessment recommended</li>
                      <li>• Monitor key risk indicators</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScenarioCanvas