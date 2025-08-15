import React from 'react'
import { X, Download, Share, TrendingUp, AlertTriangle, DollarSign, Shield, BarChart3 } from 'lucide-react'

// Enhanced Download Results Function - Captures Complete Modal
const downloadResultsAsImage = async (results, scenarioName = "risk-analysis") => {
  try {
    // Check if html2canvas is available
    if (typeof html2canvas !== 'undefined') {
      // Find the modal element by its data attribute
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
      if (modalElement) {
        console.log('Capturing complete modal element...', modalElement)
        
        // Find the scrollable content area
        const scrollableContent = modalElement.querySelector('.overflow-y-auto')
        const originalOverflow = scrollableContent ? scrollableContent.style.overflow : null
        const originalHeight = scrollableContent ? scrollableContent.style.height : null
        const originalMaxHeight = scrollableContent ? scrollableContent.style.maxHeight : null
        
        // Temporarily remove overflow and height constraints to show all content
        if (scrollableContent) {
          scrollableContent.style.overflow = 'visible'
          scrollableContent.style.height = 'auto'
          scrollableContent.style.maxHeight = 'none'
        }
        
        // Also fix the modal container
        const originalModalHeight = modalElement.style.maxHeight
        const originalModalOverflow = modalElement.style.overflow
        modalElement.style.maxHeight = 'none'
        modalElement.style.overflow = 'visible'
        
        // Wait a moment for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Get the full dimensions of the content
        const fullWidth = modalElement.scrollWidth
        const fullHeight = modalElement.scrollHeight
        
        console.log('Full modal dimensions:', fullWidth, 'x', fullHeight)
        
        // Configure html2canvas options for complete capture
        const canvas = await html2canvas(modalElement, {
          backgroundColor: '#1f2937', // Gray-800 background
          scale: 1.5, // Good resolution without being too large
          useCORS: true,
          allowTaint: true,
          width: fullWidth,
          height: fullHeight,
          scrollX: 0,
          scrollY: 0,
          logging: false,
          removeContainer: false,
          foreignObjectRendering: true,
          onclone: (clonedDoc) => {
            // Ensure the cloned element also shows all content
            const clonedElement = clonedDoc.querySelector('[data-modal="monte-carlo-results"]')
            const clonedScrollable = clonedDoc.querySelector('.overflow-y-auto')
            
            if (clonedElement) {
              clonedElement.style.transform = 'none'
              clonedElement.style.position = 'relative'
              clonedElement.style.top = '0'
              clonedElement.style.left = '0'
              clonedElement.style.maxHeight = 'none'
              clonedElement.style.overflow = 'visible'
            }
            
            if (clonedScrollable) {
              clonedScrollable.style.overflow = 'visible'
              clonedScrollable.style.height = 'auto'
              clonedScrollable.style.maxHeight = 'none'
            }
          }
        })
        
        // Restore original styles
        if (scrollableContent) {
          scrollableContent.style.overflow = originalOverflow || ''
          scrollableContent.style.height = originalHeight || ''
          scrollableContent.style.maxHeight = originalMaxHeight || ''
        }
        modalElement.style.maxHeight = originalModalHeight || ''
        modalElement.style.overflow = originalModalOverflow || ''
        
        console.log('Canvas created with full content:', canvas.width, 'x', canvas.height)
        
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
          
          console.log('Complete Monte Carlo results image downloaded successfully')
          alert('Complete analysis results saved as image!')
        }, 'image/png', 0.92) // High quality PNG
        
        return
      } else {
        console.error('Modal element not found')
      }
    } else {
      console.error('html2canvas library not found')
    }
    
    // Fallback method
    console.log('Using fallback download method')
    alert('Image capture not available. Please ensure html2canvas library is loaded.')
    
  } catch (error) {
    console.error('Error downloading results as image:', error)
    alert('Error downloading image. Please try again.')
  }
}

// Enhanced Share Results Function
const shareResultsAsImage = async (results, scenarioName = "risk-analysis") => {
  try {
    if (typeof html2canvas !== 'undefined') {
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]')
      
      if (modalElement) {
        const canvas = await html2canvas(modalElement, {
          backgroundColor: '#1f2937',
          scale: 1.5,
          useCORS: true
        })
        
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
          downloadResultsAsImage(results, scenarioName)
          
        }, 'image/png', 0.9)
        
        return
      }
    }
    
    alert('Image sharing not available. Please try downloading instead.')
    
  } catch (error) {
    console.error('Error sharing results:', error)
    alert('Error sharing results. Please try downloading instead.')
  }
}

