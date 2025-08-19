import React, { useState, useRef, useEffect } from 'react';
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
  Download
} from 'lucide-react';

// Risk Event Modal Component
const RiskEventModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cyber Attack',
    description: '',
    likelihood: 15,
    impact: 500000,
    duration: 3
  });

  const handleSave = () => {
    onSave(formData);
    setFormData({
      name: '',
      type: 'Cyber Attack',
      description: '',
      likelihood: 15,
      impact: 500000,
      duration: 3
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Risk Event Details</h2>
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
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Cyber Attack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option>Cyber Attack</option>
                <option>Supply Disruption</option>
                <option>Operational Risk</option>
                <option>Legal Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
              rows={3}
              placeholder="Malicious cyber security incident"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Risk Parameters</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Likelihood ({formData.likelihood}%)</label>
                <div className="flex space-x-4 text-xs text-gray-400">
                  <span>Very Rare (1%)</span>
                  <span>Possible (25%)</span>
                  <span>Likely (50%)</span>
                  <span>Very Likely (100%)</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.likelihood}
                onChange={(e) => setFormData(prev => ({ ...prev, likelihood: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Maximum Financial Impact</label>
                <span className="text-orange-400 font-bold">${formData.impact.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>$1K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: parseInt(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Worst-case loss (USD)</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Duration (3d)</label>
                <div className="flex space-x-4 text-xs text-gray-400">
                  <span>1 Hour</span>
                  <span>1 Day</span>
                  <span>1 Week</span>
                  <span>30 Days</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="720"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Event</span>
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

// Business Asset Modal Component
const BusinessAssetModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    valuation: 1000000,
    criticality: 'Medium'
  });

  const handleSave = () => {
    onSave(formData);
    setFormData({
      name: '',
      location: '',
      description: '',
      valuation: 1000000,
      criticality: 'Medium'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Business Asset Details</h2>
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
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Critical System"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Primary Data Center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
              rows={3}
              placeholder="Mission-critical IT infrastructure"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Asset Properties</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Asset Valuation</label>
                <span className="text-cyan-400 font-bold">${formData.valuation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>$1K</span>
                <span>$100K</span>
                <span>$10M</span>
                <span>$100M</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000000"
                step="1000"
                value={formData.valuation}
                onChange={(e) => setFormData(prev => ({ ...prev, valuation: parseInt(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Total Value (USD)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Business Criticality</label>
              <div className="space-y-2">
                {[
                  { value: 'Low', desc: '(25% impact multiplier)', detail: 'Minor impact on operations' },
                  { value: 'Medium', desc: '(60% impact multiplier)', detail: 'Moderate impact on operations' },
                  { value: 'High', desc: '(100% impact multiplier)', detail: 'Critical to business operations' }
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
                      <span className={`font-medium ${
                        option.value === 'Low' ? 'text-green-400' :
                        option.value === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {option.value}
                      </span>
                      <span className="text-gray-400 ml-1">{option.desc}</span>
                      <p className="text-xs text-gray-500">{option.detail}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Asset Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valuation:</span>
                  <span className="text-cyan-400">${formData.valuation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Criticality:</span>
                  <span className={`font-medium ${
                    formData.criticality === 'Low' ? 'text-green-400' :
                    formData.criticality === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formData.criticality} ({formData.criticality === 'Low' ? '25' : formData.criticality === 'Medium' ? '60' : '100'}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{formData.location || 'Primary Data Center'}</span>
                </div>
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
            <span>Save Asset</span>
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

// Defense System Modal Component
const DefenseSystemModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    effectiveness: 30,
    cost: 50000
  });

  const handleSave = () => {
    onSave(formData);
    setFormData({
      name: '',
      description: '',
      effectiveness: 30,
      cost: 50000
    });
    onClose();
  };

  if (!isOpen) return null;

  const costPerProtection = formData.cost / (formData.effectiveness / 100);
  const roiRating = costPerProtection < 100000 ? 'Excellent' : costPerProtection < 500000 ? 'Good' : 'Fair';
  const damageReduction = `${formData.effectiveness}% damage reduction`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Defense System Details</h2>
              <p className="text-gray-400 text-sm">Configure properties and parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Defense Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Insurance Coverage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
              rows={3}
              placeholder="Financial risk transfer and coverage"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Defense Properties</h3>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Risk Mitigation Effectiveness</label>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-400 font-bold">{formData.effectiveness}%</span>
                  <div className="w-8 h-4 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>10% (Minimal)</span>
                <span>50% (Moderate)</span>
                <span>80% (Excellent)</span>
                <span>95% (Maximum)</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={formData.effectiveness}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveness: parseInt(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Damage reduction</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Annual Cost</label>
                <span className="text-cyan-400 font-bold">${formData.cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>$1K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Yearly investment (USD)</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Cost-Effectiveness Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cost per % Protection:</span>
                  <span className="text-cyan-400 font-bold">${Math.round(costPerProtection).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ROI Rating:</span>
                  <span className={`font-bold ${roiRating === 'Excellent' ? 'text-green-400' : roiRating === 'Good' ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {roiRating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Protection Value:</span>
                  <span className="text-green-400 font-bold">{damageReduction}</span>
                </div>
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
            <span>Save Defense</span>
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

const downloadResultsAsImage = async (results, scenarioName = "risk-analysis") => {
  try {
    // Check if html2canvas is available
    if (typeof html2canvas !== 'undefined') {
      // Find the modal element by its data attribute
      const modalElement = document.querySelector('[data-modal="monte-carlo-results"]');
      
      if (modalElement) {
        console.log('Capturing complete modal element...', modalElement);
        
        // Store original styles
        const originalStyles = {
          overflow: modalElement.style.overflow,
          maxHeight: modalElement.style.maxHeight,
          position: modalElement.style.position,
          top: modalElement.style.top,
          left: modalElement.style.left
        };
        
        // Temporarily make modal visible and fully expanded for capture
        modalElement.style.overflow = 'visible';
        modalElement.style.maxHeight = 'none';
        modalElement.style.position = 'absolute';
        modalElement.style.top = '0';
        modalElement.style.left = '0';
        
        // Wait a moment for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Configure html2canvas options for complete capture
        const canvas = await html2canvas(modalElement, {
          backgroundColor: '#1f2937', // Gray-800 background
          scale: 1.5, // Good resolution without being too large
          useCORS: true,
          allowTaint: true,
          logging: false,
          removeContainer: false,
          onclone: (clonedDoc) => {
            // Ensure the cloned element also shows all content
            const clonedElement = clonedDoc.querySelector('[data-modal="monte-carlo-results"]');
            if (clonedElement) {
              clonedElement.style.overflow = 'visible';
              clonedElement.style.maxHeight = 'none';
              clonedElement.style.position = 'relative';
              clonedElement.style.top = '0';
              clonedElement.style.left = '0';
            }
          }
        });
        
        // Restore original styles
        Object.assign(modalElement.style, originalStyles);
        
        console.log('Canvas created with full content:', canvas.width, 'x', canvas.height);
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          // Create filename with scenario name and timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          link.download = `monte-carlo-analysis-${safeName}-${timestamp}.png`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          console.log('Complete Monte Carlo results image downloaded successfully');
          alert('Complete analysis results saved as image!');
        }, 'image/png', 0.92); // High quality PNG
        
        return;
      } else {
        console.error('Modal element not found');
      }
    } else {
      console.error('html2canvas library not found');
    }
    
    // Fallback method
    console.log('Using fallback download method');
    alert('Image capture not available. Please ensure html2canvas library is loaded.');
    
  } catch (error) {
    console.error('Error downloading results as image:', error);
    alert('Error downloading image. Please try again.');
  }
};

const MonteCarloResultsModal = ({ results, scenarioName, onClose }) => {
  if (!results) return null;

  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score < 80) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const risk = getRiskLevel(results.risk_score || 50);

  // Generate heat map data
  const generateHeatMapData = () => {
    const data = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 20; j++) {
        // Create a distribution that peaks around the middle
        const value = Math.random() * 100 * 
                     Math.exp(-Math.pow((j - 10) / 5, 2)) * 
                     Math.exp(-Math.pow((i - 5) / 3, 2));
        row.push(value);
      }
      data.push(row);
    }
    return data;
  };

  const heatMapData = generateHeatMapData();
  const maxHeatValue = Math.max(...heatMapData.flat());

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        data-modal="monte-carlo-results"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Save Results</span>
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white p-2 transition-colors"
              aria-label="Close"
            >
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
            <div className="h-48 bg-gray-800 rounded-lg p-4">
              <div className="grid grid-rows-10 grid-cols-20 gap-1 h-full w-full">
                {heatMapData.map((row, i) => (
                  row.map((value, j) => {
                    const intensity = Math.round((value / maxHeatValue) * 100);
                    let color;
                    if (intensity < 25) color = 'bg-green-500';
                    else if (intensity < 50) color = 'bg-yellow-500';
                    else if (intensity < 75) color = 'bg-orange-500';
                    else color = 'bg-red-500';
                    
                    return (
                      <div 
                        key={`${i}-${j}`}
                        className={`${color} opacity-${intensity < 10 ? 30 : intensity < 30 ? 50 : intensity < 60 ? 70 : 90} rounded-sm`}
                        title={`Value: ${value.toFixed(1)}`}
                      />
                    );
                  })
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>Low Impact</span>
                <span>High Impact</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="flex-1 h-2 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full"></div>
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
const ScenarioCanvasReplica = () => {
  const [components, setComponents] = useState([
    {
      id: 'cyber-attack-1',
      type: 'risk',
      name: 'Cyber Attack',
      position: { x: 400, y: 200 },
      color: 'bg-cyan-500 border-cyan-400',
      data: {
        description: 'Ransomware, data breaches',
        likelihood: 15,
        impact: 500000,
        duration: 3
      }
    },
    {
      id: 'security-control-1',
      type: 'defense',
      name: 'Security Control',
      position: { x: 200, y: 350 },
      color: 'bg-green-500 border-green-400',
      data: {
        description: 'Firewalls, monitoring',
        effectiveness: 80,
        cost: 25000
      }
    },
    {
      id: 'critical-system-1',
      type: 'asset',
      name: 'Critical System',
      position: { x: 500, y: 350 },
      color: 'bg-blue-500 border-blue-400',
      data: {
        description: 'IT infrastructure, databases',
        valuation: 1000000,
        criticality: 'High'
      }
    }
  ]);
  
  const [connections, setConnections] = useState([
    { from: 'cyber-attack-1', to: 'security-control-1' },
    { from: 'cyber-attack-1', to: 'critical-system-1' }
  ]);
  
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [sidebarSections, setSidebarSections] = useState({
    riskEvents: true,
    businessAssets: true,
    defenseSystems: true,
    mobileOpen: false
  });

  // Modal states
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showDefenseModal, setShowDefenseModal] = useState(false);
  const [showMonteCarloModal, setShowMonteCarloModal] = useState(false);
  const [monteCarloResults, setMonteCarloResults] = useState(null);
  const [droppedComponent, setDroppedComponent] = useState(null);

  const canvasRef = useRef(null);

  // Draw connections
  useEffect(() => {
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
  }, [components, connections]);

  const addRiskEvent = (data) => {
    const position = droppedComponent?.position || {
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 200
    };

    const newComponent = {
      id: `risk-${Date.now()}`,
      type: 'risk',
      name: data.name,
      position,
      color: getComponentColor('risk'),
      data
    };
    setComponents(prev => [...prev, newComponent]);
    setDroppedComponent(null); // Clear the dropped component data
  };

  const addBusinessAsset = (data) => {
    const position = droppedComponent?.position || {
      x: 200 + Math.random() * 400,
      y: 250 + Math.random() * 200
    };

    const newComponent = {
      id: `asset-${Date.now()}`,
      type: 'asset',
      name: data.name,
      position,
      color: getComponentColor('asset'),
      data
    };
    setComponents(prev => [...prev, newComponent]);
    setDroppedComponent(null); // Clear the dropped component data
  };

  const addDefenseSystem = (data) => {
    const position = droppedComponent?.position || {
      x: 200 + Math.random() * 400,
      y: 300 + Math.random() * 150
    };

    const newComponent = {
      id: `defense-${Date.now()}`,
      type: 'defense',
      name: data.name,
      position,
      color: getComponentColor('defense'),
      data
    };
    setComponents(prev => [...prev, newComponent]);
    setDroppedComponent(null); // Clear the dropped component data
  };

  const deleteComponent = (componentId) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setConnections(prev => prev.filter(c => c.from !== componentId && c.to !== componentId));
    setSelectedComponent(null);
  };

  const handleComponentClick = (component) => {
    if (isConnecting && connectionStart) {
      if (connectionStart !== component.id) {
        setConnections(prev => [...prev, { from: connectionStart, to: component.id }]);
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

  const ComponentIcon = ({ type }) => {
    switch (type) {
      case 'risk':
        return <Zap className="w-6 h-6 text-white" />;
      case 'asset':
        return <Building2 className="w-6 h-6 text-white" />;
      case 'defense':
        return <Shield className="w-6 h-6 text-white" />;
      default:
        return <div className="w-6 h-6 bg-white rounded" />;
    }
  };

  const getComponentColor = (type) => {
    switch (type) {
      case 'risk':
        return 'bg-red-500 border-red-400';
      case 'asset':
        return 'bg-blue-500 border-blue-400';
      case 'defense':
        return 'bg-green-500 border-green-400';
      default:
        return 'bg-gray-500 border-gray-400';
    }
  };

  const riskEventOptions = [
    { name: 'Add Cyber Attack', description: 'Ransomware, data breaches', icon: '🔴', color: 'bg-red-600' },
    { name: 'Add Supply Disruption', description: 'Supplier failures, logistics', icon: '📦', color: 'bg-orange-600' },
    { name: 'Add Operational Risk', description: 'Process failures, human errors', icon: '⚠️', color: 'bg-yellow-600' },
    { name: 'Add Legal Action', description: 'Lawsuits, regulatory issues', icon: '⚖️', color: 'bg-red-700' }
  ];

  const businessAssetOptions = [
    { name: 'Add Critical System', description: 'IT infrastructure, databases', icon: '🏢', color: 'bg-blue-600' },
    { name: 'Add Business Location', description: 'Offices, plants', icon: '📍', color: 'bg-blue-500' },
    { name: 'Add Data Asset', description: 'Customer data, IP', icon: '💾', color: 'bg-blue-700' },
    { name: 'Add Key Personnel', description: 'Critical staff, expertise', icon: '👥', color: 'bg-blue-800' }
  ];

  const defenseSystemOptions = [
    { name: 'Add Security Control', description: 'Firewalls, monitoring', icon: '🛡️', color: 'bg-green-600' },
    { name: 'Add Business Continuity', description: 'DR, redundancy', icon: '🔄', color: 'bg-green-500' },
    { name: 'Add Insurance Coverage', description: 'Risk transfer, coverage', icon: '📋', color: 'bg-green-700' },
    { name: 'Add Backup Systems', description: 'Data backup, recovery', icon: '💿', color: 'bg-green-800' }
  ];

  const runMonteCarloAnalysis = () => {
    // Generate realistic Monte Carlo results based on current components
    const riskComponents = components.filter(c => c.type === 'risk');
    const assetComponents = components.filter(c => c.type === 'asset');
    const defenseComponents = components.filter(c => c.type === 'defense');
    
    if (riskComponents.length === 0) {
      alert('Please add at least one risk event before running analysis');
      return;
    }

    // Calculate realistic results based on component data
    const totalRiskImpact = riskComponents.reduce((sum, r) => sum + (r.data.impact * r.data.likelihood / 100), 0);
    const defenseEffectiveness = defenseComponents.reduce((sum, d) => sum + d.data.effectiveness, 0) / Math.max(defenseComponents.length, 1);
    const mitigationFactor = 1 - (defenseEffectiveness / 100 * 0.8); // Defense reduces impact by up to 80%
    
    const results = {
      iterations: 10000,
      p50_median_impact: Math.round(totalRiskImpact * 0.6 * mitigationFactor),
      p90_severe_impact: Math.round(totalRiskImpact * 1.2 * mitigationFactor),
      worst_case_scenario: Math.round(totalRiskImpact * 1.8 * mitigationFactor),
      expected_annual_loss: Math.round(totalRiskImpact * 0.8 * mitigationFactor),
      value_at_risk_95: Math.round(totalRiskImpact * 1.1 * mitigationFactor),
      conditional_var: Math.round(totalRiskImpact * 1.4 * mitigationFactor),
      security_roi: Math.max(0, 15 + (defenseComponents.length * 10) - (riskComponents.length * 5)),
      risk_score: Math.min(95, 25 + (riskComponents.length * 15) - (defenseComponents.length * 8)),
      risk_distribution: {
        low: Math.max(5, 35 - (riskComponents.length * 5)),
        medium: Math.max(10, 45 - (riskComponents.length * 3)),
        high: Math.min(40, 15 + (riskComponents.length * 7)),
        critical: Math.min(25, 5 + (riskComponents.length * 3))
      },
      confidence_intervals: {
        p50: { lower: Math.round(totalRiskImpact * 0.5 * mitigationFactor), upper: Math.round(totalRiskImpact * 0.7 * mitigationFactor) },
        p90: { lower: Math.round(totalRiskImpact * 1.0 * mitigationFactor), upper: Math.round(totalRiskImpact * 1.4 * mitigationFactor) }
      },
      components_analyzed: {
        risk_events: riskComponents.length,
        business_assets: assetComponents.length,
        defense_systems: defenseComponents.length
      },
      generated_at: new Date().toISOString()
    };

    setMonteCarloResults(results);
    setShowMonteCarloModal(true);
  };

  const progress = Math.min(Math.floor((components.length / 6) * 100), 100);
  const completedSteps = Math.min(Math.floor(components.length / 2), 4);

  // Calculate P50 and P90 estimates
  const riskComponents = components.filter(c => c.type === 'risk');
  const p50Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + (r.data.impact * r.data.likelihood / 100), 0) * 0.5 / 1000) + 'K' : 
    '---';
  const p90Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + r.data.impact, 0) * 0.9 / 1000) + 'K' : 
    '---';

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Modals */}
      <RiskEventModal 
        isOpen={showRiskModal} 
        onClose={() => setShowRiskModal(false)} 
        onSave={addRiskEvent} 
      />
      <BusinessAssetModal 
        isOpen={showAssetModal} 
        onClose={() => setShowAssetModal(false)} 
        onSave={addBusinessAsset} 
      />
      <DefenseSystemModal 
        isOpen={showDefenseModal} 
        onClose={() => setShowDefenseModal(false)} 
        onSave={addDefenseSystem} 
      />
      <MonteCarloResultsModal
        results={monteCarloResults}
        scenarioName="Q4 Cyber Assessment"
        onClose={() => setShowMonteCarloModal(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Q4 Cyber Assessment</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>No description</span>
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  <span>Auto-saved</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Run Scenario</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Scenario Canvas</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>open</span>
                <span>Preview:</span>
                <span className="text-orange-400">P50 {p50Impact}</span>
                <span className="text-orange-400">P90 {p90Impact}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Smart Layout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Impact Analysis Section */}
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

            {/* Action Steps */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Validate Components', completed: components.length > 0 },
                { label: 'Verify Connections', completed: connections.length > 0 },
                { label: 'Configure Parameters', completed: components.length >= 3 },
                { label: 'Review Scenario', completed: components.length >= 4 }
              ].map((step, index) => (
                <div key={index} className={`rounded-lg p-4 border-2 text-left ${
                  step.completed 
                    ? 'bg-green-600 border-green-500' 
                    : 'bg-gray-700 border-gray-600'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xl ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                      {step.completed ? '✓' : '●'}
                    </span>
                    <span className={`text-sm font-medium ${step.completed ? 'text-white' : 'text-gray-300'}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className={`text-xs ${step.completed ? 'text-gray-200' : 'text-gray-400'}`}>
                    {step.label.includes('Components') ? 'Ensure all scenario compo...' :
                     step.label.includes('Connections') ? 'Validate that components...' :
                     step.label.includes('Parameters') ? 'Set Monte Carlo simulatio...' :
                     'Perform a final review of t...'}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={runMonteCarloAnalysis}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              disabled={components.length === 0}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Run Full Impact Analysis</span>
            </button>
          </div>

          {/* Canvas Area */}
          <div
            className="bg-gray-800 rounded-lg flex-1 relative overflow-hidden min-h-[500px] border-2 border-dashed border-transparent transition-colors"
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-500/10')
              const dropHint = e.currentTarget.querySelector('.drop-hint')
              if (dropHint) dropHint.style.opacity = '1'
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10')
              const dropHint = e.currentTarget.querySelector('.drop-hint')
              if (dropHint) dropHint.style.opacity = '0'
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10')
              const dropHint = e.currentTarget.querySelector('.drop-hint')
              if (dropHint) dropHint.style.opacity = '0'

              try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'))
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                // Create a temporary component for the dropped item
                const tempComponent = {
                  ...data,
                  id: `temp-${Date.now()}`,
                  position: { x, y }
                }

                // Store the drop position and component data
                setDroppedComponent(tempComponent)

                // Open the appropriate modal based on the type
                if (data.type === 'risk_event') {
                  setShowRiskModal(true)
                } else if (data.type === 'business_asset') {
                  setShowAssetModal(true)
                } else if (data.type === 'defense_system') {
                  setShowDefenseModal(true)
                }
              } catch (error) {
                console.error('Error parsing dropped data:', error)
              }
            }}
          >
            {/* Drop zone hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200 z-10 drop-hint">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <p className="text-lg font-medium">Drop here to add component</p>
                <p className="text-sm opacity-75">Component settings will open automatically</p>
              </div>
            </div>

            {/* Canvas for connections */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Components */}
            {components.map((component) => (
              <div
                key={component.id}
                className={`absolute rounded-lg w-20 h-20 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform border-2 group ${
                  selectedComponent === component.id ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : component.color
                }`}
                style={{
                  left: `${component.position.x}px`,
                  top: `${component.position.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleComponentClick(component)}
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
                      // Edit component logic here
                    }}
                    className="w-5 h-5 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white"
                    title="Edit"
                  >
                    <Settings className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComponent(component.id);
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
            
            {/* Progress indicator */}
            <div className="absolute top-4 right-4 bg-gray-900/90 rounded-lg p-3">
              <div className="text-sm font-medium text-white">Progress: {progress}%</div>
              <div className="w-24 bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{components.length} components added</p>
            </div>

            {/* Empty state */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-dashed border-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-cyan-500">+</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Building Your Scenario</h3>
                  <p className="text-gray-400 mb-6">Add components from the sidebar to begin modeling</p>
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => setShowRiskModal(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      Add Risk Event
                    </button>
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Add Asset
                    </button>
                    <button
                      onClick={() => setShowDefenseModal(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      Add Defense
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 lg:w-80 md:w-72 sm:w-64 bg-gray-800 border-l border-gray-700 overflow-y-auto hidden md:block">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Scenario Components</h2>
            <p className="text-sm text-gray-400">Drag components onto the canvas to build your scenario</p>
          </div>

          {/* Risk Events */}
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
                <button
                  onClick={() => setShowRiskModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Cyber Attack</div>
                      <div className="text-xs text-gray-400">Ransomware, data breaches</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowRiskModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Supply Disruption</div>
                      <div className="text-xs text-gray-400">Supplier failures, logistics</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowRiskModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Operational Risk</div>
                      <div className="text-xs text-gray-400">Process failures, human errors</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowRiskModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Legal Action</div>
                      <div className="text-xs text-gray-400">Lawsuits, regulatory issues</div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Business Assets */}
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
  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <Building2 className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Critical System</div>
        <div className="text-xs text-gray-400">IT infrastructure, databases</div>
      </div>
    </div>
  </button>

  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
        <MapPin className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Business Location</div>
        <div className="text-xs text-gray-400">Offices, plants</div>
      </div>
    </div>
  </button>

  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Database className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Data Asset</div>
        <div className="text-xs text-gray-400">Customer data, IP</div>
      </div>
    </div>
  </button>

  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Users className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Key Personnel</div>
        <div className="text-xs text-gray-400">Critical staff, expertise</div>
      </div>
    </div>
  </button>

  {/* ✅ Your extra two buttons go INSIDE the same wrapper */}
  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-blue-600/30"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Database className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Data Asset</div>
        <div className="text-xs text-blue-100 opacity-90">Customer data, IP</div>
      </div>
    </div>
  </button>

  <button
    onClick={() => setShowAssetModal(true)}
    className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-blue-700/30"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Users className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-white">Add Key Personnel</div>
        <div className="text-xs text-blue-100 opacity-90">Critical staff, expertise</div>
      </div>
    </div>
  </button>
</div>

            )}
          </div>

          {/* Defense Systems */}
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
                <button
                  onClick={() => setShowDefenseModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Security Control</div>
                      <div className="text-xs text-gray-400">Firewalls, monitoring</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowDefenseModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Business Continuity</div>
                      <div className="text-xs text-gray-400">DR, redundancy</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowDefenseModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Insurance Coverage</div>
                      <div className="text-xs text-gray-400">Risk transfer, coverage</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowDefenseModal(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HardDrive className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-white">Add Backup Systems</div>
                      <div className="text-xs text-gray-400">Data backup, recovery</div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Status */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Quick Status</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>→ P50 Impact</span>
                <span className="text-orange-400 font-medium">{p50Impact}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>→ P90 Impact</span>
                <span className="text-orange-400 font-medium">{p90Impact}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>⚙ Components</span>
                <span className="text-cyan-400 font-medium">{components.length}</span>
              </div>
            </div>
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
              {/* Mobile content - same as sidebar but condensed */}
              <div className="space-y-4">
                <button
                  onClick={() => { setShowRiskModal(true); setSidebarSections(prev => ({ ...prev, mobileOpen: false })); }}
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
                  onClick={() => { setShowAssetModal(true); setSidebarSections(prev => ({ ...prev, mobileOpen: false })); }}
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
                  onClick={() => { setShowDefenseModal(true); setSidebarSections(prev => ({ ...prev, mobileOpen: false })); }}
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
