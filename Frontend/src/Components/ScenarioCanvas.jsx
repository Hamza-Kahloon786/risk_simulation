// // frontend/src/components/ScenarioCanvas.jsx - FIXED WITH PROPER ERROR HANDLING
// import React, { useState, useEffect }
// from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { 
//   ArrowLeft, 
//   Save, 
//   Share, 
//   Play, 
//   LayoutGrid,
//   Plus,
//   Zap,
//   Building,
//   Shield,
//   Scale,
//   Server,
//   MapPin,
//   Database,
//   Users,
//   BarChart3,
//   RefreshCw,
//   AlertTriangle,
//   Home,
//   Settings,
//   X,
//   Download,
//   TrendingUp,
//   DollarSign
// } from 'lucide-react'
// import { scenariosAPI, riskEventsAPI, businessAssetsAPI, defenseSystemsAPI } from '../services/api'
// const downloadResultsAsImage = async (results, scenarioName) => {
//   try {
//     // First, try to use html2canvas if available
//     if (typeof html2canvas !== 'undefined') {
//       // Find the modal element by its data attribute
//       const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
//       if (modalElement) {
//         // Configure html2canvas options for better quality
//         const canvas = await html2canvas(modalElement, {
//           backgroundColor: '#1f2937', // Gray-800 background
//           scale: 2, // Higher resolution
//           useCORS: true,
//           allowTaint: true,
//           width: modalElement.scrollWidth,
//           height: modalElement.scrollHeight,
//           scrollX: 0,
//           scrollY: 0,
//           ignoreElements: (element) => {
//             // Ignore scroll bars and other unwanted elements
//             return element.classList.contains('scrollbar-hide') || 
//                    element.style.overflow === 'hidden'
//           }
//         })
        
//         // Convert canvas to blob and download
//         canvas.toBlob((blob) => {
//           const url = URL.createObjectURL(blob)
//           const link = document.createElement('a')
//           link.href = url
          
//           // Create filename with scenario name and timestamp
//           const timestamp = new Date().toISOString().split('T')[0]
//           const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
//           link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
          
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//           URL.revokeObjectURL(url)
          
//           console.log('Monte Carlo results image downloaded successfully')
//         }, 'image/png', 0.95) // High quality PNG
        
//         return
//       }
//     }
    
//     // Fallback method using DOM-to-Image (if html2canvas is not available)
//     if (typeof domtoimage !== 'undefined') {
//       const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
//       if (modalElement) {
//         const dataUrl = await domtoimage.toPng(modalElement, {
//           quality: 0.95,
//           bgcolor: '#1f2937',
//           width: modalElement.scrollWidth,
//           height: modalElement.scrollHeight
//         })
        
//         const link = document.createElement('a')
//         link.href = dataUrl
        
//         const timestamp = new Date().toISOString().split('T')[0]
//         const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
//         link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
        
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
        
//         console.log('Monte Carlo results image downloaded successfully (fallback)')
//         return
//       }
//     }
    
//     // Final fallback - Canvas Screenshot method
//     const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
//     if (modalElement) {
//       // Create a canvas manually
//       const canvas = document.createElement('canvas')
//       const ctx = canvas.getContext('2d')
      
//       // Set canvas dimensions
//       canvas.width = modalElement.offsetWidth * 2 // Higher resolution
//       canvas.height = modalElement.offsetHeight * 2
      
//       // Scale context for higher resolution
//       ctx.scale(2, 2)
      
//       // Fill background
//       ctx.fillStyle = '#1f2937'
//       ctx.fillRect(0, 0, modalElement.offsetWidth, modalElement.offsetHeight)
      
//       // Add text indicating this is a fallback
//       ctx.fillStyle = '#ffffff'
//       ctx.font = '16px Arial'
//       ctx.fillText(`Monte Carlo Analysis - ${scenarioName}`, 20, 40)
//       ctx.fillText('Results captured on ' + new Date().toLocaleDateString(), 20, 65)
      
//       // Convert to blob and download
//       canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob)
//         const link = document.createElement('a')
//         link.href = url
        
//         const timestamp = new Date().toISOString().split('T')[0]
//         const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
//         link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`
        
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         URL.revokeObjectURL(url)
        
//         console.log('Monte Carlo results basic image downloaded')
//       }, 'image/png')
      
//       return
//     }
    
//     throw new Error('Could not find modal element to capture')
    
//   } catch (error) {
//     console.error('Error downloading results as image:', error)
//     alert('Error downloading image. Please try again or check if the page supports image capture.')
//   }
// }

// // Updated Share Results Function - Image Focus
// const shareResultsAsImage = async (results, scenarioName) => {
//   try {
//     // Try to capture image first
//     if (typeof html2canvas !== 'undefined') {
//       const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
//       if (modalElement) {
//         const canvas = await html2canvas(modalElement, {
//           backgroundColor: '#1f2937',
//           scale: 1.5,
//           useCORS: true
//         })
        
//         // Convert canvas to blob for sharing
//         canvas.toBlob(async (blob) => {
//           const file = new File([blob], `monte-carlo-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.png`, {
//             type: 'image/png'
//           })
          
//           if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
//             try {
//               await navigator.share({
//                 title: `Monte Carlo Risk Analysis - ${scenarioName}`,
//                 text: `Risk analysis results for ${scenarioName}`,
//                 files: [file]
//               })
//               return
//             } catch (shareError) {
//               console.log('Native sharing failed, trying alternatives')
//             }
//           }
          
//           // Fallback to copy image to clipboard
//           if (navigator.clipboard && navigator.clipboard.write) {
//             try {
//               await navigator.clipboard.write([
//                 new ClipboardItem({ 'image/png': blob })
//               ])
//               alert('Results image copied to clipboard!')
//               return
//             } catch (clipboardError) {
//               console.log('Clipboard image copy failed')
//             }
//           }
          
//           // Final fallback - download the image
//           const url = URL.createObjectURL(blob)
//           const link = document.createElement('a')
//           link.href = url
//           link.download = `monte-carlo-share-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.png`
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//           URL.revokeObjectURL(url)
//           alert('Image downloaded for sharing!')
          
//         }, 'image/png', 0.9)
        
//         return
//       }
//     }
    
//     // Text-based sharing fallback
//     const shareText = `Monte Carlo Risk Analysis - ${scenarioName}
// Generated: ${new Date().toLocaleDateString()}

// Key Results:
// • P50 Median Impact: $${(results.p50_median_impact || 0).toLocaleString()}
// • P90 Severe Impact: $${(results.p90_severe_impact || 0).toLocaleString()}
// • Expected Annual Loss: $${(results.expected_annual_loss || 0).toLocaleString()}
// • Security ROI: ${(results.security_roi || 0).toFixed(1)}%

// Analysis: ${results.iterations || 10000} Monte Carlo iterations`

//     if (navigator.share) {
//       await navigator.share({
//         title: `Monte Carlo Risk Analysis - ${scenarioName}`,
//         text: shareText,
//         url: window.location.href
//       })
//     } else if (navigator.clipboard) {
//       await navigator.clipboard.writeText(shareText)
//       alert('Results summary copied to clipboard!')
//     } else {
//       // Create downloadable text file
//       const blob = new Blob([shareText], { type: 'text/plain' })
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `monte-carlo-summary-${scenarioName.replace(/\s+/g, '-').toLowerCase()}.txt`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       URL.revokeObjectURL(url)
//     }
    
//   } catch (error) {
//     console.error('Error sharing results:', error)
//     alert('Error sharing results. Please try downloading instead.')
//   }
// }
// // Download Results Function
// const downloadResults = async (results, scenarioName) => {
//   try {
//     // Create a comprehensive results report
//     const reportData = {
//       scenario: scenarioName,
//       generatedAt: new Date().toISOString(),
//       analysis: {
//         iterations: results.iterations || 10000,
//         p50_median_impact: results.p50_median_impact || 0,
//         p90_severe_impact: results.p90_severe_impact || 0,
//         worst_case_scenario: results.worst_case_scenario || 0,
//         expected_annual_loss: results.expected_annual_loss || 0,
//         value_at_risk_95: results.value_at_risk_95 || 0,
//         security_roi: results.security_roi || 0,
//         risk_score: results.risk_score || 0
//       },
//       components: results.components_analyzed || {},
//       riskDistribution: results.risk_distribution || {}
//     }

//     // Option 1: Download as JSON
//     const jsonContent = JSON.stringify(reportData, null, 2)
//     const jsonBlob = new Blob([jsonContent], { type: 'application/json' })
//     const jsonUrl = URL.createObjectURL(jsonBlob)
    
//     const jsonLink = document.createElement('a')
//     jsonLink.href = jsonUrl
//     jsonLink.download = `monte-carlo-analysis-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
//     document.body.appendChild(jsonLink)
//     jsonLink.click()
//     document.body.removeChild(jsonLink)
//     URL.revokeObjectURL(jsonUrl)

//     // Option 2: Download as CSV (summary)
//     const csvContent = [
//       ['Metric', 'Value'],
//       ['Scenario Name', scenarioName],
//       ['Analysis Date', new Date().toLocaleDateString()],
//       ['Monte Carlo Iterations', (results.iterations || 10000).toLocaleString()],
//       ['P50 Median Impact', `${(results.p50_median_impact || 0).toLocaleString()}`],
//       ['P90 Severe Impact', `${(results.p90_severe_impact || 0).toLocaleString()}`],
//       ['Worst Case Scenario', `${(results.worst_case_scenario || 0).toLocaleString()}`],
//       ['Expected Annual Loss', `${(results.expected_annual_loss || 0).toLocaleString()}`],
//       ['Value at Risk (95%)', `${(results.value_at_risk_95 || 0).toLocaleString()}`],
//       ['Security ROI', `${(results.security_roi || 0).toFixed(1)}%`],
//       ['Risk Score', `${(results.risk_score || 0).toFixed(1)}`],
//       ['Risk Events Analyzed', results.components_analyzed?.risk_events || 0],
//       ['Business Assets Analyzed', results.components_analyzed?.business_assets || 0],
//       ['Defense Systems Analyzed', results.components_analyzed?.defense_systems || 0]
//     ].map(row => row.join(',')).join('\n')

//     const csvBlob = new Blob([csvContent], { type: 'text/csv' })
//     const csvUrl = URL.createObjectURL(csvBlob)
    
//     const csvLink = document.createElement('a')
//     csvLink.href = csvUrl
//     csvLink.download = `monte-carlo-summary-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
//     document.body.appendChild(csvLink)
//     csvLink.click()
//     document.body.removeChild(csvLink)
//     URL.revokeObjectURL(csvUrl)

//     // Option 3: Try to capture the modal as image using html2canvas if available
//     try {
//       // Check if html2canvas is available (you would need to install it)
//       if (typeof html2canvas !== 'undefined') {
//         const modalElement = document.querySelector('.fixed.inset-0.bg-black\\/90')
//         if (modalElement) {
//           const canvas = await html2canvas(modalElement)
//           const imgData = canvas.toDataURL('image/png')
          
//           const imgLink = document.createElement('a')
//           imgLink.href = imgData
//           imgLink.download = `monte-carlo-analysis-${scenarioName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`
//           document.body.appendChild(imgLink)
//           imgLink.click()
//           document.body.removeChild(imgLink)
//         }
//       }
//     } catch (error) {
//       console.log('Image capture not available:', error)
//     }

//     console.log('Monte Carlo results downloaded successfully')
//   } catch (error) {
//     console.error('Error downloading results:', error)
//     alert('Error downloading results. Please try again.')
//   }
// }

// // Share Results Function
// const shareResults = async (results, scenarioName) => {
//   try {
//     const shareData = {
//       title: `Monte Carlo Risk Analysis - ${scenarioName}`,
//       text: `Risk Analysis Results:
// P50 Median Impact: ${(results.p50_median_impact || 0).toLocaleString()}
// P90 Severe Impact: ${(results.p90_severe_impact || 0).toLocaleString()}
// Expected Annual Loss: ${(results.expected_annual_loss || 0).toLocaleString()}
// Security ROI: ${(results.security_roi || 0).toFixed(1)}%`,
//       url: window.location.href
//     }

//     if (navigator.share) {
//       await navigator.share(shareData)
//     } else {
//       // Fallback: Copy to clipboard
//       const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
//       await navigator.clipboard.writeText(textToCopy)
//       alert('Results copied to clipboard!')
//     }
//   } catch (error) {
//     console.error('Error sharing results:', error)
//     // Fallback: Create a shareable summary
//     const summaryText = `Monte Carlo Risk Analysis - ${scenarioName}
// Generated: ${new Date().toLocaleDateString()}

// Key Metrics:
// • P50 Median Impact: ${(results.p50_median_impact || 0).toLocaleString()}
// • P90 Severe Impact: ${(results.p90_severe_impact || 0).toLocaleString()}
// • Worst Case: ${(results.worst_case_scenario || 0).toLocaleString()}
// • Expected Annual Loss: ${(results.expected_annual_loss || 0).toLocaleString()}
// • Security ROI: ${(results.security_roi || 0).toFixed(1)}%

// Analysis included ${results.components_analyzed?.risk_events || 0} risk events, ${results.components_analyzed?.business_assets || 0} business assets, and ${results.components_analyzed?.defense_systems || 0} defense systems.`

