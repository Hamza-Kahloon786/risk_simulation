# backend/app/routes/scenarios.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.services.database import get_database

router = APIRouter()

def serialize_scenario(scenario_doc):
    """Convert MongoDB document to API response format"""
    if scenario_doc:
        scenario_doc["id"] = str(scenario_doc["_id"])
        del scenario_doc["_id"]
        
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at"]:
            if scenario_doc.get(field) and isinstance(scenario_doc[field], datetime):
                scenario_doc[field] = scenario_doc[field].isoformat()
        
        return scenario_doc
    return None

@router.get("/")
async def get_all_scenarios(db=Depends(get_database)):
    """Get all scenarios"""
    try:
        cursor = db.scenarios.find()
        scenarios = await cursor.to_list(100)
        
        serialized_scenarios = []
        for scenario in scenarios:
            serialized_scenarios.append(serialize_scenario(scenario))
        
        return {
            "success": True,
            "data": serialized_scenarios,
            "count": len(serialized_scenarios)
        }
    except Exception as e:
        print(f"Error fetching scenarios: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching scenarios: {str(e)}")

@router.get("/{scenario_id}")
async def get_scenario(scenario_id: str, db=Depends(get_database)):
    """Get a single scenario by ID"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID format")
        
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        return {
            "success": True,
            "data": serialize_scenario(scenario)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scenario: {str(e)}")

@router.post("/")
async def create_scenario(scenario_data: dict, db=Depends(get_database)):
    """Create a new scenario"""
    try:
        # Add timestamps
        scenario_data["created_at"] = datetime.utcnow()
        scenario_data["updated_at"] = datetime.utcnow()
        
        # Set default values
        scenario_data.setdefault("status", "draft")
        scenario_data.setdefault("risk_score", 0)
        
        # Insert into database
        result = await db.scenarios.insert_one(scenario_data)
        
        # Fetch the created scenario
        created_scenario = await db.scenarios.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_scenario(created_scenario),
            "message": "Scenario created successfully"
        }
    except Exception as e:
        print(f"Error creating scenario: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating scenario: {str(e)}")

@router.put("/{scenario_id}")
async def update_scenario(scenario_id: str, scenario_data: dict, db=Depends(get_database)):
    """Update an existing scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID format")
        
        # Add update timestamp
        scenario_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.scenarios.update_one(
            {"_id": ObjectId(scenario_id)}, 
            {"$set": scenario_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        # Fetch updated scenario
        updated_scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        
        return {
            "success": True,
            "data": serialize_scenario(updated_scenario),
            "message": "Scenario updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating scenario: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating scenario: {str(e)}")

@router.delete("/{scenario_id}")
async def delete_scenario(scenario_id: str, db=Depends(get_database)):
    """Delete a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID format")
        
        result = await db.scenarios.delete_one({"_id": ObjectId(scenario_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        return {
            "success": True,
            "message": "Scenario deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting scenario: {str(e)}")

@router.post("/sample-data")
async def create_sample_scenarios(db=Depends(get_database)):
    """Create sample scenario data for testing"""
    try:
        sample_scenarios = [
            {
                "name": "Cyber Attack Simulation",
                "description": "Simulating a potential cyber attack on critical infrastructure",
                "status": "active",
                "risk_score": 75,
                "category": "cyber_security",
                "probability": 0.3,
                "impact": 8,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Natural Disaster Response",
                "description": "Emergency response scenario for natural disasters",
                "status": "draft",
                "risk_score": 65,
                "category": "natural_disaster",
                "probability": 0.2,
                "impact": 9,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Supply Chain Disruption",
                "description": "Analyzing impact of supply chain interruptions",
                "status": "active",
                "risk_score": 60,
                "category": "operational",
                "probability": 0.4,
                "impact": 6,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Clear existing sample data
        await db.scenarios.delete_many({"name": {"$in": [s["name"] for s in sample_scenarios]}})
        
        # Insert sample data
        result = await db.scenarios.insert_many(sample_scenarios)
        
        return {
            "success": True,
            "message": f"Created {len(result.inserted_ids)} sample scenarios",
            "inserted_ids": [str(id) for id in result.inserted_ids]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating sample data: {str(e)}")

@router.get("/stats/summary")
async def get_scenario_stats(db=Depends(get_database)):
    """Get scenario statistics"""
    try:
        total_scenarios = await db.scenarios.count_documents({})
        active_scenarios = await db.scenarios.count_documents({"status": "active"})
        
        # Calculate average risk score
        pipeline = [
            {"$group": {
                "_id": None,
                "avg_risk_score": {"$avg": "$risk_score"},
                "max_risk_score": {"$max": "$risk_score"},
                "min_risk_score": {"$min": "$risk_score"}
            }}
        ]
        
        risk_stats = await db.scenarios.aggregate(pipeline).to_list(1)
        avg_risk = risk_stats[0]["avg_risk_score"] if risk_stats else 0
        
        return {
            "success": True,
            "data": {
                "total_scenarios": total_scenarios,
                "active_scenarios": active_scenarios,
                "draft_scenarios": await db.scenarios.count_documents({"status": "draft"}),
                "average_risk_score": round(avg_risk, 2) if avg_risk else 0,
                "high_risk_scenarios": await db.scenarios.count_documents({"risk_score": {"$gte": 70}})
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scenario stats: {str(e)}")

@router.get("/filter/by-status/{status}")
async def get_scenarios_by_status(status: str, db=Depends(get_database)):
    """Get scenarios filtered by status"""
    try:
        cursor = db.scenarios.find({"status": status})
        scenarios = await cursor.to_list(100)
        
        serialized_scenarios = []
        for scenario in scenarios:
            serialized_scenarios.append(serialize_scenario(scenario))
        
        return {
            "success": True,
            "data": serialized_scenarios,
            "count": len(serialized_scenarios)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scenarios by status: {str(e)}")

@router.get("/filter/by-category/{category}")
async def get_scenarios_by_category(category: str, db=Depends(get_database)):
    """Get scenarios filtered by category"""
    try:
        cursor = db.scenarios.find({"category": category})
        scenarios = await cursor.to_list(100)
        
        serialized_scenarios = []
        for scenario in scenarios:
            serialized_scenarios.append(serialize_scenario(scenario))
        
        return {
            "success": True,
            "data": serialized_scenarios,
            "count": len(serialized_scenarios)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scenarios by category: {str(e)}")