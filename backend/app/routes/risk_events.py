# backend/app/routes/risk_events.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.models.risk_event import RiskEvent, RiskEventCreate, RiskEventUpdate
from app.services.database import get_database

router = APIRouter()

def serialize_risk_event(event_doc):
    """Convert MongoDB document to API response format"""
    if event_doc:
        event_doc["id"] = str(event_doc["_id"])
        del event_doc["_id"]
        
        # Convert ObjectId fields to strings
        if "scenario_id" in event_doc and isinstance(event_doc["scenario_id"], ObjectId):
            event_doc["scenario_id"] = str(event_doc["scenario_id"])
            
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at"]:
            if event_doc.get(field) and isinstance(event_doc[field], datetime):
                event_doc[field] = event_doc[field].isoformat()
        
        return event_doc
    return None

@router.get("/{scenario_id}/risk-events/")
async def get_risk_events(scenario_id: str, db=Depends(get_database)):
    """Get all risk events for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        cursor = db.risk_events.find({"scenario_id": ObjectId(scenario_id)})
        risk_events = await cursor.to_list(100)
        
        serialized_events = []
        for event in risk_events:
            serialized_events.append(serialize_risk_event(event))
        
        return {
            "success": True,
            "data": serialized_events,
            "count": len(serialized_events)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching risk events: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching risk events: {str(e)}")

@router.post("/{scenario_id}/risk-events/")
async def create_risk_event(scenario_id: str, risk_event: RiskEventCreate, db=Depends(get_database)):
    """Create a new risk event for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        # Convert Pydantic model to dict and add metadata
        risk_event_dict = risk_event.model_dump()  # Use model_dump() instead of dict()
        risk_event_dict["scenario_id"] = ObjectId(scenario_id)
        risk_event_dict["created_at"] = datetime.utcnow()
        risk_event_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await db.risk_events.insert_one(risk_event_dict)
        
        # Fetch the created risk event
        created_risk_event = await db.risk_events.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_risk_event(created_risk_event),
            "message": "Risk event created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating risk event: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating risk event: {str(e)}")

@router.put("/{scenario_id}/risk-events/{event_id}/")
async def update_risk_event(scenario_id: str, event_id: str, risk_event: RiskEventUpdate, db=Depends(get_database)):
    """Update an existing risk event"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        # Prepare update data
        update_data = {k: v for k, v in risk_event.model_dump().items() if v is not None}  # Use model_dump()
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.risk_events.update_one(
            {"_id": ObjectId(event_id), "scenario_id": ObjectId(scenario_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Risk event not found")
        
        # Fetch updated risk event
        updated_risk_event = await db.risk_events.find_one({"_id": ObjectId(event_id)})
        
        return {
            "success": True,
            "data": serialize_risk_event(updated_risk_event),
            "message": "Risk event updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating risk event: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating risk event: {str(e)}")

@router.delete("/{scenario_id}/risk-events/{event_id}/")
async def delete_risk_event(scenario_id: str, event_id: str, db=Depends(get_database)):
    """Delete a risk event"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        result = await db.risk_events.delete_one({
            "_id": ObjectId(event_id), 
            "scenario_id": ObjectId(scenario_id)
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Risk event not found")
        
        return {
            "success": True,
            "message": "Risk event deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting risk event: {str(e)}")