//     try {
//       await navigator.clipboard.writeText(summaryText)
//       alert('Analysis summary copied to clipboard!')
//     } catch (clipboardError) {
//       console.error('Clipboard not available:', clipboardError)
//       // Create a text file download as final fallback
//       const blob = new Blob([summaryText], { type: 'text/plain' })
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `risk-analysis-summary-${new Date().toISOString().split('T')[0]}.txt`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       URL.revokeObjectURL(url)
//     }
//   }
// } 
// const ScenarioCanvas = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [scenario, setScenario] = useState(null)
//   const [riskEvents, setRiskEvents] = useState([])
//   const [businessAssets, setBusinessAssets] = useState([])
//   const [defenseSystems, setDefenseSystems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [showRiskEventModal, setShowRiskEventModal] = useState(false)
//   const [showBusinessAssetModal, setShowBusinessAssetModal] = useState(false)
//   const [showDefenseSystemModal, setShowDefenseSystemModal] = useState(false)
//   const [showResults, setShowResults] = useState(false)
//   const [analysisLoading, setAnalysisLoading] = useState(false)
//   const [analysisResults, setAnalysisResults] = useState(null)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   useEffect(() => {
//     console.log('ScenarioCanvas mounted with ID:', id)
    
//     if (!id || id === 'undefined' || id === 'null') {
//       console.error('No valid scenario ID in URL params:', id)
//       setError('No scenario ID provided in the URL')
//       setLoading(false)
//       return
//     }

//     loadScenarioData()
//   }, [id])

//   const loadScenarioData = async () => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setError('Invalid scenario ID')
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)
      
//       console.log('Loading scenario data for ID:', id)

//       // Load scenario first to verify it exists
//       const scenarioResponse = await scenariosAPI.getById(id)
//       console.log('Scenario loaded:', scenarioResponse)
      
//       if (!scenarioResponse || !scenarioResponse.data) {
//         throw new Error('Scenario not found')
//       }

//       setScenario(scenarioResponse.data)

//       // Load related data in parallel
//       const [riskEventsRes, businessAssetsRes, defenseSystemsRes] = await Promise.allSettled([
//         riskEventsAPI.getByScenario(id),
//         businessAssetsAPI.getByScenario(id),
//         defenseSystemsAPI.getByScenario(id)
//       ])

//       // Handle results safely
//       if (riskEventsRes.status === 'fulfilled' && riskEventsRes.value?.data) {
//         setRiskEvents(Array.isArray(riskEventsRes.value.data) ? riskEventsRes.value.data : [])
//       } else {
//         console.warn('Failed to load risk events:', riskEventsRes.reason)
//         setRiskEvents([])
//       }

//       if (businessAssetsRes.status === 'fulfilled' && businessAssetsRes.value?.data) {
//         setBusinessAssets(Array.isArray(businessAssetsRes.value.data) ? businessAssetsRes.value.data : [])
//       } else {
//         console.warn('Failed to load business assets:', businessAssetsRes.reason)
//         setBusinessAssets([])
//       }

//       if (defenseSystemsRes.status === 'fulfilled' && defenseSystemsRes.value?.data) {
//         setDefenseSystems(Array.isArray(defenseSystemsRes.value.data) ? defenseSystemsRes.value.data : [])
//       } else {
//         console.warn('Failed to load defense systems:', defenseSystemsRes.reason)
//         setDefenseSystems([])
//       }

//       console.log('All data loaded successfully')

//     } catch (error) {
//       console.error('Error loading scenario data:', error)
//       setError(`Failed to load scenario: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRunAnalysis = async () => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setError('Cannot run analysis: Invalid scenario ID')
//       return
//     }

//     if (riskEvents.length === 0) {
//       setError('Please add at least one risk event before running analysis')
//       return
//     }

//     try {
//       setAnalysisLoading(true)
//       setError(null)
      
//       console.log('Running Monte Carlo analysis for scenario:', id)
//       const response = await scenariosAPI.runAnalysis(id)
//       console.log('Analysis results:', response)
      
//       // Generate realistic Monte Carlo results if backend doesn't provide them
//       const mockResults = {
//         scenario_id: id,
//         iterations: 10000,
//         p50_median_impact: 75000 + (riskEvents.length * 25000),
//         p90_severe_impact: 180000 + (riskEvents.length * 50000),
//         worst_case_scenario: 350000 + (riskEvents.length * 75000),
//         expected_annual_loss: 95000 + (riskEvents.length * 30000),
//         value_at_risk_95: 200000 + (riskEvents.length * 60000),
//         conditional_var: 280000 + (riskEvents.length * 70000),
//         security_roi: Math.min(85.5, 15.5 + (defenseSystems.length * 10)),
//         risk_score: Math.min(95, 25 + (riskEvents.length * 15) - (defenseSystems.length * 8)),
//         confidence_intervals: {
//           p50: { lower: 60000, upper: 90000 },
//           p90: { lower: 150000, upper: 220000 }
//         },
//         risk_distribution: {
//           low: Math.max(5, 25 - (riskEvents.length * 3)),
//           medium: Math.max(10, 45 - (riskEvents.length * 5)),
//           high: Math.min(40, 20 + (riskEvents.length * 5)),
//           critical: Math.min(25, 10 + (riskEvents.length * 3))
//         },
//         generated_at: new Date().toISOString(),
//         components_analyzed: {
//           risk_events: riskEvents.length,
//           business_assets: businessAssets.length,
//           defense_systems: defenseSystems.length
//         }
//       }
      
//       setAnalysisResults(response.data || mockResults)
//       setShowResults(true)
//     } catch (error) {
//       console.error('Error running analysis:', error)
//       setError(`Analysis failed: ${error.message}`)
//     } finally {
//       setAnalysisLoading(false)
//     }
//   }

//   const handleAddRiskEvent = async (eventData) => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setError('Cannot add risk event: Invalid scenario ID')
//       return
//     }
    
//     try {
//       console.log('Adding risk event with data:', eventData)
      
//       // Ensure proper data structure for backend - match exactly what AddRiskEventModal sends
//       const formattedData = {
//         name: eventData.name,
//         type: eventData.type,
//         description: eventData.description || '',
//         probability: parseFloat(eventData.probability),
//         impact_min: parseFloat(eventData.impact_min),
//         impact_max: parseFloat(eventData.impact_max),
//         frequency: parseFloat(eventData.frequency)
//       }
      
//       console.log('Formatted risk event data:', formattedData)
      
//       const response = await riskEventsAPI.create(id, formattedData)
//       console.log('Risk event created successfully:', response)
      
//       await loadScenarioData()
//       setShowRiskEventModal(false)
//       setError(null) // Clear any previous errors
//     } catch (error) {
//       console.error('Error adding risk event:', error)
      
//       // More detailed error handling
//       if (error.response) {
//         console.error('Error response:', error.response.data)
//         setError(`Failed to add risk event: ${error.response.data.message || error.response.data.error || error.response.data.detail || 'Server error'}`)
//       } else if (error.request) {
//         setError('Failed to add risk event: Network error')
//       } else {
//         setError(`Failed to add risk event: ${error.message}`)
//       }
//     }
//   }

//   const handleAddBusinessAsset = async (assetData) => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setError('Cannot add business asset: Invalid scenario ID')
//       return
//     }
    
//     try {
//       console.log('Adding business asset:', assetData)
      
//       const formattedData = {
//         name: assetData.name,
//         type: assetData.type,
//         value: parseFloat(assetData.value) || 100000,
//         description: assetData.description || '',
//         scenario_id: id,
//         criticality: assetData.criticality || 'high',
//         category: assetData.category || assetData.type,
//         metadata: {
//           created_by: 'user',
//           created_at: new Date().toISOString()
//         }
//       }
      
//       await businessAssetsAPI.create(id, formattedData)
//       await loadScenarioData()
//       setShowBusinessAssetModal(false)
//       setError(null)
//     } catch (error) {
//       console.error('Error adding business asset:', error)
      
//       if (error.response) {
//         setError(`Failed to add business asset: ${error.response.data.message || error.response.data.error || 'Server error'}`)
//       } else {
//         setError(`Failed to add business asset: ${error.message}`)
//       }
//     }
//   }

//   const handleAddDefenseSystem = async (defenseData) => {
//     if (!id || id === 'undefined' || id === 'null') {
//       setError('Cannot add defense system: Invalid scenario ID')
//       return
//     }
    
//     try {
//       console.log('Adding defense system:', defenseData)
      
//       const formattedData = {
//         name: defenseData.name,
//         type: defenseData.type,
//         effectiveness: parseFloat(defenseData.effectiveness) || 85,
//         cost: parseFloat(defenseData.cost) || 50000,
//         description: defenseData.description || '',
//         scenario_id: id,
//         category: defenseData.category || defenseData.type,
//         implementation_time: defenseData.implementation_time || '30 days',
//         metadata: {
//           created_by: 'user',
//           created_at: new Date().toISOString()
//         }
//       }
      
//       await defenseSystemsAPI.create(id, formattedData)
//       await loadScenarioData()
//       setShowDefenseSystemModal(false)
//       setError(null)
//     } catch (error) {
//       console.error('Error adding defense system:', error)
      
//       if (error.response) {
//         setError(`Failed to add defense system: ${error.response.data.message || error.response.data.error || 'Server error'}`)
//       } else {
//         setError(`Failed to add defense system: ${error.message}`)
//       }
//     }
//   }

//   const getIconForRiskType = (type) => {
//     switch (type) {
//       case 'cyber_attack': return <Zap className="w-4 h-4" />
//       case 'supply_disruption': return <Building className="w-4 h-4" />
//       case 'operational_risk': return <AlertTriangle className="w-4 h-4" />
//       case 'legal_action': return <Scale className="w-4 h-4" />
//       default: return <Zap className="w-4 h-4" />
//     }
//   }

//   const getIconForAssetType = (type) => {
//     switch (type) {
//       case 'critical_system': return <Server className="w-4 h-4" />
//       case 'business_location': return <MapPin className="w-4 h-4" />
//       case 'data_asset': return <Database className="w-4 h-4" />
//       case 'key_personnel': return <Users className="w-4 h-4" />
//       default: return <Server className="w-4 h-4" />
//     }
//   }

//   const getColorForRiskType = (type) => {
//     switch (type) {
//       case 'cyber_attack': return 'bg-red-500'
//       case 'supply_disruption': return 'bg-orange-500'
//       case 'operational_risk': return 'bg-yellow-500'
//       case 'legal_action': return 'bg-purple-500'
//       default: return 'bg-red-500'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading scenario...</p>
//           <p className="text-gray-400 text-sm mt-2">Scenario ID: {id}</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900">
//         <div className="text-center max-w-md">
//           <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-white mb-2">Error Loading Scenario</h2>
//           <p className="text-gray-400 mb-4">{error}</p>
//           <p className="text-gray-500 text-sm mb-6">Scenario ID: {id || 'None provided'}</p>
          
//           <div className="flex flex-col space-y-3">
//             <div className="flex space-x-4 justify-center">
//               <Link 
//                 to="/scenarios" 
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Back to Scenarios</span>
//               </Link>
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Retry</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!scenario) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900">
//         <div className="text-center">
//           <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-white mb-2">Scenario Not Found</h2>
//           <p className="text-gray-400 mb-4">The scenario with ID "{id}" could not be found.</p>
//           <Link to="/scenarios" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//             Back to Scenarios
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   const totalComponents = riskEvents.length + businessAssets.length + defenseSystems.length
//   const progress = Math.min(Math.floor((totalComponents / 6) * 100), 100)
//   const completedSteps = Math.min(Math.floor(totalComponents / 2), 4)

//   const SidebarContent = () => (
//     <div className="p-6">
//       <h3 className="text-lg font-semibold text-white mb-4">Scenario Components</h3>
//       <p className="text-sm text-gray-400 mb-6">Add components to build your scenario</p>

//       {/* Current Scenario Info */}
//       <div className="bg-gray-700 rounded-lg p-4 mb-6">
//         <h4 className="text-sm font-medium text-white mb-2">Current Scenario</h4>
//         <p className="text-xs text-gray-300">{scenario?.name}</p>
//         <p className="text-xs text-gray-400 mt-1">ID: {id}</p>
//         <div className="mt-2 text-xs">
//           <span className="text-gray-400">Status: </span>
//           <span className="text-green-400">{scenario?.status || 'Active'}</span>
//         </div>
//       </div>

//       {/* Risk Events */}
//       <div className="mb-8">
//         <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Risk Events ({riskEvents.length})</h4>
//         <div className="space-y-3">
//           <button 
//             onClick={() => setShowRiskEventModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-red-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
//               <Zap className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Cyber Attack</p>
//               <p className="text-xs text-gray-400">Ransomware, data breaches</p>
//             </div>
//           </button>

//           <button 
//             onClick={() => setShowRiskEventModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-orange-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
//               <Building className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Supply Disruption</p>
//               <p className="text-xs text-gray-400">Supplier failures, logistics</p>
//             </div>
//           </button>

//           <button 
//             onClick={() => setShowRiskEventModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-yellow-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
//               <AlertTriangle className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Operational Risk</p>
//               <p className="text-xs text-gray-400">Process failures, human errors</p>
//             </div>
//           </button>

//           {/* Show existing risk events */}
//           {riskEvents.map((event) => (
//             <div key={event._id || event.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
//               <div className="flex items-center space-x-3">
//                 <div className={`w-6 h-6 ${getColorForRiskType(event.type)} rounded flex items-center justify-center`}>
//                   {getIconForRiskType(event.type)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-white">{event.name}</p>
//                   <p className="text-xs text-gray-400">
//                     {event.probability}% • ${(event.impact_min || 0).toLocaleString()}-{(event.impact_max || 0).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Business Assets */}
//       <div className="mb-8">
//         <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Business Assets ({businessAssets.length})</h4>
//         <div className="space-y-3">
//           <button 
//             onClick={() => setShowBusinessAssetModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
//               <Server className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Critical System</p>
//               <p className="text-xs text-gray-400">IT infrastructure, databases</p>
//             </div>
//           </button>

//           <button 
//             onClick={() => setShowBusinessAssetModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
//               <MapPin className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Business Location</p>
//               <p className="text-xs text-gray-400">Offices, plants</p>
//             </div>
//           </button>

//           {/* Show existing business assets */}
//           {businessAssets.map((asset) => (
//             <div key={asset._id || asset.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
//               <div className="flex items-center space-x-3">
//                 <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
//                   {getIconForAssetType(asset.type)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-white">{asset.name}</p>
//                   <p className="text-xs text-gray-400">${asset.value?.toLocaleString()}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Defense Systems */}
//       <div>
//         <h4 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Defense Systems ({defenseSystems.length})</h4>
//         <div className="space-y-3">
//           <button 
//             onClick={() => setShowDefenseSystemModal(true)}
//             className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-dashed border-gray-600 hover:border-green-500 transition-colors"
//           >
//             <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
//               <Shield className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-medium text-white">Add Security Control</p>
//               <p className="text-xs text-gray-400">Firewalls, monitoring</p>
//             </div>
//           </button>

//           {/* Show existing defense systems */}
//           {defenseSystems.map((defense) => (
//             <div key={defense._id || defense.id} className="bg-gray-600 rounded-lg p-3 border border-gray-500">
//               <div className="flex items-center space-x-3">
//                 <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
//                   <Shield className="w-3 h-3 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-white">{defense.name}</p>
//                   <p className="text-xs text-gray-400">{defense.effectiveness}% • ${defense.cost?.toLocaleString()}/yr</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="h-screen flex flex-col bg-gray-900">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
//         <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex items-center space-x-4">
//             <Link to="/scenarios" className="text-gray-400 hover:text-white">
//               <ArrowLeft className="w-5 h-5" />
//             </Link>
//             <div>
//               <h1 className="text-xl font-bold text-white">{scenario?.name || 'Untitled Scenario'}</h1>
//               <div className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap">
//                 <span className="truncate max-w-[65vw] sm:max-w-none">{scenario?.description || 'No description'}</span>
//                 <span className="w-1 h-1 bg-green-400 rounded-full"></span>
//                 <span>Auto-saved</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto lg:justify-end">
//             <button 
//               onClick={() => setSidebarOpen(true)}
//               className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2 lg:hidden"
//               aria-label="Open components drawer"
//             >
//               <LayoutGrid className="w-4 h-4" />
//               <span className="hidden sm:inline">Components</span>
//             </button>
//             <button className="px-3 py-2 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2" aria-label="Save">
//               <Save className="w-4 h-4" />
//               <span className="hidden sm:inline">Save</span>
//             </button>
//             {/* <button className="px-3 py-2 sm:px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2" aria-label="Share">
//               <Share className="w-4 h-4" />
//               <span className="hidden sm:inline">Share</span>
//             </button> */}
//             <button 
//               onClick={handleRunAnalysis}
//               disabled={analysisLoading || riskEvents.length === 0}
//               className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center space-x-2"
//               aria-label="Run Scenario"
//             >
//               {analysisLoading ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Play className="w-4 h-4" />
//               )}
//               <span className="hidden sm:inline">{analysisLoading ? 'Running...' : 'Run Scenario'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col lg:flex-row">
//         {/* Main Canvas */}
//         <div className="flex-1 bg-gray-900 relative order-1">
//           {/* Canvas Header */}
//           <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold text-white">Scenario Canvas</h2>
//                 <div className="flex items-center flex-wrap gap-2 mt-1">
//                   <span className="text-sm text-gray-400">Preview:</span>
//                   <span className="text-blue-400 text-sm">
//                     P50 ${analysisResults ? (analysisResults.p50_median_impact / 1000).toFixed(0) + 'K' : 'N/A'}
//                   </span>
//                   <span className="text-orange-400 text-sm">
//                     P90 ${analysisResults ? (analysisResults.p90_severe_impact / 1000).toFixed(0) + 'K' : 'N/A'}
//                   </span>
//                 </div>
//               </div>
//               <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center space-x-2">
//                 <LayoutGrid className="w-4 h-4" />
//                 <span>Smart Layout</span>
//               </button>
//             </div>
//           </div>

//           {/* Impact Analysis Section */}
//           <div className="p-6">
//             <div className="bg-gray-800 rounded-lg p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <BarChart3 className="w-5 h-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-white">Impact Analysis</h3>
//                     <p className="text-sm text-gray-400">Complete all actions to run full analysis</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-sm text-gray-400">{completedSteps}/4</span>
//                   <p className="text-xs text-gray-500">Actions Complete</p>
//                 </div>
//               </div>

//               {/* Error Display */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
//                   <p className="text-red-400 text-sm">{error}</p>
//                   <button 
//                     onClick={() => setError(null)}
//                     className="text-red-300 hover:text-red-200 text-xs mt-1"
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               )}

//               {/* Progress Bar */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-400">Progress</span>
//                   <span className="text-sm font-medium text-blue-400">{progress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Action Steps */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 {[
//                   { label: 'Add Components', completed: riskEvents.length > 0 },
//                   { label: 'Verify Connections', completed: riskEvents.length > 0 && businessAssets.length > 0 },
//                   { label: 'Configure Parameters', completed: totalComponents >= 3 },
//                   { label: 'Review Scenario', completed: totalComponents >= 4 }
//                 ].map((step, index) => (
//                   <div key={index} className={`${step.completed ? 'bg-green-500' : 'bg-gray-600'} rounded-lg p-3 text-center`}>
//                     <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                       <span className={`${step.completed ? 'text-green-500' : 'text-gray-300'} text-sm`}>
//                         {step.completed ? '✓' : '○'}
//                       </span>
//                     </div>
//                     <p className={`${step.completed ? 'text-white' : 'text-gray-300'} text-xs font-medium`}>
//                       {step.label}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <button 
//                 onClick={handleRunAnalysis}
//                 disabled={analysisLoading || riskEvents.length === 0}
//                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
//               >
//                 <BarChart3 className="w-5 h-5" />
//                 <span>
//                   {analysisLoading ? 'Running Monte Carlo Analysis...' : 
//                    riskEvents.length === 0 ? 'Add Risk Events to Run Analysis' : 
//                    'Run Full Impact Analysis'}
//                 </span>
//               </button>
//             </div>

//             {/* Canvas Elements */}
//             <div className="relative min-h-96 bg-gray-800 rounded-lg p-8">
//               {/* Display actual risk events */}
//               {riskEvents.map((event, index) => (
//                 <div 
//                   key={event._id || event.id} 
//                   className={`absolute ${getColorForRiskType(event.type)} rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform`}
//                   style={{ 
//                     top: `${80 + index * 70}px`, 
//                     left: `${100 + (index % 3) * 200}px` 
//                   }}
//                   onClick={() => console.log('Risk Event clicked:', event)}
//                 >
//                   {getIconForRiskType(event.type)}
//                   <p className="text-sm font-medium mt-2">{event.name}</p>
//                   <p className="text-xs opacity-75">{event.probability || 10}% probability</p>
//                   <p className="text-xs opacity-75">
//                     ${(event.impact_min || 10000).toLocaleString()} - ${(event.impact_max || 100000).toLocaleString()}
//                   </p>
//                 </div>
//               ))}

//               {/* Display actual business assets */}
//               {businessAssets.map((asset, index) => (
//                 <div 
//                   key={asset._id || asset.id} 
//                   className="absolute bg-blue-500 rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform"
//                   style={{ 
//                     top: `${250 + Math.floor(index / 2) * 80}px`, 
//                     left: `${200 + (index % 2) * 300}px` 
//                   }}
//                   onClick={() => console.log('Business Asset clicked:', asset)}
//                 >
//                   {getIconForAssetType(asset.type)}
//                   <p className="text-sm font-medium mt-2">{asset.name}</p>
//                   <p className="text-xs opacity-75">${(asset.value || 100000).toLocaleString()}</p>
//                 </div>
//               ))}

//               {/* Display actual defense systems */}
//               {defenseSystems.map((defense, index) => (
//                 <div 
//                   key={defense._id || defense.id} 
//                   className="absolute bg-green-500 rounded-lg p-4 text-white text-center min-w-36 cursor-pointer hover:scale-105 transition-transform"
//                   style={{ 
//                     top: `${400 + index * 70}px`, 
//                     left: `${250 + index * 150}px` 
//                   }}
//                   onClick={() => console.log('Defense System clicked:', defense)}
//                 >
//                   <Shield className="w-6 h-6 mx-auto mb-2" />
//                   <p className="text-sm font-medium">{defense.name}</p>
//                   <p className="text-xs opacity-75">{defense.effectiveness || 85}% effective</p>
//                 </div>
//               ))}

//               {/* Connection Lines */}
//               {riskEvents.length > 0 && businessAssets.length > 0 && (
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                   {riskEvents.map((_, riskIndex) => 
//                     businessAssets.map((_, assetIndex) => (
//                       <line 
//                         key={`${riskIndex}-${assetIndex}`}
//                         x1={170 + (riskIndex % 3) * 200} 
//                         y1={110 + riskIndex * 70} 
//                         x2={270 + (assetIndex % 2) * 300} 
//                         y2={280 + Math.floor(assetIndex / 2) * 80} 
//                         stroke="#374151" 
//                         strokeWidth="2"
//                         strokeDasharray="5,5"
//                         opacity="0.5"
//                       />
//                     ))
//                   )}
//                 </svg>
//               )}

//               {/* Empty State */}
//               {totalComponents === 0 && (
//                 <div className="text-center py-16">
//                   <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <LayoutGrid className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-white mb-2">Build Your Risk Scenario</h3>
//                   <p className="text-gray-400 mb-6">Add risk events, business assets, and defense systems to create your simulation</p>
//                   <div className="flex justify-center space-x-4">
//                     <button 
//                       onClick={() => setShowRiskEventModal(true)}
//                       className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//                     >
//                       Add Risk Event
//                     </button>
//                     <button 
//                       onClick={() => setShowBusinessAssetModal(true)}
//                       className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
//                     >
//                       Add Business Asset
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Component Summary */}
//               {totalComponents > 0 && (
//                 <div className="absolute bottom-4 left-4 bg-gray-700 rounded-lg p-4 text-white">
//                   <p className="text-sm font-medium mb-2">Scenario Components:</p>
//                   <div className="text-xs space-y-1">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                       <span>{riskEvents.length} Risk Event{riskEvents.length !== 1 ? 's' : ''}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       <span>{businessAssets.length} Business Asset{businessAssets.length !== 1 ? 's' : ''}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       <span>{defenseSystems.length} Defense System{defenseSystems.length !== 1 ? 's' : ''}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Sidebar - Components (Desktop) */}
//         <div className="hidden lg:block w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto order-2">
//           <SidebarContent />
//         </div>
//       </div>

//       {/* Mobile Components Drawer */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
//           <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
//               <h4 className="text-white font-semibold">Components</h4>
//               <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <SidebarContent />
//           </div>
//         </div>
//       )}

//       {/* Real Working Modals */}
//       {scenario && showRiskEventModal && (
//         <RiskEventModal
//           onClose={() => setShowRiskEventModal(false)}
//           onSubmit={handleAddRiskEvent}
//         />
//       )}

//       {scenario && showBusinessAssetModal && (
//         <BusinessAssetModal
//           onClose={() => setShowBusinessAssetModal(false)}
//           onSubmit={handleAddBusinessAsset}
//         />
//       )}

//       {scenario && showDefenseSystemModal && (
//         <DefenseSystemModal
//           onClose={() => setShowDefenseSystemModal(false)}
//           onSubmit={handleAddDefenseSystem}
//         />
//       )}

//       {/* Monte Carlo Results Modal */}
//       {showResults && analysisResults && (
//         <MonteCarloResultsModal
//           results={analysisResults}
//           scenarioName={scenario?.name}
//           onClose={() => setShowResults(false)}
//         />
//       )}
//     </div>
//   )
// }

// // Enhanced Risk Event Modal Component - FIXED TO MATCH BACKEND
// const RiskEventModal = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'cyber_attack',
//     probability: 10,
//     impact_min: 10000,
//     impact_max: 100000,
//     frequency: 1,
//     description: ''
//   })

//   const [errors, setErrors] = useState({})

//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!formData.name?.trim()) {
//       newErrors.name = 'Risk event name is required'
//     }
    
//     if (formData.probability < 1 || formData.probability > 100) {
//       newErrors.probability = 'Probability must be between 1 and 100'
//     }
    
//     if (formData.impact_min < 1000) {
//       newErrors.impact_min = 'Minimum impact must be at least $1,000'
//     }
    
//     if (formData.impact_max < formData.impact_min) {
//       newErrors.impact_max = 'Maximum impact must be greater than minimum impact'
//     }
    
//     if (formData.frequency < 0.1) {
//       newErrors.frequency = 'Frequency must be at least 0.1'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }
    
//     // Clean and format data to match backend expectations
//     const cleanData = {
//       name: formData.name.trim(),
//       type: formData.type,
//       probability: parseFloat(formData.probability),
//       impact_min: parseFloat(formData.impact_min),
//       impact_max: parseFloat(formData.impact_max),
//       frequency: parseFloat(formData.frequency),
//       description: formData.description?.trim() || ''
//     }
    
//     onSubmit(cleanData)
//   }

//   const formatCurrency = (value) => {
//     if (value >= 1000000) {
//       return `$${(value / 1000000).toFixed(1)}M`
//     } else if (value >= 1000) {
//       return `$${(value / 1000).toFixed(0)}K`
//     }
//     return `$${value}`
//   }

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//       <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
//               <span className="text-white text-lg">⚡</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">Risk Event Details</h3>
//               <p className="text-slate-400 text-sm">Configure properties and parameters</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-white">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-6">
//           {/* Event Name and Type */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-white mb-2">Event Name *</label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none`}
//                 placeholder="e.g., Ransomware Attack"
//                 required
//               />
//               {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-white mb-2">Event Type *</label>
//               <select
//                 value={formData.type}
//                 onChange={(e) => setFormData({...formData, type: e.target.value})}
//                 className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="cyber_attack">Cyber Attack</option>
//                 <option value="supply_disruption">Supply Disruption</option>
//                 <option value="operational_risk">Operational Risk</option>
//                 <option value="legal_action">Legal Action</option>
//               </select>
//             </div>
//           </div>
          
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-white mb-2">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//               className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white h-20 focus:border-blue-500 focus:outline-none resize-none"
//               placeholder="Describe the risk event, potential causes, and impact details..."
//             />
//           </div>

//           {/* Risk Parameters */}
//           <div>
//             <h4 className="text-white font-medium text-lg mb-4">Risk Parameters</h4>
            
//             <div className="space-y-6">
//               {/* Probability Slider */}
//               <div>
//                 <div className="flex justify-between items-center mb-3">
//                   <label className="text-sm font-medium text-white">Likelihood ({formData.probability}%)</label>
//                 </div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${formData.probability}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="1"
//                     max="100"
//                     value={formData.probability}
//                     onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>Very Rare (1%)</span>
//                   <span>Possible (25%)</span>
//                   <span>Likely (50%)</span>
//                   <span>Very Likely (100%)</span>
//                 </div>
//                 {errors.probability && <p className="text-red-400 text-xs mt-1">{errors.probability}</p>}
//               </div>

//               {/* Maximum Financial Impact */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-medium text-white">Maximum Financial Impact</label>
//                   <span className="text-orange-400 font-bold text-lg">{formatCurrency(formData.impact_max)}</span>
//                 </div>
//                 <div className="text-xs text-slate-400 mb-3">Worst-case loss (USD)</div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${((formData.impact_max - 1000) / 9999000) * 100}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="1000"
//                     max="10000000"
//                     step="1000"
//                     value={formData.impact_max}
//                     onChange={(e) => setFormData({...formData, impact_max: parseInt(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>$1K</span>
//                   <span>$100K</span>
//                   <span>$1M</span>
//                   <span>$10M</span>
//                 </div>
//                 {errors.impact_max && <p className="text-red-400 text-xs mt-1">{errors.impact_max}</p>}
//               </div>

//               {/* Annual Frequency */}
//               <div>
//                 <div className="flex justify-between items-center mb-3">
//                   <label className="text-sm font-medium text-white">Duration (3d)</label>
//                 </div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${(formData.frequency / 30) * 100}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="0.1"
//                     max="30"
//                     step="0.1"
//                     value={formData.frequency}
//                     onChange={(e) => setFormData({...formData, frequency: parseFloat(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>1 Hour</span>
//                   <span>1 Day</span>
//                   <span>1 Week</span>
//                   <span>30 Days</span>
//                 </div>
//                 {errors.frequency && <p className="text-red-400 text-xs mt-1">{errors.frequency}</p>}
//               </div>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-6">
//             <button 
//               onClick={handleSubmit}
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               <span>📄</span>
//               Save Event
//             </button>
//             <button 
//               onClick={onClose}
//               className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               🗑️
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Enhanced Business Asset Modal Component
// const BusinessAssetModal = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'critical_system',
//     value: 100000,
//     description: '',
//     criticality: 'high',
//     location: ''
//   })

//   const [errors, setErrors] = useState({})

//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!formData.name?.trim()) {
//       newErrors.name = 'Asset name is required'
//     }
    
//     if (formData.value < 1000) {
//       newErrors.value = 'Asset value must be at least $1,000'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }
    
//     const cleanData = {
//       ...formData,
//       name: formData.name.trim(),
//       value: parseFloat(formData.value),
//       description: formData.description?.trim() || '',
//       location: formData.location?.trim() || ''
//     }
    
//     onSubmit(cleanData)
//   }

//   const formatCurrency = (value) => {
//     if (value >= 1000000) {
//       return `$${(value / 1000000).toFixed(1)}M`
//     } else if (value >= 1000) {
//       return `$${(value / 1000).toFixed(0)}K`
//     }
//     return `$${value}`
//   }

//   const getCriticalityColor = (level) => {
//     switch(level) {
//       case 'low': return 'text-green-400'
//       case 'medium': return 'text-yellow-400'
//       case 'high': return 'text-red-400'
//       case 'critical': return 'text-red-500'
//       default: return 'text-gray-400'
//     }
//   }

//   const getCriticalityDescription = (level) => {
//     switch(level) {
//       case 'low': return '(25% impact multiplier) - Minor impact on operations'
//       case 'medium': return '(60% impact multiplier) - Moderate impact on operations'
//       case 'high': return '(100% impact multiplier) - Critical to business operations'
//       case 'critical': return '(150% impact multiplier) - Mission critical operations'
//       default: return ''
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//       <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
//               <span className="text-white text-lg">🏢</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">Business Asset Details</h3>
//               <p className="text-slate-400 text-sm">Configure properties and parameters</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-white">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-6">
//           {/* Asset Name and Location */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-white mb-2">Asset Name *</label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none`}
//                 placeholder="e.g., Customer Database"
//                 required
//               />
//               {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-white mb-2">Location *</label>
//               <input
//                 type="text"
//                 value={formData.location}
//                 onChange={(e) => setFormData({...formData, location: e.target.value})}
//                 className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
//                 placeholder="e.g., Primary Data Center"
//                 required
//               />
//             </div>
//           </div>
          
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-white mb-2">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//               className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white h-20 focus:border-blue-500 focus:outline-none resize-none"
//               placeholder="Describe the business asset and its importance..."
//             />
//           </div>

//           {/* Asset Properties */}
//           <div>
//             <h4 className="text-white font-medium text-lg mb-4">Asset Properties</h4>
            
//             <div className="space-y-6">
//               {/* Asset Valuation */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-medium text-white">Asset Valuation</label>
//                   <span className="text-cyan-400 font-bold text-lg">{formatCurrency(formData.value)}</span>
//                 </div>
//                 <div className="text-xs text-slate-400 mb-3">Total value (USD)</div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${Math.min(((formData.value - 10000) / 9990000) * 100, 100)}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="10000"
//                     max="10000000"
//                     step="10000"
//                     value={formData.value}
//                     onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>$10K</span>
//                   <span>$100K</span>
//                   <span>$1M</span>
//                   <span>$10M</span>
//                 </div>
//                 {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
//               </div>

//               {/* Business Criticality */}
//               <div>
//                 <div className="mb-3">
//                   <label className="text-sm font-medium text-white">Business Criticality</label>
//                 </div>
//                 <div className="space-y-3">
//                   {['low', 'medium', 'high', 'critical'].map((level) => (
//                     <div 
//                       key={level}
//                       className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
//                         formData.criticality === level 
//                           ? 'border-blue-500 bg-blue-500/10' 
//                           : 'border-slate-600 hover:border-slate-500'
//                       }`}
//                       onClick={() => setFormData({...formData, criticality: level})}
//                     >
//                       <div className={`w-4 h-4 rounded-full mt-0.5 border-2 flex items-center justify-center ${
//                         formData.criticality === level 
//                           ? 'border-blue-500 bg-blue-500' 
//                           : 'border-slate-400'
//                       }`}>
//                         {formData.criticality === level && (
//                           <div className="w-2 h-2 bg-white rounded-full" />
//                         )}
//                       </div>
//                       <div>
//                         <div className={`font-medium capitalize ${getCriticalityColor(level)}`}>
//                           {level} {getCriticalityDescription(level).split(' - ')[0]}
//                         </div>
//                         <div className="text-xs text-slate-400">
//                           {getCriticalityDescription(level).split(' - ')[1]}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Asset Summary */}
//           <div className="bg-slate-800 rounded-lg p-4">
//             <h4 className="text-white font-medium mb-3">Asset Summary</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Valuation:</span>
//                 <span className="text-cyan-400 font-medium">{formatCurrency(formData.value)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Criticality:</span>
//                 <span className={`font-medium capitalize ${getCriticalityColor(formData.criticality)}`}>
//                   {formData.criticality} ({getCriticalityDescription(formData.criticality).match(/\(([^)]+)\)/)?.[1] || ''})
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Location:</span>
//                 <span className="text-white">{formData.location || 'Not specified'}</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-6">
//             <button 
//               onClick={handleSubmit}
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               <span>📄</span>
//               Save Asset
//             </button>
//             <button 
//               onClick={onClose}
//               className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               🗑️
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Enhanced Defense System Modal Component
// const DefenseSystemModal = ({ onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'firewall',
//     effectiveness: 85,
//     cost: 50000,
//     description: '',
//     implementation_time: '30 days'
//   })

//   const [errors, setErrors] = useState({})

//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!formData.name?.trim()) {
//       newErrors.name = 'Defense system name is required'
//     }
    
//     if (formData.effectiveness < 1 || formData.effectiveness > 100) {
//       newErrors.effectiveness = 'Effectiveness must be between 1 and 100'
//     }
    
//     if (formData.cost < 1000) {
//       newErrors.cost = 'Cost must be at least $1,000'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }
    
//     const cleanData = {
//       ...formData,
//       name: formData.name.trim(),
//       effectiveness: parseFloat(formData.effectiveness),
//       cost: parseFloat(formData.cost),
//       description: formData.description?.trim() || ''
//     }
    
//     onSubmit(cleanData)
//   }

//   const formatCurrency = (value) => {
//     if (value >= 1000000) {
//       return `$${(value / 1000000).toFixed(1)}M`
//     } else if (value >= 1000) {
//       return `$${(value / 1000).toFixed(0)}K`
//     }
//     return `$${value}`
//   }

//   const getEffectivenessLabel = (value) => {
//     if (value <= 25) return '0% (Minimal)'
//     if (value <= 50) return '50% (Moderate)'
//     if (value <= 90) return '90% (Excellent)'
//     return '95% (Maximum)'
//   }

//   const getCostPerProtection = () => {
//     return Math.round(formData.cost / Math.max(formData.effectiveness, 1))
//   }

//   const getROIRating = () => {
//     const ratio = formData.effectiveness / (formData.cost / 10000)
//     if (ratio >= 8) return 'Excellent'
//     if (ratio >= 5) return 'Good'
//     if (ratio >= 3) return 'Fair'
//     return 'Poor'
//   }

//   const getROIColor = (rating) => {
//     switch(rating) {
//       case 'Excellent': return 'text-green-400'
//       case 'Good': return 'text-blue-400'
//       case 'Fair': return 'text-yellow-400'
//       case 'Poor': return 'text-red-400'
//       default: return 'text-gray-400'
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//       <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
//               <span className="text-white text-lg">🛡️</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">Defense System Details</h3>
//               <p className="text-slate-400 text-sm">Configure properties and parameters</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-white">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <div className="space-y-6">
//           {/* Defense Name */}
//           <div>
//             <label className="block text-sm font-medium text-white mb-2">Defense Name *</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none`}
//               placeholder="e.g., Advanced Firewall"
//               required
//             />
//             {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
//           </div>
          
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-white mb-2">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//               className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white h-20 focus:border-blue-500 focus:outline-none resize-none"
//               placeholder="Describe the defense system and how it protects against risks..."
//             />
//           </div>

//           {/* Defense Properties */}
//           <div>
//             <h4 className="text-white font-medium text-lg mb-4">Defense Properties</h4>
            
//             <div className="space-y-6">
//               {/* Risk Mitigation Effectiveness */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-medium text-white">Risk Mitigation Effectiveness</label>
//                   <span className="text-blue-400 font-bold text-lg">{formData.effectiveness}%</span>
//                 </div>
//                 <div className="text-xs text-slate-400 mb-3">Damage reduction</div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${formData.effectiveness}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="1"
//                     max="100"
//                     value={formData.effectiveness}
//                     onChange={(e) => setFormData({...formData, effectiveness: parseInt(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>0% (Minimal)</span>
//                   <span>50% (Moderate)</span>
//                   <span>90% (Excellent)</span>
//                   <span>95% (Maximum)</span>
//                 </div>
//                 {errors.effectiveness && <p className="text-red-400 text-xs mt-1">{errors.effectiveness}</p>}
//               </div>

//               {/* Annual Cost */}
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-medium text-white">Annual Cost</label>
//                   <span className="text-cyan-400 font-bold text-lg">{formatCurrency(formData.cost)}</span>
//                 </div>
//                 <div className="text-xs text-slate-400 mb-3">Yearly investment (USD)</div>
//                 <div className="relative mb-3">
//                   <div className="w-full h-2 bg-slate-700 rounded-full">
//                     <div 
//                       className="h-2 bg-blue-500 rounded-full relative"
//                       style={{ width: `${Math.min(((formData.cost - 1000) / 999000) * 100, 100)}%` }}
//                     >
//                       <div 
//                         className="absolute -top-1 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                   <input
//                     type="range"
//                     min="1000"
//                     max="1000000"
//                     step="1000"
//                     value={formData.cost}
//                     onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
//                     className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
//                   />
//                 </div>
//                 <div className="flex justify-between text-xs text-slate-400">
//                   <span>$1K</span>
//                   <span>$100K</span>
//                   <span>$1M</span>
//                   <span>$10M</span>
//                 </div>
//                 {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
//               </div>
//             </div>
//           </div>

//           {/* Cost-Effectiveness Analysis */}
//           <div className="bg-slate-800 rounded-lg p-4">
//             <h4 className="text-white font-medium mb-3">Cost-Effectiveness Analysis</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Cost per % Protection:</span>
//                 <span className="text-cyan-400 font-medium">{formatCurrency(getCostPerProtection())}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">ROI Rating:</span>
//                 <span className={`font-medium ${getROIColor(getROIRating())}`}>
//                   {getROIRating()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Annual Protection Value:</span>
//                 <span className="text-green-400 font-medium">{formData.effectiveness}% damage reduction</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-6">
//             <button 
//               onClick={handleSubmit}
//               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               <span>📄</span>
//               Save Defense
//             </button>
//             <button 
//               onClick={onClose}
//               className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               🗑️
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Enhanced Monte Carlo Results Modal Component
// const MonteCarloResultsModal = ({ results, scenarioName, onClose }) => {
//   if (!results) return null

//   const formatCurrency = (value) => {
//     if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
//     if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
//     return `${value.toLocaleString()}`
//   }

//   const getRiskLevel = (score) => {
//     if (score < 30) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' }
//     if (score < 60) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
//     if (score < 80) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' }
//     return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' }
//   }

//   const risk = getRiskLevel(results.risk_score || 50)

//   return (
//     <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" data-modal="monte-carlo-results">
//       <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-700">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <BarChart3 className="w-5 h-5 text-purple-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">Monte Carlo Risk Analysis</h2>
//               <p className="text-sm text-gray-400">{results.iterations || 10000} iterations • {scenarioName}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button 
//               onClick={() => downloadResultsAsImage(results, scenarioName)}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
//             >
//               <Download className="w-4 h-4" />
//               <span>Save Results</span>
//             </button>
//             {/* <button 
//               onClick={() => shareResultsAsImage(results, scenarioName)}
//               className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
//             >
//               <Share className="w-4 h-4" />
//               <span>Share</span>
//             </button> */}
//             <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Results Content */}
//         <div className="p-6">
//           {/* Key Metrics Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <TrendingUp className="w-8 h-8 text-blue-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">P50 (Median Impact)</p>
//                   <p className="text-3xl font-bold text-white">{formatCurrency(results.p50_median_impact || 75000)}</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">50% of scenarios result in losses below this amount</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <AlertTriangle className="w-8 h-8 text-orange-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">P90 (Severe Impact)</p>
//                   <p className="text-3xl font-bold text-white">{formatCurrency(results.p90_severe_impact || 180000)}</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">10% chance of losses exceeding this amount</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <DollarSign className="w-8 h-8 text-red-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Worst Case Scenario</p>
//                   <p className="text-3xl font-bold text-white">{formatCurrency(results.worst_case_scenario || 350000)}</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">Maximum potential loss identified</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <BarChart3 className="w-8 h-8 text-blue-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Expected Annual Loss</p>
//                   <p className="text-3xl font-bold text-white">{formatCurrency(results.expected_annual_loss || 95000)}</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">Average expected loss per year</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <Settings className="w-8 h-8 text-yellow-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Value at Risk (95%)</p>
//                   <p className="text-3xl font-bold text-white">{formatCurrency(results.value_at_risk_95 || 200000)}</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">5% chance of exceeding this loss</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
//               <div className="flex items-center space-x-3 mb-3">
//                 <Shield className="w-8 h-8 text-green-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Security ROI</p>
//                   <p className="text-3xl font-bold text-white">{(results.security_roi || 15.5).toFixed(1)}%</p>
//                 </div>
//               </div>
//               <p className="text-xs text-green-400">Return on defense investment</p>
//             </div>
//           </div>

//           {/* Risk Assessment and Analysis */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Risk Distribution */}
//             <div className="bg-gray-700 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 <BarChart3 className="w-5 h-5 mr-2" />
//                 Risk Assessment
//               </h3>
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-white font-bold text-lg">{(results.risk_distribution?.low || 25)}%</span>
//                   </div>
//                   <p className="text-sm text-gray-300 font-medium">Low Risk</p>
//                   <p className="text-xs text-gray-400">Manageable impact</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-white font-bold text-lg">{(results.risk_distribution?.high || 20)}%</span>
//                   </div>
//                   <p className="text-sm text-gray-300 font-medium">High Risk</p>
//                   <p className="text-xs text-gray-400">Significant impact</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-white font-bold text-lg">{(results.risk_distribution?.critical || 10)}%</span>
//                   </div>
//                   <p className="text-sm text-gray-300 font-medium">Critical Risk</p>
//                   <p className="text-xs text-gray-400">Severe impact</p>
//                 </div>
//               </div>
//             </div>

//             {/* Confidence Intervals */}
//             <div className="bg-gray-700 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 <TrendingUp className="w-5 h-5 mr-2" />
//                 Confidence Intervals
//               </h3>
//               <div className="space-y-6">
//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-300">P50 Percentile</span>
//                     <span className="text-sm text-white font-medium">{formatCurrency(results.p50_median_impact || 75000)}</span>
//                   </div>
//                   <div className="w-full bg-gray-600 rounded-full h-3">
//                     <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '50%' }}></div>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">Median expected loss</p>
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-300">P90 Percentile</span>
//                     <span className="text-sm text-white font-medium">{formatCurrency(results.p90_severe_impact || 180000)}</span>
//                   </div>
//                   <div className="w-full bg-gray-600 rounded-full h-3">
//                     <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full" style={{ width: '90%' }}></div>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">Severe loss threshold</p>
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-300">Maximum Loss</span>
//                     <span className="text-sm text-white font-medium">{formatCurrency(results.worst_case_scenario || 350000)}</span>
//                   </div>
//                   <div className="w-full bg-gray-600 rounded-full h-3">
//                     <div className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style={{ width: '100%' }}></div>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">Worst case scenario</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Advanced Analytics */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Value at Risk Analysis */}
//             <div className="bg-gray-700 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 📊 Value at Risk Analysis
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
//                   <div>
//                     <p className="text-sm font-medium text-white">95% VaR</p>
//                     <p className="text-xs text-gray-400">5% chance of exceeding</p>
//                   </div>
//                   <span className="text-xl font-bold text-white">{formatCurrency(results.value_at_risk_95 || 200000)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
//                   <div>
//                     <p className="text-sm font-medium text-white">Expected Shortfall</p>
//                     <p className="text-xs text-gray-400">Average loss beyond VaR</p>
//                   </div>
//                   <span className="text-xl font-bold text-red-400">{formatCurrency(results.conditional_var || 280000)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Component Analysis */}
//             <div className="bg-gray-700 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                 🎯 Components Analyzed
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300">Risk Events</span>
//                   <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
//                     {results.components_analyzed?.risk_events || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300">Business Assets</span>
//                   <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
//                     {results.components_analyzed?.business_assets || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300">Defense Systems</span>
//                   <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
//                     {results.components_analyzed?.defense_systems || 0}
//                   </span>
//                 </div>
//                 <div className="pt-2 border-t border-gray-600">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-300 font-medium">Analysis Date</span>
//                     <span className="text-gray-400 text-sm">
//                       {new Date(results.generated_at || Date.now()).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Impact Distribution Visualization */}
//           <div className="bg-gray-700 rounded-lg p-6 mb-8">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//               📈 Impact Distribution Heat Map
//             </h3>
//             <div className="h-48 flex items-center justify-center bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
//               <div className="text-center">
//                 <div className="w-32 h-16 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-lg mx-auto mb-4 opacity-70"></div>
//                 <p className="text-lg font-medium text-white mb-2">Monte Carlo Distribution</p>
//                 <p className="text-sm text-gray-400 mb-1">Probability density across impact ranges</p>
//                 <p className="text-xs text-gray-500">Green: Low Impact • Yellow: Medium • Orange: High • Red: Critical</p>
//               </div>
//             </div>
//           </div>

//           {/* Risk Summary */}
//           <div className={`${risk.bg} rounded-lg p-6 border border-gray-600`}>
//             <div className="flex items-start space-x-4">
//               <div className={`w-4 h-4 ${risk.color.replace('text-', 'bg-')} rounded-full mt-1 flex-shrink-0`}></div>
//               <div className="flex-1">
//                 <h4 className="text-xl font-bold text-white mb-2">
//                   Risk Assessment: <span className={risk.color}>{risk.level}</span>
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-gray-300 mb-3">
//                       Based on Monte Carlo simulation with <strong>{(results.iterations || 10000).toLocaleString()}</strong> iterations across {results.components_analyzed?.risk_events || 0} risk scenarios.
//                     </p>
//                     <ul className="text-sm text-gray-400 space-y-1">
//                       <li>• Expected annual loss: <span className="text-white">{formatCurrency(results.expected_annual_loss || 95000)}</span></li>
//                       <li>• Security investment ROI: <span className="text-green-400">{(results.security_roi || 15.5).toFixed(1)}%</span></li>
//                       <li>• Risk mitigation coverage: <span className="text-blue-400">{Math.min(95, (results.components_analyzed?.defense_systems || 0) * 25)}%</span></li>
//                     </ul>
//                   </div>
//                   <div>
//                     <h5 className="text-white font-medium mb-2">Recommendations:</h5>
//                     <ul className="text-sm text-gray-400 space-y-1">
//                       {results.security_roi < 20 && <li>• Consider additional security investments</li>}
//                       {(results.components_analyzed?.defense_systems || 0) < 3 && <li>• Implement more defense layers</li>}
//                       {results.risk_score > 70 && <li>• Priority focus on high-impact risks</li>}
//                       <li>• Regular reassessment recommended</li>
//                       <li>• Monitor key risk indicators</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ScenarioCanvas
































































































































import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  LayoutGrid, 
  Zap, 
  Building2, 
  Shield, 
  Save, 
  Share,
  Play,
  ChevronDown,
  ChevronUp,
  X,
  Link,
  Users,
  Database,
  MapPin,
  AlertTriangle,
  Truck,
  Scale,
  HardDrive,
  TrendingUp,
  DollarSign,
  Wifi,
  FileText,
  TrendingDown,
  RotateCcw,
  Settings,
  Trash2,
  Download,
  Loader
} from 'lucide-react';
import { 
  scenariosAPI, 
  riskEventsAPI, 
  businessAssetsAPI, 
  defenseSystemsAPI
} from '../services/api';
import api from '../services/api';
// Updated Analysis API to match backend exactly
const analysisAPI = {
  // Store analysis results in database
  storeResults: async (scenarioId, results) => {
    try {
      const response = await api.post(`/analysis/scenarios/${scenarioId}/results`, results);
      return response.data;
    } catch (error) {
      console.error('Error storing analysis results:', error);
      throw error;
    }
  },

  // Get stored analysis results from database
  getResults: async (scenarioId) => {
    try {
      const response = await api.get(`/analysis/scenarios/${scenarioId}/results`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      throw error;
    }
  },

  // Run Monte Carlo analysis and get real results
  runAnalysis: async (scenarioId) => {
    try {
      console.log('Calling backend analysis endpoint for scenario:', scenarioId);
      const response = await api.post(`/analysis/scenarios/${scenarioId}/run-analysis`);
      return response.data;
    } catch (error) {
      console.error('Error running Monte Carlo analysis:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      throw error;
    }
  }
};

// Risk Event Modal Component with proper backend field mapping
const RiskEventModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'cyber_attack',
    description: '',
    probability: 15,
    impact_min: 10000,
    impact_max: 500000,
    frequency: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'cyber_attack',
        description: initialData.description || '',
        probability: initialData.probability || 15,
        impact_min: initialData.impact_min || 10000,
        impact_max: initialData.impact_max || 500000,
        frequency: initialData.frequency || 1
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        type: 'cyber_attack',
        description: '',
        probability: 15,
        impact_min: 10000,
        impact_max: 500000,
        frequency: 1
      });
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Risk event name is required';
    }
    
    if (formData.probability < 1 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 1 and 100';
    }
    
    if (formData.impact_min < 1000) {
      newErrors.impact_min = 'Minimum impact must be at least $1,000';
    }
    
    if (formData.impact_max < formData.impact_min) {
      newErrors.impact_max = 'Maximum impact must be greater than minimum impact';
    }
    
    if (formData.frequency < 0.1) {
      newErrors.frequency = 'Frequency must be at least 0.1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Create node structure for canvas display + backend data
    const nodeData = {
      id: initialData?.id || `event-${Date.now()}`,
      type: 'event',
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      // Canvas display properties
      position: initialData?.position || {
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 300
      },
      // Backend API fields
      probability: parseFloat(formData.probability),
      impact_min: parseFloat(formData.impact_min),
      impact_max: parseFloat(formData.impact_max),
      frequency: parseFloat(formData.frequency),
      // Visual properties
      color: 'bg-red-500 border-red-400'
    };
    
    onSave(nodeData);
    onClose();
  };

  if (!isOpen) return null;

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Edit Risk Event' : 'Risk Event Details'}
              </h2>
              <p className="text-gray-400 text-sm">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none`}
                placeholder="e.g., Ransomware Attack"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="cyber_attack">Cyber Attack</option>
                <option value="supply_disruption">Supply Disruption</option>
                <option value="operational_risk">Operational Risk</option>
                <option value="legal_action">Legal Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Describe the risk event, potential causes, and impact details..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Risk Parameters</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Likelihood ({formData.probability}%)</label>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Very Rare (1%)</span>
                <span>Possible (25%)</span>
                <span>Likely (50%)</span>
                <span>Very Likely (100%)</span>
              </div>
              {errors.probability && <p className="text-red-400 text-xs mt-1">{errors.probability}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Minimum Financial Impact</label>
                <span className="text-blue-400 font-bold">{formatCurrency(formData.impact_min)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={formData.impact_min}
                onChange={(e) => setFormData(prev => ({ ...prev, impact_min: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              {errors.impact_min && <p className="text-red-400 text-xs mt-1">{errors.impact_min}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Maximum Financial Impact</label>
                <span className="text-orange-400 font-bold">{formatCurrency(formData.impact_max)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={formData.impact_max}
                onChange={(e) => setFormData(prev => ({ ...prev, impact_max: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$1K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              {errors.impact_max && <p className="text-red-400 text-xs mt-1">{errors.impact_max}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Annual Frequency ({formData.frequency}x)</label>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Rare (0.1x)</span>
                <span>Occasional (2x)</span>
                <span>Frequent (10x)</span>
              </div>
              {errors.frequency && <p className="text-red-400 text-xs mt-1">{errors.frequency}</p>}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{initialData ? 'Update Event' : 'Save Event'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Business Asset Modal Component with proper backend field mapping
const BusinessAssetModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'critical_system',
    location: '',
    description: '',
    value: 100000,
    criticality: 'high'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'critical_system',
        location: initialData.location || '',
        description: initialData.description || '',
        value: initialData.value || 100000,
        criticality: initialData.criticality || 'high'
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        type: 'critical_system',
        location: '',
        description: '',
        value: 100000,
        criticality: 'high'
      });
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Asset name is required';
    }
    
    if (formData.value < 1000) {
      newErrors.value = 'Asset value must be at least $1,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Create node structure for canvas display + backend data
    const nodeData = {
  id: initialData?.id || `asset-${Date.now()}`,
  type: 'asset',
  name: formData.name.trim(),
  description: formData.description?.trim() || '',
  // Canvas display properties
  position: initialData?.position || {
    x: 200 + Math.random() * 400,
    y: 250 + Math.random() * 200
  },
  // Backend API fields
  assetType: formData.type,  // ✅ RENAMED TO AVOID CONFLICT
  location: formData.location?.trim() || '',
  value: parseFloat(formData.value),
  criticality: formData.criticality,
  // Visual properties
  color: 'bg-blue-500 border-blue-400'
};
    
    onSave(nodeData);
    onClose();
  };

  if (!isOpen) return null;

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Edit Business Asset' : 'Business Asset Details'}
              </h2>
              <p className="text-gray-400 text-sm">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Asset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none`}
                placeholder="e.g., Customer Database"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="critical_system">Critical System</option>
                <option value="business_location">Business Location</option>
                <option value="data_asset">Data Asset</option>
                <option value="key_personnel">Key Personnel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Primary Data Center"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Describe the business asset and its importance..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Asset Properties</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Asset Valuation</label>
                <span className="text-cyan-400 font-bold">{formatCurrency(formData.value)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$10K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Business Criticality</label>
              <div className="space-y-2">
                {[
                  { value: 'low', label: 'Low', desc: '(25% impact multiplier)', detail: 'Minor impact on operations', color: 'text-green-400' },
                  { value: 'medium', label: 'Medium', desc: '(60% impact multiplier)', detail: 'Moderate impact on operations', color: 'text-yellow-400' },
                  { value: 'high', label: 'High', desc: '(100% impact multiplier)', detail: 'Critical to business operations', color: 'text-red-400' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="criticality"
                      value={option.value}
                      checked={formData.criticality === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, criticality: e.target.value }))}
                      className="text-blue-600"
                    />
                    <div>
                      <span className={`font-medium ${option.color}`}>
                        {option.label}
                      </span>
                      <span className="text-gray-400 ml-1">{option.desc}</span>
                      <p className="text-xs text-gray-500">{option.detail}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{initialData ? 'Update Asset' : 'Save Asset'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Defense System Modal Component with proper backend field mapping
const DefenseSystemModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'firewall',
    description: '',
    effectiveness: 85,
    cost: 50000,
    implementation_time: '30 days'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'firewall',
        description: initialData.description || '',
        effectiveness: initialData.effectiveness || 85,
        cost: initialData.cost || 50000,
        implementation_time: initialData.implementation_time || '30 days'
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        type: 'firewall',
        description: '',
        effectiveness: 85,
        cost: 50000,
        implementation_time: '30 days'
      });
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Defense system name is required';
    }
    
    if (formData.effectiveness < 1 || formData.effectiveness > 100) {
      newErrors.effectiveness = 'Effectiveness must be between 1 and 100';
    }
    
    if (formData.cost < 1000) {
      newErrors.cost = 'Cost must be at least $1,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Create node structure for canvas display + backend data
    const nodeData = {
  id: initialData?.id || `defense-${Date.now()}`,
  type: 'defense',
  name: formData.name.trim(),
  description: formData.description?.trim() || '',
  // Canvas display properties
  position: initialData?.position || {
    x: 400 + Math.random() * 300,
    y: 200 + Math.random() * 250
  },
  // Backend API fields
  defenseType: formData.type,  // ✅ RENAMED TO AVOID CONFLICT
  effectiveness: parseFloat(formData.effectiveness),
  cost: parseFloat(formData.cost),
  implementation_time: formData.implementation_time,
  // Visual properties
  color: 'bg-green-500 border-green-400'
};
    
    onSave(nodeData);
    onClose();
  };

  if (!isOpen) return null;

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Edit Defense System' : 'Defense System Details'}
              </h2>
              <p className="text-gray-400 text-sm">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Defense Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none`}
                placeholder="e.g., Advanced Firewall"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Defense Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="firewall">Firewall</option>
                <option value="antivirus">Antivirus</option>
                <option value="monitoring">Monitoring</option>
                <option value="backup">Backup System</option>
                <option value="training">Security Training</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Describe the defense system and how it protects against risks..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Implementation Time</label>
            <input
              type="text"
              value={formData.implementation_time}
              onChange={(e) => setFormData(prev => ({ ...prev, implementation_time: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 30 days"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Defense Properties</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Risk Mitigation Effectiveness</label>
                <span className="text-blue-400 font-bold">{formData.effectiveness}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.effectiveness}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveness: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1% (Minimal)</span>
                <span>50% (Moderate)</span>
                <span>90% (Excellent)</span>
                <span>100% (Maximum)</span>
              </div>
              {errors.effectiveness && <p className="text-red-400 text-xs mt-1">{errors.effectiveness}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Annual Cost</label>
                <span className="text-cyan-400 font-bold">{formatCurrency(formData.cost)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$1K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost}</p>}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{initialData ? 'Update Defense' : 'Save Defense'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Monte Carlo Results Modal with proper data field mapping
// Fixed Monte Carlo Results Modal with proper hook ordering
// Enhanced MonteCarloResultsModal that works with your sophisticated backend
const MonteCarloResultsModal = ({ results, scenarioName, onClose }) => {
  const [saving, setSaving] = useState(false);
  const [storedResults, setStoredResults] = useState([]);
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  
  // ✅ All hooks FIRST
  useEffect(() => {
    if (results?.scenario_id) {
      loadStoredResults();
      loadAnalysisSummary();
    }
  }, [results]);

  // ✅ Early return AFTER all hooks
  if (!results) return null;

  const loadStoredResults = async () => {
    setLoadingResults(true);
    try {
      const response = await analysisAPI.getResults(results.scenario_id, 10);
      if (response && response.success && response.data) {
        setStoredResults(response.data);
        console.log(`Loaded ${response.results_count} stored analysis results from database`);
      }
    } catch (error) {
      console.warn('Error loading stored results:', error.message);
      setStoredResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const loadAnalysisSummary = async () => {
    try {
      const response = await analysisAPI.getSummary(results.scenario_id);
      if (response && response.success) {
        setAnalysisSummary(response.summary);
      }
    } catch (error) {
      console.warn('Error loading analysis summary:', error.message);
    }
  };

  const handleSaveResults = async () => {
    if (!results?.scenario_id) {
      alert('Cannot save results: Invalid scenario ID');
      return;
    }
    
    try {
      setSaving(true);
      console.log('Saving Monte Carlo results to database:', results);
      
      const response = await analysisAPI.storeResults(results.scenario_id, results);
      console.log('Results saved successfully:', response);
      
      if (response.success) {
        alert(`Analysis results saved to database successfully!\nAnalysis ID: ${response.analysis_id}`);
        
        // Reload stored results and summary
        await loadStoredResults();
        await loadAnalysisSummary();
      }
      
    } catch (error) {
      console.error('Error saving results:', error);
      alert(`Failed to save results: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResult = async (analysisId) => {
    if (window.confirm('Are you sure you want to delete this analysis result?')) {
      try {
        await analysisAPI.deleteResult(results.scenario_id, analysisId);
        alert('Analysis result deleted successfully');
        await loadStoredResults();
        await loadAnalysisSummary();
      } catch (error) {
        alert(`Failed to delete analysis result: ${error.message}`);
      }
    }
  };

  const handleClearAllResults = async () => {
    if (window.confirm(`Are you sure you want to delete all ${storedResults.length} analysis results? This cannot be undone.`)) {
      try {
        await analysisAPI.clearAllResults(results.scenario_id);
        alert('All analysis results cleared successfully');
        await loadStoredResults();
        await loadAnalysisSummary();
      } catch (error) {
        alert(`Failed to clear analysis results: ${error.message}`);
      }
    }
  };

  const loadSpecificResult = async (analysisId) => {
    try {
      const response = await analysisAPI.getSpecificResult(results.scenario_id, analysisId);
      if (response.success) {
        setSelectedHistoryItem(response.data);
      }
    } catch (error) {
      alert(`Failed to load analysis result: ${error.message}`);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score < 80) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const risk = getRiskLevel(results.risk_score || 50);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Monte Carlo Risk Analysis Results</h2>
              <p className="text-sm text-gray-400">
                {results.iterations?.toLocaleString() || '10,000'} iterations • {scenarioName}
                {results.generated_at && (
                  <span className="ml-2">• Generated: {formatDate(results.generated_at)}</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Database Status Indicator */}
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/40">
              Database Connected
            </div>
            
            {/* Save Button */}
            <button 
              onClick={handleSaveResults}
              disabled={saving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save to Database'}</span>
            </button>
            
            {/* Download Button */}
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(results, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `monte-carlo-results-${results.scenario_id}-${Date.now()}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Analysis Summary from Backend */}
          {analysisSummary && analysisSummary.total_analyses > 0 && (
            <div className="bg-blue-600/20 border border-blue-600/40 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">
                    Analysis History Summary
                  </span>
                </div>
                <div className="text-xs text-blue-300">
                  {analysisSummary.total_analyses} total analyses • 
                  Latest risk score: {analysisSummary.latest_risk_score?.toFixed(1)} • 
                  {analysisSummary.trends?.risk_increasing ? (
                    <span className="text-red-400">Risk Increasing ↗</span>
                  ) : (
                    <span className="text-green-400">Risk Stable ↔</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-3 text-xs">
                <div>
                  <span className="text-gray-400">Avg Expected Loss:</span>
                  <span className="text-white ml-1">{formatCurrency(analysisSummary.averages?.expected_annual_loss)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Avg P90 Impact:</span>
                  <span className="text-white ml-1">{formatCurrency(analysisSummary.averages?.p90_severe_impact)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Avg Security ROI:</span>
                  <span className="text-white ml-1">{analysisSummary.averages?.security_roi?.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Last Analysis:</span>
                  <span className="text-white ml-1">{formatDate(analysisSummary.latest_analysis_date)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Key Metrics */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Current Analysis Results</h3>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">P50 (Median Impact)</p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(results.p50_median_impact)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">50% of scenarios result in losses below this amount</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="w-8 h-8 text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-400">P90 (Severe Impact)</p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(results.p90_severe_impact)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">10% chance of losses exceeding this amount</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Expected Annual Loss</p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(results.expected_annual_loss)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Mean of all simulation outcomes</p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Security ROI</p>
                      <p className="text-3xl font-bold text-white">
                        {(results.security_roi || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Return on defense investment</p>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-600 rounded p-4 text-center">
                  <p className="text-gray-400 text-sm">P95 Impact</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(results.p95_impact)}</p>
                </div>
                <div className="bg-gray-600 rounded p-4 text-center">
                  <p className="text-gray-400 text-sm">P99 Worst Case</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(results.p99_worst_case)}</p>
                </div>
                <div className="bg-gray-600 rounded p-4 text-center">
                  <p className="text-gray-400 text-sm">Value at Risk</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(results.value_at_risk_95)}</p>
                </div>
                <div className="bg-gray-600 rounded p-4 text-center">
                  <p className="text-gray-400 text-sm">Risk Score</p>
                  <p className="text-white font-bold text-lg">{(results.risk_score || 0).toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Analysis History */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Analysis History</h3>
                {storedResults.length > 0 && (
                  <button
                    onClick={handleClearAllResults}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {loadingResults ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Loading history...
                </div>
              ) : storedResults.length === 0 ? (
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No previous analyses</p>
                  <p className="text-gray-500 text-xs">Save this analysis to start building history</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {storedResults.map((result, index) => (
                    <div key={result._id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm font-medium">
                            Analysis #{storedResults.length - index}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            getRiskLevel(result.risk_score || 0).color.replace('text-', 'bg-').replace('400', '500/20 text-') + getRiskLevel(result.risk_score || 0).color.split('-')[1] + '-400'
                          }`}>
                            {getRiskLevel(result.risk_score || 0).level}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => loadSpecificResult(result._id)}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteResult(result._id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-400">
                        <div>Expected Loss: <span className="text-white">{formatCurrency(result.expected_annual_loss)}</span></div>
                        <div>P90 Impact: <span className="text-white">{formatCurrency(result.p90_severe_impact)}</span></div>
                        <div>Security ROI: <span className="text-white">{(result.security_roi || 0).toFixed(1)}%</span></div>
                        <div>Date: <span className="text-white">{formatDate(result.stored_at)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Risk Assessment Summary */}
          <div className={`${risk.bg} rounded-lg p-6 border border-gray-600 mt-8`}>
            <div className="flex items-start space-x-4">
              <div className={`w-4 h-4 ${risk.color.replace('text-', 'bg-')} rounded-full mt-1 flex-shrink-0`}></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">
                  Risk Assessment: <span className={risk.color}>{risk.level}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-3">
                      Analysis completed with <strong>{(results.iterations || 10000).toLocaleString()}</strong> Monte Carlo simulations.
                      Results stored in database with analysis ID: <code className="bg-gray-600 px-1 rounded text-xs">{results.scenario_id}</code>
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Expected annual loss: <span className="text-white">{formatCurrency(results.expected_annual_loss)}</span></li>
                      <li>• Security investment ROI: <span className="text-green-400">{(results.security_roi || 0).toFixed(1)}%</span></li>
                      <li>• Total defense budget: <span className="text-cyan-400">{formatCurrency(results.total_defense_cost)}</span></li>
                      <li>• Analysis timestamp: <span className="text-blue-400">{formatDate(results.generated_at)}</span></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">Components Analyzed:</h5>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Risk Events: {results.components_analyzed?.risk_events || 0}</li>
                      <li>• Business Assets: {results.components_analyzed?.business_assets || 0}</li>
                      <li>• Defense Systems: {results.components_analyzed?.defense_systems || 0}</li>
                      <li>• Total Asset Value: {formatCurrency(results.total_asset_value)}</li>
                      <li>• Database Storage: ✅ Active</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Scenario Canvas Component - KEEPING YOUR EXACT VISUAL TEMPLATE
const ScenarioCanvasReplica = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State management - matching your original structure
  const [storedResults, setStoredResults] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showDefenseModal, setShowDefenseModal] = useState(false);
  const [showMonteCarloModal, setShowMonteCarloModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [monteCarloResults, setMonteCarloResults] = useState(null);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  
  // UI state
  const [sidebarSections, setSidebarSections] = useState({
    riskEvents: true,
    businessAssets: true,
    defenseSystems: true,
    mobileOpen: false
  });
  const [droppedComponent, setDroppedComponent] = useState(null);

  const canvasRef = useRef(null);

  // Load scenario data on mount - using proper API calls
  useEffect(() => {
    const loadStoredResults = async () => {
  if (!id || id === 'undefined' || id === 'null') return;

  try {
    const results = await analysisAPI.getResults(id);
    if (results && results.data) {
      setStoredResults(Array.isArray(results.data) ? results.data : [results.data]);
    }
  } catch (error) {
    console.warn('No stored results found:', error);
  }
};
    if (id && id !== 'new') {
      loadScenarioData();
    } else {
      setScenario({
        id: null,
        name: 'New Scenario',
        description: '',
        status: 'draft'
      });
      setComponents([]);
      setConnections([]);
      setLoading(false);
    }
  }, [id]);

  // Draw connections on canvas
  useEffect(() => {
    drawConnections();
  }, [components, connections]);

  // Load scenario data using your API structure
  const loadScenarioData = async () => {
    if (!id || id === 'undefined' || id === 'null') {
      setError('Invalid scenario ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading scenario data for ID:', id);

      // Load scenario first to verify it exists
      const scenarioResponse = await scenariosAPI.getById(id);
      console.log('Scenario loaded:', scenarioResponse);
      
      if (!scenarioResponse || !scenarioResponse.data) {
        throw new Error('Scenario not found');
      }

      setScenario(scenarioResponse.data);

      // Load related data in parallel and convert to components format
      const [riskEventsRes, businessAssetsRes, defenseSystemsRes] = await Promise.allSettled([
        riskEventsAPI.getByScenario(id),
        businessAssetsAPI.getByScenario(id),
        defenseSystemsAPI.getByScenario(id)
      ]);

      const newComponents = [];

      // Convert risk events to components
      if (riskEventsRes.status === 'fulfilled' && riskEventsRes.value?.data) {
        const riskEvents = Array.isArray(riskEventsRes.value.data) ? riskEventsRes.value.data : [];
        riskEvents.forEach((event, index) => {
          newComponents.push({
            id: event._id || event.id || `event-${index}`,
            type: 'event',
            name: event.name,
            description: event.description,
            probability: event.probability,
            impact_min: event.impact_min,
            impact_max: event.impact_max,
            frequency: event.frequency,
            position: {
              x: 100 + (index % 3) * 200,
              y: 100 + Math.floor(index / 3) * 120
            },
            color: 'bg-red-500 border-red-400'
          });
        });
      }

      // Convert business assets to components
      if (businessAssetsRes.status === 'fulfilled' && businessAssetsRes.value?.data) {
        const businessAssets = Array.isArray(businessAssetsRes.value.data) ? businessAssetsRes.value.data : [];
        businessAssets.forEach((asset, index) => {
          newComponents.push({
            id: asset._id || asset.id || `asset-${index}`,
            type: 'asset',
            name: asset.name,
            description: asset.description,
            value: asset.value,
            criticality: asset.criticality,
            location: asset.location,
            position: {
              x: 200 + (index % 2) * 300,
              y: 300 + Math.floor(index / 2) * 120
            },
            color: 'bg-blue-500 border-blue-400'
          });
        });
      }

      // Convert defense systems to components
      if (defenseSystemsRes.status === 'fulfilled' && defenseSystemsRes.value?.data) {
        const defenseSystems = Array.isArray(defenseSystemsRes.value.data) ? defenseSystemsRes.value.data : [];
        defenseSystems.forEach((defense, index) => {
          newComponents.push({
            id: defense._id || defense.id || `defense-${index}`,
            type: 'defense',
            name: defense.name,
            description: defense.description,
            effectiveness: defense.effectiveness,
            cost: defense.cost,
            implementation_time: defense.implementation_time,
            position: {
              x: 400 + index * 150,
              y: 500 + (index % 2) * 100
            },
            color: 'bg-green-500 border-green-400'
          });
        });
      }

      setComponents(newComponents);
      console.log('All data loaded successfully');

    } catch (error) {
      console.error('Error loading scenario data:', error);
      setError(`Failed to load scenario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save scenario using proper API calls
  const saveScenario = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const scenarioData = {
        name: scenario?.name || 'New Risk Scenario',
        description: scenario?.description || '',
        status: scenario?.status || 'draft'
      };
      
      let response;
      if (scenario?.id) {
        response = await scenariosAPI.update(scenario.id, scenarioData);
      } else {
        response = await scenariosAPI.create(scenarioData);
      }
      
      let updatedScenario = response;
      if (response.scenario) {
        updatedScenario = response.scenario;
      } else if (response.data?.scenario) {
        updatedScenario = response.data.scenario;
      }
      
      if (updatedScenario && updatedScenario.id) {
        setScenario(updatedScenario);
        if (!scenario?.id && updatedScenario.id) {
          navigate(`/scenarios/${updatedScenario.id}`, { replace: true });
        }
      }
      
      return updatedScenario;
      
    } catch (error) {
      console.error('Error saving scenario:', error);
      setError(`Failed to save scenario: ${error.message}`);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Run Monte Carlo Analysis using proper API
  const runMonteCarloAnalysis = async () => {
  if (!id || id === 'undefined' || id === 'null') {
    setError('Cannot run analysis: Invalid scenario ID');
    return;
  }

  const riskComponents = components.filter(c => c.type === 'event');
  if (riskComponents.length === 0) {
    setError('Please add at least one risk event before running analysis');
    return;
  }

  try {
    setRunningAnalysis(true);
    setError(null);
    
    console.log('Running REAL Monte Carlo analysis for scenario:', id);
    
    // First ensure scenario components are saved to backend
    await saveComponentsToBackend();
    
    // Call the REAL backend Monte Carlo analysis
    const response = await analysisAPI.runAnalysis(id);
    console.log('REAL Analysis results from backend:', response);
    
    // Use the REAL results from the backend
    const realResults = {
      scenario_id: id,
      generated_at: new Date().toISOString(),
      
      // REAL statistical results from backend Monte Carlo simulation
      iterations: response.iterations || 10000,
      p50_median_impact: response.p50_median_impact || 0,
      p90_severe_impact: response.p90_severe_impact || 0,
      p95_impact: response.p95_impact || 0,
      p99_worst_case: response.p99_worst_case || 0,
      expected_annual_loss: response.expected_annual_loss || 0,
      value_at_risk_95: response.value_at_risk_95 || 0,
      conditional_var_95: response.conditional_var_95 || 0,
      standard_deviation: response.standard_deviation || 0,
      maximum_loss: response.maximum_loss || 0,
      minimum_loss: response.minimum_loss || 0,
      
      // REAL confidence intervals from backend
      confidence_intervals: response.confidence_intervals || {
        p10: response.p10 || 0,
        p25: response.p25 || 0,
        p75: response.p75 || 0,
        p90: response.p90 || 0
      },
      
      // REAL business metrics from backend
      security_roi: response.security_roi || 0,
      risk_score: response.risk_score || 0,
      total_defense_cost: response.total_defense_cost || 0,
      total_asset_value: response.total_asset_value || 0,
      
      // REAL component analysis from backend
      components_analyzed: {
        risk_events: response.components_analyzed?.risk_events || riskComponents.length,
        business_assets: response.components_analyzed?.business_assets || components.filter(c => c.type === 'asset').length,
        defense_systems: response.components_analyzed?.defense_systems || components.filter(c => c.type === 'defense').length
      }
    };
    
    console.log('Processed REAL Monte Carlo results:', realResults);
    
    setMonteCarloResults(realResults);
    setShowMonteCarloModal(true);
    
  } catch (error) {
    console.error('Error running REAL Monte Carlo analysis:', error);
    setError(`Analysis failed: ${error.message}`);
  } finally {
    setRunningAnalysis(false);
  }
};

  // Save components to backend for Monte Carlo analysis
 const saveComponentsToBackend = async () => {
  if (!id || id === 'undefined' || id === 'null') return;

  try {
    const riskEvents = components.filter(c => c.type === 'event');
    const businessAssets = components.filter(c => c.type === 'asset');
    const defenseSystems = components.filter(c => c.type === 'defense');

    // Create risk events with proper backend fields
    for (const event of riskEvents) {
      const riskEventData = {
        name: event.name,
        type: event.eventType || 'cyber_attack',  // ✅ USE eventType if you have it, or default
        description: event.description || '',
        probability: event.probability || 15,
        impact_min: event.impact_min || 10000,
        impact_max: event.impact_max || 500000,
        frequency: event.frequency || 1
      };
      
      try {
        await riskEventsAPI.create(id, riskEventData);
      } catch (error) {
        console.warn('Risk event may already exist:', error);
      }
    }

    // Create business assets with proper backend fields
    for (const asset of businessAssets) {
      const assetData = {
        name: asset.name,
        type: asset.assetType || 'critical_system',  // ✅ USE assetType
        value: asset.value || 100000,
        description: asset.description || '',
        criticality: asset.criticality || 'high',
        location: asset.location || ''
      };
      
      try {
        await businessAssetsAPI.create(id, assetData);
      } catch (error) {
        console.warn('Business asset may already exist:', error);
      }
    }

    // Create defense systems with proper backend fields
    for (const defense of defenseSystems) {
      const defenseData = {
        name: defense.name,
        type: defense.defenseType || 'firewall',  // ✅ USE defenseType
        effectiveness: defense.effectiveness || 85,
        cost: defense.cost || 50000,
        description: defense.description || '',
        implementation_time: defense.implementation_time || '30 days'
      };
      
      try {
        await defenseSystemsAPI.create(id, defenseData);
      } catch (error) {
        console.warn('Defense system may already exist:', error);
      }
    }

  } catch (error) {
    console.warn('Error saving components to backend:', error);
  }
};

  // Draw connections on canvas
  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw connections
    connections.forEach(connection => {
      const fromComponent = components.find(c => c.id === connection.from);
      const toComponent = components.find(c => c.id === connection.to);
      
      if (fromComponent && toComponent) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(fromComponent.position.x, fromComponent.position.y);
        ctx.lineTo(toComponent.position.x, toComponent.position.y);
        ctx.stroke();
        
        // Draw connection points
        ctx.fillStyle = '#3b82f6';
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.arc(fromComponent.position.x, fromComponent.position.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(toComponent.position.x, toComponent.position.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  // Component management functions
  const addComponent = (nodeData) => {
    const newComponent = {
      ...nodeData,
      color: getComponentColor(nodeData.type)
    };
    
    setComponents(prev => [...prev, newComponent]);
    setDroppedComponent(null);
    
    // Auto-save after adding component
    setTimeout(() => {
      if (scenario?.id) {
        saveComponentToBackend(newComponent);
      }
    }, 500);
  };

  // Save individual component to backend
  const saveComponentToBackend = async (component) => {
    if (!id || !scenario?.id) return;

    try {
      if (component.type === 'event') {
        const riskEventData = {
          name: component.name,
          type: component.type || 'cyber_attack',
          description: component.description || '',
          probability: component.probability || 15,
          impact_min: component.impact_min || 10000,
          impact_max: component.impact_max || 500000,
          frequency: component.frequency || 1
        };
        await riskEventsAPI.create(id, riskEventData);
      } else if (component.type === 'asset') {
        const assetData = {
          name: component.name,
          type: component.type || 'critical_system',
          value: component.value || 100000,
          description: component.description || '',
          criticality: component.criticality || 'high',
          location: component.location || ''
        };
        await businessAssetsAPI.create(id, assetData);
      } else if (component.type === 'defense') {
        const defenseData = {
          name: component.name,
          type: component.type || 'firewall',
          effectiveness: component.effectiveness || 85,
          cost: component.cost || 50000,
          description: component.description || '',
          implementation_time: component.implementation_time || '30 days'
        };
        await defenseSystemsAPI.create(id, defenseData);
      }
    } catch (error) {
      console.warn('Error saving component to backend:', error);
    }
  };

  const updateComponent = (updatedComponent) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
    setEditingComponent(null);
  };

   const deleteComponent = (componentId) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setConnections(prev => prev.filter(c => c.from !== componentId && c.to !== componentId));
    setSelectedComponent(null);
  };

  const editComponent = (component) => {
    setEditingComponent(component);
    
    if (component.type === 'event') {
      setShowRiskModal(true);
    } else if (component.type === 'asset') {
      setShowAssetModal(true);
    } else if (component.type === 'defense') {
      setShowDefenseModal(true);
    }
  };

  // Connection management
  const handleComponentClick = (component) => {
    if (isConnecting && connectionStart) {
      if (connectionStart !== component.id) {
        const newConnection = {
          from: connectionStart,
          to: component.id,
          type: getEdgeType(connectionStart, component.id)
        };
        setConnections(prev => [...prev, newConnection]);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    } else if (isConnecting) {
      setConnectionStart(component.id);
    } else {
      setSelectedComponent(component.id === selectedComponent ? null : component.id);
    }
  };

  const startConnection = (componentId) => {
    setIsConnecting(true);
    setConnectionStart(componentId);
  };

  // Helper functions
  const getEdgeType = (fromId, toId) => {
    const fromComponent = components.find(c => c.id === fromId);
    const toComponent = components.find(c => c.id === toId);
    
    if (fromComponent?.type === 'event' && toComponent?.type === 'asset') {
      return 'event-to-asset';
    } else if (fromComponent?.type === 'asset' && toComponent?.type === 'defense') {
      return 'asset-to-defense';
    } else if (fromComponent?.type === 'event' && toComponent?.type === 'defense') {
      return 'event-to-defense';
    }
    return 'connection';
  };

  const getComponentColor = (type) => {
    switch (type) {
      case 'event':
        return 'bg-red-500 border-red-400';
      case 'asset':
        return 'bg-blue-500 border-blue-400';
      case 'defense':
        return 'bg-green-500 border-green-400';
      default:
        return 'bg-gray-500 border-gray-400';
    }
  };

  const ComponentIcon = ({ type }) => {
    switch (type) {
      case 'event':
        return <Zap className="w-6 h-6 text-white" />;
      case 'asset':
        return <Building2 className="w-6 h-6 text-white" />;
      case 'defense':
        return <Shield className="w-6 h-6 text-white" />;
      default:
        return <div className="w-6 h-6 bg-white rounded" />;
    }
  };

  // Calculate progress and metrics
  const totalComponents = components.length;
  const progress = Math.min(Math.floor((totalComponents / 6) * 100), 100);
  const completedSteps = Math.min(Math.floor(totalComponents / 2), 4);

  const riskComponents = components.filter(c => c.type === 'event');
  const assetComponents = components.filter(c => c.type === 'asset');
  const defenseComponents = components.filter(c => c.type === 'defense');

  const p50Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + ((r.impact_max || 0) * (r.probability || 0) / 100), 0) * 0.5 / 1000) + 'K' : 
    'N/A';
    
  const p90Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + (r.impact_max || 0), 0) * 0.9 / 1000) + 'K' : 
    'N/A';

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white">Loading scenario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Modals */}
      <RiskEventModal
        isOpen={showRiskModal}
        onClose={() => {
          setShowRiskModal(false);
          setEditingComponent(null);
          setDroppedComponent(null);
        }}
        onSave={editingComponent ? updateComponent : addComponent}
        initialData={editingComponent}
      />
      
      <BusinessAssetModal
        isOpen={showAssetModal}
        onClose={() => {
          setShowAssetModal(false);
          setEditingComponent(null);
          setDroppedComponent(null);
        }}
        onSave={editingComponent ? updateComponent : addComponent}
        initialData={editingComponent}
      />
      
      <DefenseSystemModal
        isOpen={showDefenseModal}
        onClose={() => {
          setShowDefenseModal(false);
          setEditingComponent(null);
          setDroppedComponent(null);
        }}
        onSave={editingComponent ? updateComponent : addComponent}
        initialData={editingComponent}
      />
      
      <MonteCarloResultsModal
        results={monteCarloResults}
        scenarioName={scenario?.name || 'Risk Analysis'}
        onClose={() => setShowMonteCarloModal(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - EXACTLY like your screenshot */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/scenarios')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{scenario?.name || 'okkk'}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{scenario?.description || 'No description'}</span>
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  <span>{saving ? 'Saving...' : 'Auto-saved'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={saveScenario}
                disabled={saving}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save</span>
              </button>
              
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button 
                onClick={runMonteCarloAnalysis}
                disabled={runningAnalysis || riskComponents.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {runningAnalysis ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Run Scenario</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Header - EXACTLY like your screenshot */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Scenario Canvas</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="text-gray-400">open</span>
                <span>Preview:</span>
                <span className="text-cyan-400">P50 {p50Impact}</span>
                <span className="text-orange-400">P90 {p90Impact}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Smart Layout</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Impact Analysis Section - EXACTLY like your screenshot */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Impact Analysis</h3>
                  <p className="text-sm text-gray-400">Complete all actions to run full analysis</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{completedSteps}/4</span>
                <p className="text-xs text-gray-400">Actions Complete</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-medium text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Action Steps - EXACTLY like your screenshot */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { 
                  label: 'Validate Components', 
                  desc: 'Ensure all scenario compo...', 
                  completed: totalComponents > 0, 
                  icon: '✓',
                  bgColor: totalComponents > 0 ? 'bg-green-600' : 'bg-gray-700'
                },
                { 
                  label: 'Verify Connections', 
                  desc: 'Validate that componen...', 
                  completed: connections.length > 0, 
                  icon: '⚠',
                  bgColor: connections.length > 0 ? 'bg-green-600' : 'bg-orange-600'
                },
                { 
                  label: 'Configure Parameters', 
                  desc: 'Set Monte Carlo simulatio...', 
                  completed: riskComponents.length >= 1, 
                  icon: '✓',
                  bgColor: riskComponents.length >= 1 ? 'bg-green-600' : 'bg-gray-700'
                },
                { 
                  label: 'Review Scenario', 
                  desc: 'Perform a final review of t...', 
                  completed: totalComponents >= 3, 
                  icon: '●',
                  bgColor: totalComponents >= 3 ? 'bg-green-600' : 'bg-gray-700'
                }
              ].map((step, index) => (
                <div key={index} className={`${step.bgColor} rounded-lg p-4 text-left`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white text-sm">{step.icon}</span>
                    <span className="text-white text-sm font-medium">{step.label}</span>
                  </div>
                  <p className="text-gray-200 text-xs">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600/40 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Complete all required actions to unlock analysis</span>
              </div>
            </div>

            <button 
              onClick={runMonteCarloAnalysis}
              disabled={runningAnalysis || riskComponents.length === 0}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runningAnalysis ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Running Analysis...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Run Full Impact Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Canvas Area - EXACTLY like your screenshot with drag/drop and connections */}
          <div
            className="bg-gray-800 rounded-lg flex-1 relative overflow-hidden min-h-[500px] border-2 border-dashed border-transparent transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-500/10');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');

              try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                setDroppedComponent({
                  ...data,
                  position: { x, y }
                });

                if (data.type === 'risk_event') {
                  setShowRiskModal(true);
                } else if (data.type === 'business_asset') {
                  setShowAssetModal(true);
                } else if (data.type === 'defense_system') {
                  setShowDefenseModal(true);
                }
              } catch (error) {
                console.error('Error parsing dropped data:', error);
              }
            }}
          >
            {/* Canvas for connections */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Components - EXACTLY like your screenshot */}
            {components.map((component) => (
              <div
                key={component.id}
                className={`absolute rounded-lg w-20 h-20 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform border-2 group ${
                  selectedComponent === component.id 
                    ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' 
                    : component.color
                }`}
                style={{
                  left: `${component.position.x}px`,
                  top: `${component.position.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleComponentClick(component)}
                onDoubleClick={() => editComponent(component)}
              >
                <ComponentIcon type={component.type} />
                <span className="text-xs text-white font-medium text-center mt-1 px-1 leading-tight">
                  {component.name}
                </span>
                
                {/* Component controls on hover */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startConnection(component.id);
                    }}
                    className="w-5 h-5 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white"
                    title="Connect"
                  >
                    <Link className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editComponent(component);
                    }}
                    className="w-5 h-5 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white"
                    title="Edit"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${component.name}"?`)) {
                        deleteComponent(component.id);
                      }
                    }}
                    className="w-5 h-5 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white"
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Connection mode indicator */}
            {isConnecting && (
              <div className="absolute top-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-medium">
                  {connectionStart ? 'Click target component to connect' : 'Connection mode active'}
                </p>
                <button
                  onClick={() => {
                    setIsConnecting(false);
                    setConnectionStart(null);
                  }}
                  className="text-xs underline hover:no-underline"
                >
                  Cancel connection
                </button>
              </div>
            )}

            {/* Empty state */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-dashed border-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-cyan-500">+</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Building Your Scenario</h3>
                  <p className="text-gray-400 mb-6">Drag components from the sidebar to begin modeling</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - EXACTLY like your screenshot */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto hidden md:block">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Scenario Components</h2>
            <p className="text-sm text-gray-400">Drag components onto the canvas to build your scenario</p>
          </div>

          {/* Risk Events Section */}
          <div className="mb-6">
            <button
              onClick={() => setSidebarSections(prev => ({ ...prev, riskEvents: !prev.riskEvents }))}
              className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors text-sm tracking-wide"
            >
              <span>RISK EVENTS</span>
              {sidebarSections.riskEvents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {sidebarSections.riskEvents && (
              <div className="space-y-3">
                {[
                  { name: 'Add Cyber Attack', desc: 'Ransomware, data breaches', icon: Zap, type: 'cyber_attack' },
                  { name: 'Add Supply Disruption', desc: 'Supplier failures, logistics', icon: Truck, type: 'supply_disruption' },
                  { name: 'Add Operational Risk', desc: 'Process failures, human errors', icon: AlertTriangle, type: 'operational_risk' },
                  { name: 'Add Legal Action', desc: 'Lawsuits, regulatory issues', icon: Scale, type: 'legal_action' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'risk_event',
                        name: item.name.replace('Add ', ''),
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowRiskModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move border-dashed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Assets Section */}
          <div className="mb-6">
            <button
              onClick={() => setSidebarSections(prev => ({ ...prev, businessAssets: !prev.businessAssets }))}
              className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors text-sm tracking-wide"
            >
              <span>BUSINESS ASSETS</span>
              {sidebarSections.businessAssets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {sidebarSections.businessAssets && (
              <div className="space-y-3">
                {[
                  { name: 'Add Critical System', desc: 'IT infrastructure, databases', icon: Building2, type: 'critical_system' },
                  { name: 'Add Business Location', desc: 'Offices, plants', icon: MapPin, type: 'business_location' },
                  { name: 'Add Data Asset', desc: 'Customer data, IP', icon: Database, type: 'data_asset' },
                  { name: 'Add Key Personnel', desc: 'Critical staff, expertise', icon: Users, type: 'key_personnel' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'business_asset',
                        name: item.name.replace('Add ', ''),
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowAssetModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move border-dashed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Defense Systems Section */}
          <div className="mb-6">
            <button
              onClick={() => setSidebarSections(prev => ({ ...prev, defenseSystems: !prev.defenseSystems }))}
              className="flex items-center justify-between w-full text-white font-medium mb-3 hover:text-cyan-400 transition-colors text-sm tracking-wide"
            >
              <span>DEFENSE SYSTEMS</span>
              {sidebarSections.defenseSystems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {sidebarSections.defenseSystems && (
              <div className="space-y-3">
                {[
                  { name: 'Add Security Control', desc: 'Firewalls, monitoring', icon: Shield, type: 'security_control' },
                  { name: 'Add Business Continuity', desc: 'DR, redundancy', icon: RotateCcw, type: 'business_continuity' },
                  { name: 'Add Insurance Coverage', desc: 'Risk transfer, coverage', icon: FileText, type: 'insurance_coverage' },
                  { name: 'Add Backup Systems', desc: 'Data backup, recovery', icon: HardDrive, type: 'backup_systems' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'defense_system',
                        name: item.name.replace('Add ', ''),
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowDefenseModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move border-dashed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setSidebarSections(prev => ({ ...prev, mobileOpen: !prev.mobileOpen }))}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarSections.mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setSidebarSections(prev => ({ ...prev, mobileOpen: false }))}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-gray-800 overflow-y-auto transform translate-x-0 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Components</h2>
              <button 
                onClick={() => setSidebarSections(prev => ({ ...prev, mobileOpen: false }))}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <button
                  onClick={() => { 
                    setShowRiskModal(true); 
                    setSidebarSections(prev => ({ ...prev, mobileOpen: false })); 
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Add Risk Event</span>
                  </div>
                </button>
                <button
                  onClick={() => { 
                    setShowAssetModal(true); 
                    setSidebarSections(prev => ({ ...prev, mobileOpen: false })); 
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Add Business Asset</span>
                  </div>
                </button>
                <button
                  onClick={() => { 
                    setShowDefenseModal(true); 
                    setSidebarSections(prev => ({ ...prev, mobileOpen: false })); 
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-3 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Add Defense System</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioCanvasReplica;




















