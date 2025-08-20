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
} from '../../services/api';
import api from '../../services/api';

// Risk Event Modal Component with real data
const RiskEventModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cyber Attack',
    description: '',
    likelihood: 15,
    impact: 500000,
    duration: 3,
    category: 'cyber'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      // Reset form when opening modal for new event
      setFormData({
        name: '',
        type: 'Cyber Attack',
        description: '',
        likelihood: 15,
        impact: 500000,
        duration: 3,
        category: 'cyber'
      });
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Event name is required');
      return;
    }
    
    // Create node structure for Monte Carlo simulation
    const nodeData = {
      id: initialData?.id || `event-${Date.now()}`,
      type: 'event',
      name: formData.name,
      description: formData.description,
      likelihood: formData.likelihood / 100, // Convert percentage to decimal
      severity: formData.impact,
      severityUsd: formData.impact,
      durationHrs: formData.duration * 24, // Convert days to hours
      category: formData.category,
      data: {
        likelihood: formData.likelihood / 100,
        severityUsd: formData.impact,
        durationHrs: formData.duration * 24,
        category: formData.category
      }
    };
    
    onSave(nodeData);
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
                <option>Natural Disaster</option>
                <option>Financial Risk</option>
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
              placeholder="Malicious cyber security incident targeting critical systems"
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
                <label className="text-sm font-medium text-gray-300">Duration ({formData.duration}d)</label>
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
                max="30"
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

// Business Asset Modal Component with real data
const BusinessAssetModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    valuation: 1000000,
    criticality: 'Medium'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      setFormData({
        name: '',
        location: '',
        description: '',
        valuation: 1000000,
        criticality: 'Medium'
      });
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Asset name is required');
      return;
    }
    
    const nodeData = {
      id: initialData?.id || `asset-${Date.now()}`,
      type: 'asset',
      name: formData.name,
      description: formData.description,
      location: formData.location,
      valuation: formData.valuation,
      criticality: formData.criticality,
      data: {
        valuation: formData.valuation,
        criticality: formData.criticality,
        location: formData.location
      }
    };
    
    onSave(nodeData);
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
              placeholder="Mission-critical IT infrastructure supporting core business operations"
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

// Defense System Modal Component with real data
const DefenseSystemModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    effectiveness: 30,
    cost: 50000
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        effectiveness: 30,
        cost: 50000
      });
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Defense name is required');
      return;
    }
    
    const nodeData = {
      id: initialData?.id || `defense-${Date.now()}`,
      type: 'defense',
      name: formData.name,
      description: formData.description,
      mitigationPct: formData.effectiveness / 100, // Convert to decimal
      annualCostUsd: formData.cost,
      data: {
        mitigationPct: formData.effectiveness / 100,
        annualCostUsd: formData.cost,
        effectiveness: formData.effectiveness
      }
    };
    
    onSave(nodeData);
    onClose();
  };

  if (!isOpen) return null;

  const costPerProtection = formData.cost / (formData.effectiveness / 100);
  const roiRating = costPerProtection < 100000 ? 'Excellent' : costPerProtection < 500000 ? 'Good' : 'Fair';

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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Defense Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Firewall Security System"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
              rows={3}
              placeholder="Advanced network security with AI threat detection and automated response"
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
              <p className="text-xs text-gray-500 mt-1">Damage reduction percentage</p>
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
                  <span className="text-green-400 font-bold">{formData.effectiveness}% reduction</span>
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

// Monte Carlo Results Modal with real data
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

  // Calculate risk score based on P90 impact
  const riskScore = results.p90?.financialImpact ? 
    Math.min(100, Math.round((results.p90.financialImpact / 1000000) * 25)) : 
    50;
  
  const risk = getRiskLevel(riskScore);

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
              onClick={() => {
                // Download functionality
                const dataStr = JSON.stringify(results, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `monte-carlo-results-${Date.now()}.json`;
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
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(results.p50?.financialImpact || 0)}
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
                    {formatCurrency(results.p90?.financialImpact || 0)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400">10% chance of losses exceeding this amount</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Worst Case Scenario</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(results.worstCase?.financialImpact || 0)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Maximum potential loss identified</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Expected Annual Loss</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(results.expectedAnnualLoss || 0)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Average expected loss per year</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <Settings className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Value at Risk (90%)</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(results.valueAtRisk?.p90 || 0)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400">10% chance of exceeding this loss</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Security ROI</p>
                  <p className="text-3xl font-bold text-white">
                    {(results.returnOnSecurityInvestment * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-green-400">Return on defense investment</p>
            </div>
          </div>

          {/* Risk Assessment Summary */}
          <div className={`${risk.bg} rounded-lg p-6 border border-gray-600 mb-8`}>
            <div className="flex items-start space-x-4">
              <div className={`w-4 h-4 ${risk.color.replace('text-', 'bg-')} rounded-full mt-1 flex-shrink-0`}></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">
                  Risk Assessment: <span className={risk.color}>{risk.level}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-3">
                      Based on Monte Carlo simulation with <strong>{(results.iterations || 10000).toLocaleString()}</strong> iterations across {results.scenarios || 0} risk scenarios.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Expected annual loss: <span className="text-white">{formatCurrency(results.expectedAnnualLoss || 0)}</span></li>
                      <li>• Security investment ROI: <span className="text-green-400">{(results.returnOnSecurityInvestment * 100 || 0).toFixed(1)}%</span></li>
                      <li>• Simulation iterations: <span className="text-blue-400">{(results.iterations || 10000).toLocaleString()}</span></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">Key Findings:</h5>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Median impact: {formatCurrency(results.p50?.financialImpact || 0)}</li>
                      <li>• 90th percentile: {formatCurrency(results.p90?.financialImpact || 0)}</li>
                      <li>• Worst case: {formatCurrency(results.worstCase?.financialImpact || 0)}</li>
                      <li>• Risk events analyzed: {results.scenarios || 0}</li>
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

// Main Scenario Canvas Component
const ScenarioCanvasReplica = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State management
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

  // Load scenario data on mount
  useEffect(() => {
    if (id && id !== 'new') {
      loadScenario();
    } else {
      // New scenario - clear everything
      setScenario({
        id: null,
        name: 'New Scenario',
        description: '',
        status: 'draft'
      });
      setComponents([]);
      setConnections([]);
      setMonteCarloResults(null);
      setLoading(false);
    }
  }, [id]);

  // Draw connections on canvas
  useEffect(() => {
    drawConnections();
  }, [components, connections]);

  // API functions
  const loadScenario = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scenariosAPI.getById(id);
      const scenarioData = response.scenario || response.data?.scenario || response;
      
      console.log('Loaded scenario:', scenarioData);
      
      setScenario(scenarioData);
      
      // Load scenario components (nodes and edges)
      if (scenarioData.inputs?.nodes) {
        setComponents(scenarioData.inputs.nodes);
      }
      if (scenarioData.inputs?.edges) {
        setConnections(scenarioData.inputs.edges.map(edge => ({
          from: edge.source,
          to: edge.target,
          type: edge.type
        })));
      }
      
      // Load previous Monte Carlo results if available
      if (scenarioData.results) {
        setMonteCarloResults(scenarioData.results);
      }
      
    } catch (error) {
      console.error('Error loading scenario:', error);
      setError('Failed to load scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveScenario = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const scenarioData = {
        name: scenario?.name || 'New Risk Scenario',
        description: scenario?.description || '',
        status: scenario?.status || 'draft',
        inputs: {
          nodes: components,
          edges: connections.map(conn => ({
            source: conn.from,
            target: conn.to,
            type: conn.type || getEdgeType(conn.from, conn.to)
          }))
        },
        // Keep existing results if they exist
        results: monteCarloResults || scenario?.results
      };
      
      let response;
      if (scenario?.id) {
        // Update existing scenario
        console.log('Updating existing scenario:', scenario.id);
        response = await scenariosAPI.update(scenario.id, scenarioData);
      } else {
        // Create new scenario
        console.log('Creating new scenario');
        response = await scenariosAPI.create(scenarioData);
      }
      
      console.log('Save response:', response);
      
      // Handle different response formats
      let updatedScenario = response;
      if (response.scenario) {
        updatedScenario = response.scenario;
      } else if (response.data?.scenario) {
        updatedScenario = response.data.scenario;
      } else if (response.data && response.data.scenarios) {
        // Handle case where response contains scenarios array
        updatedScenario = response.data.scenarios[0] || response.data;
      }
      
      if (updatedScenario && updatedScenario.id) {
        setScenario(updatedScenario);
        console.log('Scenario saved successfully with ID:', updatedScenario.id);
        
        // Update URL if this was a new scenario
        if (!scenario?.id && updatedScenario.id) {
          navigate(`/scenarios/${updatedScenario.id}`, { replace: true });
        }
      } else {
        console.warn('Unexpected save response format:', response);
        // If we can't get the updated scenario, at least update what we have
        if (!scenario?.id) {
          setScenario(prev => ({ ...prev, ...scenarioData }));
        }
      }
      
      return updatedScenario;
      
    } catch (error) {
      console.error('Error saving scenario:', error);
      setError(`Failed to save scenario: ${error.message}`);
      throw error; // Re-throw so calling functions know save failed
    } finally {
      setSaving(false);
    }
  };

  const runMonteCarloAnalysis = async () => {
    try {
      if (components.length === 0) {
        alert('Please add at least one component before running analysis');
        return;
      }
      
      const riskComponents = components.filter(c => c.type === 'event');
      if (riskComponents.length === 0) {
        alert('Please add at least one risk event before running analysis');
        return;
      }
      
      setRunningAnalysis(true);
      setError(null);
      
      // Ensure scenario is saved first and has an ID
      let currentScenario = scenario;
      if (!currentScenario?.id) {
        console.log('Scenario not saved yet, saving first...');
        
        const scenarioToSave = {
          name: currentScenario?.name || 'New Risk Scenario',
          description: currentScenario?.description || 'Risk assessment scenario',
          status: 'draft',
          ownerId: 'current-user', // Add this for backend compatibility
          inputs: {
            nodes: components,
            edges: connections.map(conn => ({
              source: conn.from,
              target: conn.to,
              type: getEdgeType(conn.from, conn.to)
            }))
          }
        };
        
        try {
          console.log('Creating scenario with data:', scenarioToSave);
          const createResponse = await scenariosAPI.create(scenarioToSave);
          console.log('Create response received:', createResponse);
          
          // Handle various response formats from backend
          let extractedScenario = null;
          
          if (createResponse.scenario) {
            extractedScenario = createResponse.scenario;
          } else if (createResponse.data?.scenario) {
            extractedScenario = createResponse.data.scenario;
          } else if (createResponse.data?.scenarios?.[0]) {
            extractedScenario = createResponse.data.scenarios[0];
          } else if (createResponse.scenarios?.[0]) {
            extractedScenario = createResponse.scenarios[0];
          } else if (createResponse.id) {
            // If response has ID directly, use it
            extractedScenario = createResponse;
          } else if (createResponse.data?.id) {
            extractedScenario = createResponse.data;
          }
          
          console.log('Extracted scenario:', extractedScenario);
          
          if (!extractedScenario?.id) {
            console.error('Full response structure:', JSON.stringify(createResponse, null, 2));
            throw new Error(`Failed to create scenario - no ID found in response. Response: ${JSON.stringify(createResponse)}`);
          }
          
          currentScenario = extractedScenario;
          setScenario(currentScenario);
          console.log('Scenario created with ID:', currentScenario.id);
          
          // Update URL to reflect the new scenario ID
          navigate(`/scenarios/${currentScenario.id}`, { replace: true });
          
        } catch (saveError) {
          console.error('Failed to save scenario:', saveError);
          throw new Error(`Failed to save scenario before analysis: ${saveError.message}`);
        }
      }
      
      // Now create the separate entities that your backend expects
      try {
        await createScenarioComponents(currentScenario.id);
        
        // Verify that risk events were actually created in the right collection
        try {
          // Try different verification endpoints to see where the data actually ended up
          const verificationEndpoints = [
            `/scenarios/${currentScenario.id}/risk-events/`,
            `/risk-events/?scenario_id=${currentScenario.id}`,
            `/risk_events/?scenario_id=${currentScenario.id}`,
            `/events/?scenario_id=${currentScenario.id}`
          ];
          
          let riskEventsFound = 0;
          let workingEndpoint = null;
          
          for (const endpoint of verificationEndpoints) {
            try {
              const checkResponse = await api.get(endpoint);
              const eventsData = checkResponse.data;
              const eventCount = Array.isArray(eventsData) ? eventsData.length : eventsData?.data?.length || 0;
              
              if (eventCount > 0) {
                riskEventsFound = eventCount;
                workingEndpoint = endpoint;
                console.log(`✓ Found ${eventCount} risk events at ${endpoint}`);
                break;
              } else {
                console.log(`⚪ No events found at ${endpoint}`);
              }
            } catch (verifyError) {
              console.log(`❌ Verification failed for ${endpoint}:`, verifyError.response?.status || verifyError.message);
            }
          }
          
          console.log(`✓ Verification complete: ${riskEventsFound} risk events found${workingEndpoint ? ` at ${workingEndpoint}` : ''}`);
          
          if (riskEventsFound === 0) {
            console.warn('⚠️ No risk events found in any collection after creation attempts');
            
            // Try one final approach: create directly in the risk_events collection with proper MongoDB format
            const riskEvents = components.filter(c => c.type === 'event');
            if (riskEvents.length > 0) {
              console.log('🔄 Attempting direct MongoDB-style creation...');
              
              for (const event of riskEvents) {
                try {
                  // Format data exactly as MongoDB expects
                  const mongoRiskEventData = {
                    scenario_id: currentScenario.id,  // String format that MongoDB can convert
                    name: event.name,
                    description: event.description || '',
                    probability: (event.likelihood || 0) * 100,
                    impact_min: (event.severity || event.severityUsd || 0) * 0.5,
                    impact_max: event.severity || event.severityUsd || 0,
                    category: event.category || 'operational',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  // Try the exact collection name your backend expects
                  const directResponse = await api.post('/risk_events/', mongoRiskEventData);
                  console.log(`✅ SUCCESS: Created risk event in risk_events collection:`, event.name);
                } catch (directError) {
                  console.error(`❌ Direct MongoDB creation failed for ${event.name}:`, directError.response?.data || directError.message);
                }
              }
              
              // Verify one more time
              try {
                const finalCheck = await api.get(`/risk_events/?scenario_id=${currentScenario.id}`);
                const finalCount = finalCheck.data?.length || 0;
                console.log(`🔍 Final verification: ${finalCount} risk events in risk_events collection`);
              } catch (finalError) {
                console.log('❌ Final verification failed:', finalError.message);
              }
            }
          }
        } catch (checkError) {
          console.warn('Could not verify risk events creation:', checkError.message);
        }
        
      } catch (componentError) {
        console.warn('Failed to create some scenario components:', componentError.message);
        throw new Error(`Component creation failed: ${componentError.message}. Please ensure the scenario has the required components in the database.`);
      }
      
      console.log('Running Monte Carlo analysis for scenario ID:', currentScenario.id);
      
      // Call the analysis API (no simulation data needed based on your backend)
      try {
        const response = await scenariosAPI.runAnalysis(currentScenario.id);
        
        console.log('Monte Carlo results received:', response);
        
        // The response should directly contain the results
        const results = response;
        
        setMonteCarloResults(results);
        setShowMonteCarloModal(true);
        
        // Update scenario with results
        const updatedScenario = {
          ...currentScenario,
          results: results,
          status: 'completed'
        };
        
        setScenario(updatedScenario);
        
        // Save the updated scenario with results
        try {
          await scenariosAPI.update(currentScenario.id, updatedScenario);
          console.log('Scenario updated with analysis results');
        } catch (saveResultsError) {
          console.warn('Failed to save analysis results:', saveResultsError.message);
          // Don't throw error here as analysis was successful
        }
        
      } catch (analysisError) {
        console.error('Analysis API error:', analysisError);
        console.error('Analysis error response:', analysisError.response?.data);
        console.error('Analysis error status:', analysisError.response?.status);
        
        // If analysis fails due to missing components, show helpful message
        if (analysisError.response?.status === 400) {
          const errorMessage = analysisError.response?.data?.detail || analysisError.message;
          if (errorMessage.includes('risk event')) {
            throw new Error('Analysis failed: At least one risk event is required. Please add risk events to the scenario.');
          } else {
            throw new Error(`Analysis failed (400): ${errorMessage}`);
          }
        } else {
          throw new Error(`Analysis failed: ${analysisError.message}`);
        }
      }
      
    } catch (error) {
      console.error('Error running Monte Carlo analysis:', error);
      setError(`Failed to run analysis: ${error.message}`);
    } finally {
      setRunningAnalysis(false);
    }
  };

  // Helper function to create scenario components in separate collections
  const createScenarioComponents = async (scenarioId) => {
    const riskEvents = components.filter(c => c.type === 'event');
    const businessAssets = components.filter(c => c.type === 'asset');
    const defenseSystems = components.filter(c => c.type === 'defense');
    
    console.log('Creating scenario components for Monte Carlo:', {
      riskEvents: riskEvents.length,
      businessAssets: businessAssets.length,
      defenseSystems: defenseSystems.length
    });
    
    try {
      // Create risk events with the EXACT fields your Monte Carlo expects
      for (const event of riskEvents) {
        const riskEventData = {
          scenario_id: scenarioId,
          name: event.name,
          description: event.description || '',
          // ✅ FIXED: Use the exact field names from Monte Carlo simulation
          probability: (event.likelihood || 0) * 100, // Monte Carlo expects 'probability'
          impact_min: (event.severity || event.severityUsd || 0) * 0.3, // Monte Carlo expects 'impact_min'
          impact_max: event.severity || event.severityUsd || 0, // Monte Carlo expects 'impact_max'
          category: event.category || 'operational'
        };
        
        console.log(`📊 Creating risk event for Monte Carlo:`, {
          name: riskEventData.name,
          probability: riskEventData.probability,
          impact_min: riskEventData.impact_min,
          impact_max: riskEventData.impact_max
        });
        
        try {
          // Try multiple creation methods
          if (typeof riskEventsAPI !== 'undefined' && riskEventsAPI.create) {
            await riskEventsAPI.create(scenarioId, riskEventData);
            console.log('✓ Created risk event via API:', event.name);
          } else {
            throw new Error('riskEventsAPI not available');
          }
        } catch (apiError) {
          console.warn(`❌ API creation failed for risk event ${event.name}:`, apiError.message);
          
          // Try direct endpoints
          const endpoints = [
            `/scenarios/${scenarioId}/risk-events/`,
            `/risk-events/`,
            `/risk_events/`
          ];
          
          let created = false;
          for (const endpoint of endpoints) {
            try {
              await api.post(endpoint, riskEventData);
              console.log(`✓ Created risk event via ${endpoint}:`, event.name);
              created = true;
              break;
            } catch (endpointError) {
              console.log(`❌ Failed ${endpoint}:`, endpointError.response?.status);
            }
          }
          
          if (!created) {
            console.error(`❌ All creation methods failed for risk event: ${event.name}`);
          }
        }
      }
      
      // Create business assets with the fields your Monte Carlo expects
      for (const asset of businessAssets) {
        const assetData = {
          scenario_id: scenarioId,
          name: asset.name,
          description: asset.description || '',
          // ✅ FIXED: Use the exact field names from Monte Carlo simulation
          value: asset.valuation || asset.data?.valuation || 0, // Monte Carlo expects 'value'
          criticality: asset.criticality || asset.data?.criticality || 'Medium',
          location: asset.location || asset.data?.location || ''
        };
        
        console.log(`🏢 Creating business asset for Monte Carlo:`, {
          name: assetData.name,
          value: assetData.value,
          criticality: assetData.criticality
        });
        
        try {
          if (typeof businessAssetsAPI !== 'undefined' && businessAssetsAPI.create) {
            await businessAssetsAPI.create(scenarioId, assetData);
            console.log('✓ Created business asset via API:', asset.name);
          } else {
            throw new Error('businessAssetsAPI not available');
          }
        } catch (apiError) {
          // Try direct endpoints
          const endpoints = [
            `/scenarios/${scenarioId}/business-assets/`,
            `/business-assets/`,
            `/business_assets/`
          ];
          
          let created = false;
          for (const endpoint of endpoints) {
            try {
              await api.post(endpoint, assetData);
              console.log(`✓ Created business asset via ${endpoint}:`, asset.name);
              created = true;
              break;
            } catch (endpointError) {
              console.log(`❌ Failed ${endpoint}:`, endpointError.response?.status);
            }
          }
        }
      }
      
      // Create defense systems with the EXACT fields your Monte Carlo expects
      for (const defense of defenseSystems) {
        const defenseData = {
          scenario_id: scenarioId,
          name: defense.name,
          description: defense.description || '',
          // ✅ FIXED: Use the exact field names from Monte Carlo simulation
          effectiveness: (defense.mitigationPct || defense.data?.mitigationPct || 0) * 100, // Monte Carlo expects 'effectiveness' as percentage
          coverage_percentage: 100, // Monte Carlo expects 'coverage_percentage'
          cost: defense.annualCostUsd || defense.data?.annualCostUsd || 0,
          maintenance_cost: (defense.annualCostUsd || defense.data?.annualCostUsd || 0) * 0.1 // Add 10% maintenance cost
        };
        
        console.log(`🛡️ Creating defense system for Monte Carlo:`, {
          name: defenseData.name,
          effectiveness: defenseData.effectiveness,
          coverage_percentage: defenseData.coverage_percentage,
          cost: defenseData.cost
        });
        
        try {
          if (typeof defenseSystemsAPI !== 'undefined' && defenseSystemsAPI.create) {
            await defenseSystemsAPI.create(scenarioId, defenseData);
            console.log('✓ Created defense system via API:', defense.name);
          } else {
            throw new Error('defenseSystemsAPI not available');
          }
        } catch (apiError) {
          // Try direct endpoints
          const endpoints = [
            `/scenarios/${scenarioId}/defense-systems/`,
            `/defense-systems/`,
            `/defense_systems/`
          ];
          
          let created = false;
          for (const endpoint of endpoints) {
            try {
              await api.post(endpoint, defenseData);
              console.log(`✓ Created defense system via ${endpoint}:`, defense.name);
              created = true;
              break;
            } catch (endpointError) {
              console.log(`❌ Failed ${endpoint}:`, endpointError.response?.status);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error in createScenarioComponents:', error);
      throw error;
    }
    
    // Wait for database synchronization
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✅ Finished creating components with Monte Carlo-compatible fields');
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

  // Component management
  const addComponent = (nodeData, position = null) => {
    const finalPosition = position || droppedComponent?.position || {
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300
    };

    const newComponent = {
      ...nodeData,
      position: finalPosition,
      color: getComponentColor(nodeData.type)
    };
    
    setComponents(prev => [...prev, newComponent]);
    setDroppedComponent(null);
    
    // Auto-save after adding component
    setTimeout(saveScenario, 500);
  };

  const updateComponent = (updatedComponent) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
    setEditingComponent(null);
    
    // Auto-save after updating component
    setTimeout(saveScenario, 500);
  };

  const deleteComponent = (componentId) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setConnections(prev => prev.filter(c => c.from !== componentId && c.to !== componentId));
    setSelectedComponent(null);
    
    // Auto-save after deleting component
    setTimeout(saveScenario, 500);
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
        setTimeout(saveScenario, 500);
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

  // Helper components
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

  // Calculate progress and metrics
  const progress = Math.min(Math.floor((components.length / 6) * 100), 100);
  const completedSteps = Math.min(Math.floor(components.length / 2), 4);

  const riskComponents = components.filter(c => c.type === 'event');
  const assetComponents = components.filter(c => c.type === 'asset');
  const defenseComponents = components.filter(c => c.type === 'defense');

  const p50Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + ((r.severity || r.severityUsd || 0) * (r.likelihood || 0)), 0) * 0.5 / 1000) + 'K' : 
    '---';
    
  const p90Impact = riskComponents.length > 0 ? 
    Math.round(riskComponents.reduce((sum, r) => sum + (r.severity || r.severityUsd || 0), 0) * 0.9 / 1000) + 'K' : 
    '---';

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
        {/* Header */}
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
                <h1 className="text-xl font-bold text-white">{scenario?.name || 'New Scenario'}</h1>
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
                disabled={runningAnalysis || components.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {runningAnalysis ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Run Analysis</span>
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
                <span>{scenario?.status || 'draft'}</span>
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
          {/* Impact Analysis Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Impact Analysis</h3>
                  <p className="text-sm text-gray-400">
                    {components.length === 0 ? 'Add components to begin analysis' : 'Complete setup to run full analysis'}
                  </p>
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
                { label: 'Add Components', completed: components.length > 0, count: components.length },
                { label: 'Create Connections', completed: connections.length > 0, count: connections.length },
                { label: 'Configure Parameters', completed: components.length >= 3, count: riskComponents.length },
                { label: 'Ready for Analysis', completed: components.length >= 4 && riskComponents.length > 0, count: defenseComponents.length }
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
                    {step.label.includes('Components') ? `${step.count} components added` :
                     step.label.includes('Connections') ? `${step.count} connections made` :
                     step.label.includes('Parameters') ? `${step.count} risk events configured` :
                     `${step.count} defense systems ready`}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={runMonteCarloAnalysis}
              disabled={runningAnalysis || components.length === 0 || riskComponents.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Canvas Area */}
          <div
            className="bg-gray-800 rounded-lg flex-1 relative overflow-hidden min-h-[500px] border-2 border-dashed border-transparent transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-500/10');
              const dropHint = e.currentTarget.querySelector('.drop-hint');
              if (dropHint) dropHint.style.opacity = '1';
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
              const dropHint = e.currentTarget.querySelector('.drop-hint');
              if (dropHint) dropHint.style.opacity = '0';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-500/10');
              const dropHint = e.currentTarget.querySelector('.drop-hint');
              if (dropHint) dropHint.style.opacity = '0';

              try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Store the drop position
                setDroppedComponent({
                  ...data,
                  position: { x, y }
                });

                // Open the appropriate modal based on the type
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
            
            {/* Progress indicator */}
            <div className="absolute top-4 right-4 bg-gray-900/90 rounded-lg p-3">
              <div className="text-sm font-medium text-white">Progress: {progress}%</div>
              <div className="w-24 bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{components.length} components</p>
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

          {/* Component Statistics */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">Current Setup</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Risk Events:</span>
                <span className="text-red-400 font-medium">{riskComponents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Business Assets:</span>
                <span className="text-blue-400 font-medium">{assetComponents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Defense Systems:</span>
                <span className="text-green-400 font-medium">{defenseComponents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Connections:</span>
                <span className="text-purple-400 font-medium">{connections.length}</span>
              </div>
            </div>
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
                  { name: 'Cyber Attack', desc: 'Ransomware, data breaches', icon: Zap, type: 'cyber_attack' },
                  { name: 'Supply Disruption', desc: 'Supplier failures, logistics', icon: Truck, type: 'supply_disruption' },
                  { name: 'Operational Risk', desc: 'Process failures, human errors', icon: AlertTriangle, type: 'operational_risk' },
                  { name: 'Legal Action', desc: 'Lawsuits, regulatory issues', icon: Scale, type: 'legal_action' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'risk_event',
                        subtype: item.type,
                        name: item.name,
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowRiskModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">Add {item.name}</div>
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
                  { name: 'Critical System', desc: 'IT infrastructure, databases', icon: Building2, type: 'critical_system' },
                  { name: 'Business Location', desc: 'Offices, plants', icon: MapPin, type: 'business_location' },
                  { name: 'Data Asset', desc: 'Customer data, IP', icon: Database, type: 'data_asset' },
                  { name: 'Key Personnel', desc: 'Critical staff, expertise', icon: Users, type: 'key_personnel' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'business_asset',
                        subtype: item.type,
                        name: item.name,
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowAssetModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">Add {item.name}</div>
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
                  { name: 'Security Control', desc: 'Firewalls, monitoring', icon: Shield, type: 'security_control' },
                  { name: 'Business Continuity', desc: 'DR, redundancy', icon: RotateCcw, type: 'business_continuity' },
                  { name: 'Insurance Coverage', desc: 'Risk transfer, coverage', icon: FileText, type: 'insurance_coverage' },
                  { name: 'Backup Systems', desc: 'Data backup, recovery', icon: HardDrive, type: 'backup_systems' }
                ].map((item, index) => (
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'defense_system',
                        subtype: item.type,
                        name: item.name,
                        description: item.desc
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => setShowDefenseModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 text-left transition-all hover:scale-[1.02] border border-gray-600 cursor-move"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-white">Add {item.name}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="flex justify-between text-gray-300">
                <span>🔗 Connections</span>
                <span className="text-purple-400 font-medium">{connections.length}</span>
              </div>
              {monteCarloResults && (
                <div className="pt-2 border-t border-gray-600">
                  <button
                    onClick={() => setShowMonteCarloModal(true)}
                    className="w-full text-left text-xs text-green-400 hover:text-green-300 transition-colors"
                  >
                    ✓ Analysis results available
                  </button>
                </div>
              )}
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