const MonteCarloResults = ({ scenarioId, results, onClose, scenarioName = "Risk Analysis" }) => {
  // Use real results from the API
  const analysisResults = results || {
    p50_median_impact: 0,
    p90_severe_impact: 0,
    p99_worst_case: 0,
    expected_annual_loss: 0,
    value_at_risk_95: 0,
    security_roi: 0,
    total_defense_cost: 0,
    total_asset_value: 0,
    confidence_intervals: {
      p10: 0,
      p25: 0,
      p75: 0,
      p90: 0
    }
  }

  // Calculate risk percentages based on actual data
  const calculateRiskPercentage = (impact, maxImpact) => {
    if (!maxImpact || maxImpact === 0) return 0
    return Math.min(Math.round((impact / maxImpact) * 100), 100)
  }

  const maxImpact = Math.max(
    analysisResults.p99_worst_case, 
    analysisResults.total_asset_value,
    1000000 // Minimum scale
  )

  const medianRisk = calculateRiskPercentage(analysisResults.p50_median_impact, maxImpact)
  const severeRisk = calculateRiskPercentage(analysisResults.p90_severe_impact, maxImpact)
  const worstCaseRisk = calculateRiskPercentage(analysisResults.p99_worst_case, maxImpact)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gray-800 rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-hidden"
        data-modal="monte-carlo-results"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Monte Carlo Risk Analysis</h2>
              <p className="text-gray-400 text-sm">{analysisResults.iterations || 10000} iterations • {scenarioName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => downloadResultsAsImage(analysisResults, scenarioName)}
              className="btn-primary flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Save Results</span>
            </button>
            <button 
              onClick={() => shareResultsAsImage(analysisResults, scenarioName)}
              className="btn-secondary flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">P50 (Median Impact)</span>
              </div>
              <p className="text-2xl font-bold text-white">${analysisResults.p50_median_impact?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">1d downtime • {medianRisk <= 30 ? 'Low' : medianRisk <= 70 ? 'Medium' : 'High'} risk</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-gray-400 text-sm">P90 (Severe Impact)</span>
              </div>
              <p className="text-2xl font-bold text-white">${analysisResults.p90_severe_impact?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">1d downtime • {severeRisk <= 30 ? 'Low' : severeRisk <= 70 ? 'Medium' : 'High'} risk</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 text-sm">Worst Case Scenario</span>
              </div>
              <p className="text-2xl font-bold text-white">${analysisResults.p99_worst_case?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">1d downtime • {worstCaseRisk <= 30 ? 'Low' : worstCaseRisk <= 70 ? 'Medium' : 'Critical'} risk</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400 text-sm">Expected Annual Loss</span>
              </div>
              <p className="text-2xl font-bold text-white">${analysisResults.expected_annual_loss?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">Annualized risk exposure</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Value at Risk (95%)</span>
              </div>
              <p className="text-2xl font-bold text-white">${analysisResults.value_at_risk_95?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">95% confidence level</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Security ROI</span>
              </div>
              <p className="text-2xl font-bold text-white">{analysisResults.security_roi?.toFixed(1) || '0.0'}%</p>
              <p className="text-xs text-green-400">Return on defense investment</p>
            </div>
          </div>

          {/* Risk Assessment Circles */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">Risk Assessment</h3>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-400">{medianRisk}%</span>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-30"
                    style={{
                      background: `conic-gradient(#60a5fa ${medianRisk * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
                <p className="text-white font-medium">Median Risk</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-400">{severeRisk}%</span>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-orange-400 opacity-30"
                    style={{
                      background: `conic-gradient(#fb923c ${severeRisk * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
                <p className="text-white font-medium">Severe Risk</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">{worstCaseRisk}%</span>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-red-400 opacity-30"
                    style={{
                      background: `conic-gradient(#f87171 ${worstCaseRisk * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
                <p className="text-white font-medium">Worst Case</p>
              </div>
            </div>
          </div>

          {/* Confidence Intervals */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">Confidence Intervals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">P50 Percentile</span>
                  <span className="text-white font-medium">${analysisResults.p50_median_impact?.toLocaleString() || '0'} 24h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((analysisResults.p50_median_impact / (analysisResults.p99_worst_case || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">P90 Percentile</span>
                  <span className="text-white font-medium">${analysisResults.p90_severe_impact?.toLocaleString() || '0'} 24h</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((analysisResults.p90_severe_impact / (analysisResults.p99_worst_case || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Value at Risk Analysis */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">Value at Risk Analysis</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Value at Risk (VaR)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">p90 Confidence:</span>
                    <span className="text-white">${analysisResults.value_at_risk_95?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Standard Deviation:</span>
                    <span className="text-white">${analysisResults.standard_deviation?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Conditional VaR (Expected Shortfall)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">p90 CVaR:</span>
                    <span className="text-red-400">${analysisResults.conditional_var_95?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Maximum Loss:</span>
                    <span className="text-red-400">${analysisResults.maximum_loss?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analysis Summary */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Analysis Summary</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Investment Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Defense Cost:</span>
                    <span className="text-white">${analysisResults.total_defense_cost?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Asset Value:</span>
                    <span className="text-white">${analysisResults.total_asset_value?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Simulation Iterations:</span>
                    <span className="text-white">{analysisResults.iterations?.toLocaleString() || '10,000'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Risk Insights</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    • {analysisResults.expected_annual_loss > 100000 ? 'High' : analysisResults.expected_annual_loss > 50000 ? 'Medium' : 'Low'} 
                    expected annual loss of ${analysisResults.expected_annual_loss?.toLocaleString() || '0'}
                  </p>
                  <p className="text-gray-300">
                    • Defense systems provide {analysisResults.security_roi > 0 ? 'positive' : 'negative'} ROI 
                    of {analysisResults.security_roi?.toFixed(1) || '0.0'}%
                  </p>
                  <p className="text-gray-300">
                    • 95% confidence that losses will not exceed ${analysisResults.value_at_risk_95?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonteCarloResults