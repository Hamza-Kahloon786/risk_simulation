# Nozama-chatbot/backend/app/services/monte_carlo.py
# This code implements a Monte Carlo simulation for risk analysis scenarios.
# It includes a MonteCarloSimulation class that runs simulations based on risk events, business assets, and defense systems.
# The results include various statistical measures such as median impact, severe impact, and expected annual loss.
import numpy as np
from typing import List, Dict, Any

class MonteCarloSimulation:
    def __init__(self, iterations: int = 10000):
        self.iterations = iterations
    
    def run_simulation(
        self, 
        risk_events: List[Dict], 
        business_assets: List[Dict], 
        defense_systems: List[Dict]
    ) -> Dict[str, Any]:
        """
        Run Monte Carlo simulation for risk analysis
        """
        results = []
        
        for _ in range(self.iterations):
            iteration_loss = 0
            
            for event in risk_events:
                # Determine if event occurs
                if np.random.random() * 100 <= event.get('probability', 0):
                    # Calculate impact with defense mitigation
                    base_impact = np.random.uniform(
                        event.get('impact_min', 0), 
                        event.get('impact_max', 0)
                    )
                    mitigated_impact = self._apply_defenses(base_impact, event, defense_systems)
                    iteration_loss += mitigated_impact
            
            results.append(iteration_loss)
        
        return self._calculate_statistics(results)
    
    def _apply_defenses(
        self, 
        base_impact: float, 
        risk_event: Dict, 
        defense_systems: List[Dict]
    ) -> float:
        """
        Apply defense system effectiveness to reduce impact
        """
        mitigated_impact = base_impact
        
        for defense in defense_systems:
            # Simple mitigation: reduce impact by defense effectiveness
            effectiveness = defense.get('effectiveness', 0) / 100
            coverage = defense.get('coverage_percentage', 100) / 100
            reduction = effectiveness * coverage
            mitigated_impact *= (1 - reduction)
        
        return max(0, mitigated_impact)
    
    def _calculate_statistics(self, results: List[float]) -> Dict[str, Any]:
        """
        Calculate statistical measures from simulation results
        """
        results_array = np.array(results)
        
        return {
            "p50_median_impact": float(np.percentile(results_array, 50)),
            "p90_severe_impact": float(np.percentile(results_array, 90)),
            "p95_impact": float(np.percentile(results_array, 95)),
            "p99_worst_case": float(np.percentile(results_array, 99)),
            "expected_annual_loss": float(np.mean(results_array)),
            "value_at_risk_95": float(np.percentile(results_array, 95)),
            "conditional_var_95": float(np.mean(results_array[results_array >= np.percentile(results_array, 95)])),
            "standard_deviation": float(np.std(results_array)),
            "maximum_loss": float(np.max(results_array)),
            "minimum_loss": float(np.min(results_array)),
            "iterations": self.iterations,
            "confidence_intervals": {
                "p10": float(np.percentile(results_array, 10)),
                "p25": float(np.percentile(results_array, 25)),
                "p75": float(np.percentile(results_array, 75)),
                "p90": float(np.percentile(results_array, 90))
            }
        }