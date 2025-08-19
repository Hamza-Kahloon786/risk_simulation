# This code is part of a FastAPI application that implements Monte Carlo simulations for risk analysis scenarios.
# It includes endpoints for running simulations and retrieving analysis results, as well as utility functions for serializing risk events.
# routes/analysis.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from bson import ObjectId
from app.services.database import get_database
from app.services.monte_carlo import MonteCarloSimulation

router = APIRouter()

@router.post("/scenarios/{scenario_id}/run-analysis")
async def run_monte_carlo_analysis(scenario_id: str, db=Depends(get_database)) -> Dict[str, Any]:
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    # Verify scenario exists
    scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Get scenario components
    risk_events_data = await db.risk_events.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
    business_assets_data = await db.business_assets.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
    defense_systems_data = await db.defense_systems.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
    
    # Validate we have the minimum required components
    if not risk_events_data:
        raise HTTPException(status_code=400, detail="Scenario must have at least one risk event")
    
    # Run Monte Carlo simulation
    monte_carlo = MonteCarloSimulation(iterations=10000)
    results = monte_carlo.run_simulation(risk_events_data, business_assets_data, defense_systems_data)
    
    # Calculate additional metrics
    results["scenario_id"] = scenario_id
    results["total_defense_cost"] = sum(defense.get('cost', 0) for defense in defense_systems_data)
    results["total_asset_value"] = sum(asset.get('value', 0) for asset in business_assets_data)
    results["security_roi"] = calculate_security_roi(results, defense_systems_data)
    
    # Update scenario with risk score
    risk_score = min(100, (results["p90_severe_impact"] / 1000000) * 100) if results["p90_severe_impact"] > 0 else 0
    await db.scenarios.update_one(
        {"_id": ObjectId(scenario_id)},
        {"$set": {"risk_score": risk_score, "status": "completed"}}
    )
    
    return results

def calculate_security_roi(results: Dict[str, Any], defense_systems: List[Dict]) -> float:
    """
    Calculate Security Return on Investment
    """
    total_defense_cost = sum(defense.get('cost', 0) + defense.get('maintenance_cost', 0) for defense in defense_systems)
    
    if total_defense_cost == 0:
        return 0.0
    
    # Simplified ROI calculation
    # Assume 20% risk reduction from defenses
    potential_loss_reduction = results["expected_annual_loss"] * 0.2
    roi = ((potential_loss_reduction - total_defense_cost) / total_defense_cost) * 100
    
    return max(0, roi)

@router.get("/scenarios/{scenario_id}/analysis-results")
async def get_analysis_results(scenario_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    # For this implementation, we'll return mock results
    # In a production system, you'd store analysis results in the database
    return {
        "scenario_id": scenario_id,
        "p50_median_impact": 50000,
        "p90_severe_impact": 150000,
        "expected_annual_loss": 75000,
        "value_at_risk_95": 200000,
        "security_roi": 15.5,
        "status": "completed"
    }