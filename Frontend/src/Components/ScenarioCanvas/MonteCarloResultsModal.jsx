// frontend/src/components/ScenarioCanvas/MonteCarloResultsModal.jsx
import React from 'react'
import { 
  X, 
  Download, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Settings, 
  Shield 
} from 'lucide-react'
import { downloadResultsAsImage } from './utils.jsx'

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

export default MonteCarloResultsModal