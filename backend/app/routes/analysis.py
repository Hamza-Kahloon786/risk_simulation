# # This code is part of a FastAPI application that implements Monte Carlo simulations for risk analysis scenarios.
# # It includes endpoints for running simulations and retrieving analysis results, as well as utility functions for serializing risk events.
# # routes/analysis.py
# from fastapi import APIRouter, HTTPException, Depends
# from typing import Dict, Any, List
# from bson import ObjectId
# from app.services.database import get_database
# from app.services.monte_carlo import MonteCarloSimulation

# router = APIRouter()

# @router.post("/scenarios/{scenario_id}/run-analysis")
# async def run_monte_carlo_analysis(scenario_id: str, db=Depends(get_database)) -> Dict[str, Any]:
#     if not ObjectId.is_valid(scenario_id):
#         raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
#     # Verify scenario exists
#     scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
#     if not scenario:
#         raise HTTPException(status_code=404, detail="Scenario not found")
    
#     # Get scenario components
#     risk_events_data = await db.risk_events.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
#     business_assets_data = await db.business_assets.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
#     defense_systems_data = await db.defense_systems.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
    
#     # Validate we have the minimum required components
#     if not risk_events_data:
#         raise HTTPException(status_code=400, detail="Scenario must have at least one risk event")
    
#     # Run Monte Carlo simulation
#     monte_carlo = MonteCarloSimulation(iterations=10000)
#     results = monte_carlo.run_simulation(risk_events_data, business_assets_data, defense_systems_data)
    
#     # Calculate additional metrics
#     results["scenario_id"] = scenario_id
#     results["total_defense_cost"] = sum(defense.get('cost', 0) for defense in defense_systems_data)
#     results["total_asset_value"] = sum(asset.get('value', 0) for asset in business_assets_data)
#     results["security_roi"] = calculate_security_roi(results, defense_systems_data)
    
#     # Update scenario with risk score
#     risk_score = min(100, (results["p90_severe_impact"] / 1000000) * 100) if results["p90_severe_impact"] > 0 else 0
#     await db.scenarios.update_one(
#         {"_id": ObjectId(scenario_id)},
#         {"$set": {"risk_score": risk_score, "status": "completed"}}
#     )
    
#     return results

# def calculate_security_roi(results: Dict[str, Any], defense_systems: List[Dict]) -> float:
#     """
#     Calculate Security Return on Investment
#     """
#     total_defense_cost = sum(defense.get('cost', 0) + defense.get('maintenance_cost', 0) for defense in defense_systems)
    
#     if total_defense_cost == 0:
#         return 0.0
    
#     # Simplified ROI calculation
#     # Assume 20% risk reduction from defenses
#     potential_loss_reduction = results["expected_annual_loss"] * 0.2
#     roi = ((potential_loss_reduction - total_defense_cost) / total_defense_cost) * 100
    
#     return max(0, roi)

# @router.get("/scenarios/{scenario_id}/analysis-results")
# async def get_analysis_results(scenario_id: str, db=Depends(get_database)):
#     if not ObjectId.is_valid(scenario_id):
#         raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
#     # For this implementation, we'll return mock results
#     # In a production system, you'd store analysis results in the database
#     return {
#         "scenario_id": scenario_id,
#         "p50_median_impact": 50000,
#         "p90_severe_impact": 150000,
#         "expected_annual_loss": 75000,
#         "value_at_risk_95": 200000,
#         "security_roi": 15.5,
#         "status": "completed"
#     }
























# backend/app/routes/analysis.py - ENHANCED WITH DATABASE STORAGE
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from bson import ObjectId
from datetime import datetime
from app.services.database import get_database
from app.services.monte_carlo import MonteCarloSimulation

router = APIRouter()

