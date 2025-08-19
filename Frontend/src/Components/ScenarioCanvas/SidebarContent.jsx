// frontend/src/components/ScenarioCanvas/SidebarContent.jsx - UPDATED TO MATCH DESIGN
import React from 'react'
import { 
  Zap, 
  Building, 
  AlertTriangle, 
  Server, 
  MapPin, 
  Shield,
  Database,
  Users,
  Scale,
  Activity,
  TrendingUp,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { getIconForRiskType, getIconForAssetType, getColorForRiskType } from './utils.jsx'

const SidebarContent = ({ 
  scenario, 
  id, 
  riskEvents, 
  businessAssets, 
  defenseSystems, 
  setShowRiskEventModal,
  setShowBusinessAssetModal,
  setShowDefenseSystemModal,
  p50Preview = 'N/A',
  p90Preview = 'N/A'
}) => {
  const [riskEventsExpanded, setRiskEventsExpanded] = React.useState(true)
  const [businessAssetsExpanded, setBusinessAssetsExpanded] = React.useState(true)
  const [defenseSystemsExpanded, setDefenseSystemsExpanded] = React.useState(true)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">Scenario Components</h3>
        <p className="text-sm text-gray-400">Add components to build your scenario</p>
      </div>

      {/* Current Scenario Info - Moved to top */}
      <div className="p-6 border-b border-gray-700">
        <h4 className="text-sm font-medium text-white mb-3">Current Scenario</h4>
        <div className="space-y-2">
          <p className="text-sm text-white">{scenario?.name}</p>
          <p className="text-xs text-gray-400">ID: {id?.substring(0, 8)}...</p>
          <div className="text-xs">
            <span className="text-gray-400">Status: </span>
            <span className="text-green-400">{scenario?.status || 'completed'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Risk Events Section */}
        <div className="p-6 border-b border-gray-700">
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setRiskEventsExpanded(!riskEventsExpanded)}
          >
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              RISK EVENTS ({riskEvents.length})
            </h4>
            {riskEventsExpanded ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
          
          {riskEventsExpanded && (
            <div className="space-y-3">
              {/* Add Risk Event Buttons */}
              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'risk_event',
                    subtype: 'cyber_attack',
                    name: 'Cyber Attack',
                    description: 'Ransomware, data breaches'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowRiskEventModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-red-500 rounded-lg hover:bg-red-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Cyber Attack</p>
                  <p className="text-xs text-gray-400">Ransomware, data breaches</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'risk_event',
                    subtype: 'supply_disruption',
                    name: 'Supply Disruption',
                    description: 'Supplier failures, logistics'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowRiskEventModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-orange-500 rounded-lg hover:bg-orange-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Supply Disruption</p>
                  <p className="text-xs text-gray-400">Supplier failures, logistics</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'risk_event',
                    subtype: 'operational_risk',
                    name: 'Operational Risk',
                    description: 'Process failures, human errors'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowRiskEventModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Operational Risk</p>
                  <p className="text-xs text-gray-400">Process failures, human errors</p>
                </div>
              </div>

              {/* Show existing risk events with real data */}
              {riskEvents.map((event) => (
                <div key={event._id || event.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
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
          )}
        </div>

        {/* Business Assets Section */}
        <div className="p-6 border-b border-gray-700">
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setBusinessAssetsExpanded(!businessAssetsExpanded)}
          >
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              BUSINESS ASSETS ({businessAssets.length})
            </h4>
            {businessAssetsExpanded ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
          
          {businessAssetsExpanded && (
            <div className="space-y-3">
              {/* Add Business Asset Buttons */}
              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'business_asset',
                    subtype: 'critical_system',
                    name: 'Critical System',
                    description: 'IT infrastructure, databases'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowBusinessAssetModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Server className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Critical System</p>
                  <p className="text-xs text-gray-400">IT infrastructure, databases</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'business_asset',
                    subtype: 'business_location',
                    name: 'Business Location',
                    description: 'Offices, plants'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowBusinessAssetModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Business Location</p>
                  <p className="text-xs text-gray-400">Offices, plants</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'business_asset',
                    subtype: 'data_asset',
                    name: 'Data Asset',
                    description: 'Customer data, IP'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowBusinessAssetModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Data Asset</p>
                  <p className="text-xs text-gray-400">Customer data, IP</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'business_asset',
                    subtype: 'key_personnel',
                    name: 'Key Personnel',
                    description: 'Critical staff, expertise'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowBusinessAssetModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Key Personnel</p>
                  <p className="text-xs text-gray-400">Critical staff, expertise</p>
                </div>
              </div>

              {/* Show existing business assets with real data */}
              {businessAssets.map((asset) => (
                <div key={asset._id || asset.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
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
          )}
        </div>

        {/* Defense Systems Section */}
        <div className="p-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setDefenseSystemsExpanded(!defenseSystemsExpanded)}
          >
            <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              DEFENSE SYSTEMS ({defenseSystems.length})
            </h4>
            {defenseSystemsExpanded ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </div>
          
          {defenseSystemsExpanded && (
            <div className="space-y-3">
              {/* Add Defense System Buttons */}
              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'defense_system',
                    subtype: 'security_control',
                    name: 'Security Control',
                    description: 'Firewalls, monitoring'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowDefenseSystemModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-green-500 rounded-lg hover:bg-green-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Security Control</p>
                  <p className="text-xs text-gray-400">Firewalls, monitoring</p>
                </div>
              </div>

              <div
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'defense_system',
                    subtype: 'business_continuity',
                    name: 'Business Continuity',
                    description: 'DR, redundancy'
                  }))
                  e.dataTransfer.effectAllowed = 'copy'
                }}
                onClick={() => setShowDefenseSystemModal(true)}
                className="w-full flex items-center space-x-3 p-3 border-2 border-dashed border-green-500 rounded-lg hover:bg-green-500/10 transition-colors group cursor-move"
              >
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Add Business Continuity</p>
                  <p className="text-xs text-gray-400">DR, redundancy</p>
                </div>
              </div>

              {/* Show existing defense systems with real data */}
              {defenseSystems.map((defense) => (
                <div key={defense._id || defense.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
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
          )}
        </div>
      </div>

      {/* Quick Status Section - Updated with real data */}
      <div className="p-6 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-medium text-white">Quick Status</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">P50 Impact</span>
            </div>
            <span className="text-xs text-gray-400">{p50Preview}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">P90 Impact</span>
            </div>
            <span className="text-xs text-gray-400">{p90Preview}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span className="text-xs text-gray-400">Components</span>
            </div>
            <span className="text-xs text-white font-medium">{riskEvents.length + businessAssets.length + defenseSystems.length}</span>
          </div>
          
          <div className="mt-4 p-3 bg-gray-700 rounded text-center">
            <p className="text-xs text-gray-400">
              {riskEvents.length > 0 ? 'Click components to connect them' : 'Add components to see risk preview'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarContent
