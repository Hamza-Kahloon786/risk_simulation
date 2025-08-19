// frontend/src/components/ScenarioCanvas/utils.jsx
import React from 'react'
import { 
  Zap, 
  Building, 
  AlertTriangle, 
  Scale, 
  Server, 
  MapPin, 
  Database, 
  Users 
} from 'lucide-react'

// Download Results as Image Function
export const downloadResultsAsImage = async (results, scenarioName) => {
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
export const shareResultsAsImage = async (results, scenarioName) => {
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
export const downloadResults = async (results, scenarioName) => {
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
export const shareResults = async (results, scenarioName) => {
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

// Helper Functions for Icons and Colors
export const getIconForRiskType = (type) => {
  switch (type) {
    case 'cyber_attack': return <Zap className="w-4 h-4" />
    case 'supply_disruption': return <Building className="w-4 h-4" />
    case 'operational_risk': return <AlertTriangle className="w-4 h-4" />
    case 'legal_action': return <Scale className="w-4 h-4" />
    default: return <Zap className="w-4 h-4" />
  }
}

export const getIconForAssetType = (type) => {
  switch (type) {
    case 'critical_system': return <Server className="w-4 h-4" />
    case 'business_location': return <MapPin className="w-4 h-4" />
    case 'data_asset': return <Database className="w-4 h-4" />
    case 'key_personnel': return <Users className="w-4 h-4" />
    default: return <Server className="w-4 h-4" />
  }
}

export const getColorForRiskType = (type) => {
  switch (type) {
    case 'cyber_attack': return 'bg-red-500'
    case 'supply_disruption': return 'bg-orange-500'
    case 'operational_risk': return 'bg-yellow-500'
    case 'legal_action': return 'bg-purple-500'
    default: return 'bg-red-500'
  }
}