# backend/app/routes/analysis.py - ADD BETTER ERROR HANDLING
@router.post("/scenarios/{scenario_id}/run-analysis")
async def run_monte_carlo_analysis(scenario_id: str, db=Depends(get_database)) -> Dict[str, Any]:
    """Run Monte Carlo analysis and return real results"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        print(f"Running analysis for scenario: {scenario_id}")
        
        # Get scenario components for real analysis
        risk_events_data = await db.risk_events.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
        business_assets_data = await db.business_assets.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
        defense_systems_data = await db.defense_systems.find({"scenario_id": ObjectId(scenario_id)}).to_list(100)
        
        print(f"Found components: {len(risk_events_data)} risk events, {len(business_assets_data)} assets, {len(defense_systems_data)} defenses")
        
        # Validate we have the minimum required components
        if not risk_events_data:
            raise HTTPException(status_code=400, detail="Scenario must have at least one risk event")
        
        # Run REAL Monte Carlo simulation with actual data
        monte_carlo = MonteCarloSimulation(iterations=10000)
        results = monte_carlo.run_simulation(risk_events_data, business_assets_data, defense_systems_data)
        
        # Calculate additional real metrics
        results["scenario_id"] = scenario_id
        results["generated_at"] = datetime.utcnow().isoformat()
        results["total_defense_cost"] = sum(defense.get('cost', 0) for defense in defense_systems_data)
        results["total_asset_value"] = sum(asset.get('value', 0) for asset in business_assets_data)
        results["security_roi"] = calculate_security_roi(results, defense_systems_data)
        results["components_analyzed"] = {
            "risk_events": len(risk_events_data),
            "business_assets": len(business_assets_data),
            "defense_systems": len(defense_systems_data)
        }
        
        # Calculate risk score based on real simulation results
        risk_score = min(100, (results["p90_severe_impact"] / 1000000) * 100) if results["p90_severe_impact"] > 0 else 0
        results["risk_score"] = risk_score
        
        # Update scenario with real risk score and completion status
        await db.scenarios.update_one(
            {"_id": ObjectId(scenario_id)},
            {"$set": {
                "risk_score": risk_score, 
                "status": "completed",
                "last_analysis": datetime.utcnow()
            }}
        )
        
        print(f"Monte Carlo analysis completed successfully. P50: {results['p50_median_impact']}, P90: {results['p90_severe_impact']}")
        
        return results
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        print(f"Unexpected error in Monte Carlo analysis: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/scenarios/{scenario_id}/results")
async def store_analysis_results(scenario_id: str, results: Dict[str, Any], db=Depends(get_database)):
    """Store Monte Carlo analysis results in database"""
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    # Verify scenario exists
    scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Prepare analysis result document for database storage
    analysis_result = {
        "scenario_id": ObjectId(scenario_id),
        "analysis_type": "monte_carlo",
        "generated_at": datetime.utcnow(),
        "stored_at": datetime.utcnow(),
        
        # Core Monte Carlo results
        "iterations": results.get("iterations", 10000),
        "p50_median_impact": results.get("p50_median_impact", 0),
        "p90_severe_impact": results.get("p90_severe_impact", 0),
        "p95_impact": results.get("p95_impact", 0),
        "p99_worst_case": results.get("p99_worst_case", 0),
        "expected_annual_loss": results.get("expected_annual_loss", 0),
        "value_at_risk_95": results.get("value_at_risk_95", 0),
        "conditional_var_95": results.get("conditional_var_95", 0),
        "standard_deviation": results.get("standard_deviation", 0),
        "maximum_loss": results.get("maximum_loss", 0),
        "minimum_loss": results.get("minimum_loss", 0),
        
        # Confidence intervals
        "confidence_intervals": results.get("confidence_intervals", {}),
        
        # Business metrics
        "security_roi": results.get("security_roi", 0),
        "risk_score": results.get("risk_score", 0),
        "total_defense_cost": results.get("total_defense_cost", 0),
        "total_asset_value": results.get("total_asset_value", 0),
        
        # Component analysis
        "components_analyzed": results.get("components_analyzed", {
            "risk_events": 0,
            "business_assets": 0,
            "defense_systems": 0
        }),
        
        # Metadata
        "version": "1.0",
        "analysis_engine": "monte_carlo_simulation_v1"
    }
    
    try:
        # Insert analysis result into database
        result = await db.analysis_results.insert_one(analysis_result)
        
        # Update scenario with reference to latest analysis
        await db.scenarios.update_one(
            {"_id": ObjectId(scenario_id)},
            {"$set": {
                "latest_analysis_id": result.inserted_id,
                "latest_analysis_date": datetime.utcnow()
            }}
        )
        
        print(f"Analysis results stored successfully for scenario {scenario_id}")
        
        return {
            "success": True,
            "analysis_id": str(result.inserted_id),
            "message": "Monte Carlo analysis results stored in database successfully",
            "stored_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"Error storing analysis results: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to store analysis results: {str(e)}")

@router.get("/scenarios/{scenario_id}/results")
async def get_analysis_results(scenario_id: str, limit: int = 10, db=Depends(get_database)):
    """Retrieve stored Monte Carlo analysis results from database"""
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    try:
        # Get analysis results for this scenario, sorted by most recent first
        cursor = db.analysis_results.find(
            {"scenario_id": ObjectId(scenario_id)}
        ).sort("stored_at", -1).limit(limit)
        
        results = await cursor.to_list(limit)
        
        # Convert ObjectId to string for JSON serialization
        for result in results:
            result["_id"] = str(result["_id"])
            result["scenario_id"] = str(result["scenario_id"])
            if "stored_at" in result:
                result["stored_at"] = result["stored_at"].isoformat()
            if "generated_at" in result:
                result["generated_at"] = result["generated_at"].isoformat()
        
        print(f"Retrieved {len(results)} analysis results for scenario {scenario_id}")
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "results_count": len(results),
            "data": results
        }
        
    except Exception as e:
        print(f"Error retrieving analysis results: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analysis results: {str(e)}")

@router.get("/scenarios/{scenario_id}/results/{analysis_id}")
async def get_specific_analysis_result(scenario_id: str, analysis_id: str, db=Depends(get_database)):
    """Get a specific analysis result by ID"""
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    if not ObjectId.is_valid(analysis_id):
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
    
    try:
        result = await db.analysis_results.find_one({
            "_id": ObjectId(analysis_id),
            "scenario_id": ObjectId(scenario_id)
        })
        
        if not result:
            raise HTTPException(status_code=404, detail="Analysis result not found")
        
        # Convert ObjectId to string for JSON serialization
        result["_id"] = str(result["_id"])
        result["scenario_id"] = str(result["scenario_id"])
        if "stored_at" in result:
            result["stored_at"] = result["stored_at"].isoformat()
        if "generated_at" in result:
            result["generated_at"] = result["generated_at"].isoformat()
        
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        print(f"Error retrieving specific analysis result: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analysis result: {str(e)}")

@router.delete("/scenarios/{scenario_id}/results/{analysis_id}")
async def delete_analysis_result(scenario_id: str, analysis_id: str, db=Depends(get_database)):
    """Delete a specific analysis result"""
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    if not ObjectId.is_valid(analysis_id):
        raise HTTPException(status_code=400, detail="Invalid analysis ID")
    
    try:
        result = await db.analysis_results.delete_one({
            "_id": ObjectId(analysis_id),
            "scenario_id": ObjectId(scenario_id)
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Analysis result not found")
        
        print(f"Deleted analysis result {analysis_id} for scenario {scenario_id}")
        
        return {
            "success": True,
            "message": "Analysis result deleted successfully"
        }
        
    except Exception as e:
        print(f"Error deleting analysis result: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete analysis result: {str(e)}")

@router.get("/scenarios/{scenario_id}/results/summary")
async def get_analysis_summary(scenario_id: str, db=Depends(get_database)):
    """Get summary statistics for all analysis results of a scenario"""
    if not ObjectId.is_valid(scenario_id):
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    try:
        # Get all analysis results for aggregation
        cursor = db.analysis_results.find({"scenario_id": ObjectId(scenario_id)})
        results = await cursor.to_list(None)
        
        if not results:
            return {
                "success": True,
                "scenario_id": scenario_id,
                "summary": {
                    "total_analyses": 0,
                    "message": "No analysis results found"
                }
            }
        
        # Calculate summary statistics
        total_analyses = len(results)
        latest_result = max(results, key=lambda x: x.get("stored_at", datetime.min))
        
        # Calculate averages
        avg_expected_loss = sum(r.get("expected_annual_loss", 0) for r in results) / total_analyses
        avg_p90_impact = sum(r.get("p90_severe_impact", 0) for r in results) / total_analyses
        avg_security_roi = sum(r.get("security_roi", 0) for r in results) / total_analyses
        avg_risk_score = sum(r.get("risk_score", 0) for r in results) / total_analyses
        
        summary = {
            "total_analyses": total_analyses,
            "latest_analysis_date": latest_result.get("stored_at", datetime.utcnow()).isoformat(),
            "latest_risk_score": latest_result.get("risk_score", 0),
            "latest_expected_loss": latest_result.get("expected_annual_loss", 0),
            "averages": {
                "expected_annual_loss": avg_expected_loss,
                "p90_severe_impact": avg_p90_impact,
                "security_roi": avg_security_roi,
                "risk_score": avg_risk_score
            },
            "trends": {
                "risk_increasing": latest_result.get("risk_score", 0) > avg_risk_score,
                "roi_improving": latest_result.get("security_roi", 0) > avg_security_roi
            }
        }
        
        return {
            "success": True,
            "scenario_id": scenario_id,
            "summary": summary
        }
        
    except Exception as e:
        print(f"Error generating analysis summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate analysis summary: {str(e)}")

def calculate_security_roi(results: Dict[str, Any], defense_systems: List[Dict]) -> float:
    """
    Calculate Security Return on Investment based on real Monte Carlo results
    """
    total_defense_cost = sum(
        defense.get('cost', 0) + defense.get('maintenance_cost', 0) 
        for defense in defense_systems
    )
    
    if total_defense_cost == 0:
        return 0.0
    
    # More sophisticated ROI calculation using real simulation results
    # Estimate risk reduction based on defense effectiveness
    total_effectiveness = sum(defense.get('effectiveness', 0) for defense in defense_systems)
    avg_effectiveness = total_effectiveness / len(defense_systems) if defense_systems else 0
    
    # Estimate potential loss reduction (conservative approach)
    risk_reduction_factor = min(avg_effectiveness / 100 * 0.8, 0.9)  # Max 90% reduction
    potential_loss_reduction = results.get("expected_annual_loss", 0) * risk_reduction_factor
    
    # Calculate ROI: (Benefit - Cost) / Cost * 100
    net_benefit = potential_loss_reduction - total_defense_cost
    roi = (net_benefit / total_defense_cost) * 100 if total_defense_cost > 0 else 0
    
    return max(0, roi)  # Ensure non-negative ROI