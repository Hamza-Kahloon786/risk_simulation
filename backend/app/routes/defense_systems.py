# backend/app/routes/defense_systems.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.models.defense_system import DefenseSystem, DefenseSystemCreate, DefenseSystemUpdate
from app.services.database import get_database

router = APIRouter()

def serialize_defense_system(defense_doc):
    """Convert MongoDB document to API response format"""
    if defense_doc:
        defense_doc["id"] = str(defense_doc["_id"])
        del defense_doc["_id"]
        
        # Convert ObjectId fields to strings
        if "scenario_id" in defense_doc and isinstance(defense_doc["scenario_id"], ObjectId):
            defense_doc["scenario_id"] = str(defense_doc["scenario_id"])
            
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at"]:
            if defense_doc.get(field) and isinstance(defense_doc[field], datetime):
                defense_doc[field] = defense_doc[field].isoformat()
        
        return defense_doc
    return None

@router.get("/{scenario_id}/defense-systems/")
async def get_defense_systems(scenario_id: str, db=Depends(get_database)):
    """Get all defense systems for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        cursor = db.defense_systems.find({"scenario_id": ObjectId(scenario_id)})
        defense_systems = await cursor.to_list(100)
        
        serialized_systems = []
        for system in defense_systems:
            serialized_systems.append(serialize_defense_system(system))
        
        return {
            "success": True,
            "data": serialized_systems,
            "count": len(serialized_systems)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching defense systems: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching defense systems: {str(e)}")

@router.post("/{scenario_id}/defense-systems/")
async def create_defense_system(scenario_id: str, defense_system: DefenseSystemCreate, db=Depends(get_database)):
    """Create a new defense system for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        # Convert Pydantic model to dict and add metadata
        defense_system_dict = defense_system.model_dump()
        defense_system_dict["scenario_id"] = ObjectId(scenario_id)
        defense_system_dict["created_at"] = datetime.utcnow()
        defense_system_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await db.defense_systems.insert_one(defense_system_dict)
        
        # Fetch the created defense system
        created_defense_system = await db.defense_systems.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_defense_system(created_defense_system),
            "message": "Defense system created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating defense system: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating defense system: {str(e)}")

@router.put("/{scenario_id}/defense-systems/{defense_id}/")
async def update_defense_system(scenario_id: str, defense_id: str, defense_system: DefenseSystemUpdate, db=Depends(get_database)):
    """Update an existing defense system"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(defense_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        # Prepare update data
        update_data = {k: v for k, v in defense_system.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.defense_systems.update_one(
            {"_id": ObjectId(defense_id), "scenario_id": ObjectId(scenario_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Defense system not found")
        
        # Fetch updated defense system
        updated_defense_system = await db.defense_systems.find_one({"_id": ObjectId(defense_id)})
        
        return {
            "success": True,
            "data": serialize_defense_system(updated_defense_system),
            "message": "Defense system updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating defense system: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating defense system: {str(e)}")

@router.delete("/{scenario_id}/defense-systems/{defense_id}/")
async def delete_defense_system(scenario_id: str, defense_id: str, db=Depends(get_database)):
    """Delete a defense system"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(defense_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        result = await db.defense_systems.delete_one({
            "_id": ObjectId(defense_id), 
            "scenario_id": ObjectId(scenario_id)
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Defense system not found")
        
        return {
            "success": True,
            "message": "Defense system deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting defense system: {str(e)}")