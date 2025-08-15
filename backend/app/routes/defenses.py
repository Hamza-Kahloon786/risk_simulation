# backend/app/routes/defenses.py
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.models.defense import Defense, DefenseCreate, DefenseUpdate
from app.services.database import get_database

router = APIRouter()

def serialize_defense(defense_doc):
    """Convert MongoDB document to API response format"""
    if defense_doc:
        defense_doc["id"] = str(defense_doc["_id"])
        del defense_doc["_id"]
        return defense_doc
    return None

@router.get("/", response_model=dict)
async def get_defenses(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db=Depends(get_database)
):
    """Get all defenses with optional filtering"""
    try:
        # Build filter query
        filter_query = {}
        if category and category != 'all':
            filter_query["category"] = category
        if status and status != 'all':
            filter_query["status"] = status
        
        # Get defenses from database
        cursor = db.defenses.find(filter_query)
        defenses = await cursor.to_list(100)
        
        # Serialize the results
        serialized_defenses = []
        for defense in defenses:
            serialized_defenses.append(serialize_defense(defense))
        
        return {
            "success": True,
            "data": serialized_defenses,
            "count": len(serialized_defenses)
        }
    except Exception as e:
        print(f"Error fetching defenses: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching defenses: {str(e)}")

@router.get("/{defense_id}")
async def get_defense(defense_id: str, db=Depends(get_database)):
    """Get a single defense by ID"""
    try:
        if not ObjectId.is_valid(defense_id):
            raise HTTPException(status_code=400, detail="Invalid defense ID format")
        
        defense = await db.defenses.find_one({"_id": ObjectId(defense_id)})
        if not defense:
            raise HTTPException(status_code=404, detail="Defense not found")
        
        return {
            "success": True,
            "data": serialize_defense(defense)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching defense: {str(e)}")

@router.post("/")
async def create_defense(defense: DefenseCreate, db=Depends(get_database)):
    """Create a new defense system"""
    try:
        # Convert Pydantic model to dict
        defense_dict = defense.model_dump()
        
        # Add timestamps
        defense_dict["created_at"] = datetime.utcnow()
        defense_dict["updated_at"] = datetime.utcnow()
        
        # Calculate ROI if not provided
        if defense_dict.get("roi", 0) == 0:
            annual_cost = defense_dict.get("annual_cost", 0)
            estimated_savings = defense_dict.get("estimated_loss_prevented", 0)
            effectiveness = defense_dict.get("effectiveness", 0) / 100
            
            if annual_cost > 0:
                defense_dict["roi"] = round(((estimated_savings * effectiveness - annual_cost) / annual_cost) * 100, 2)
        
        # Insert into database
        result = await db.defenses.insert_one(defense_dict)
        
        # Fetch the created defense
        created_defense = await db.defenses.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_defense(created_defense),
            "message": "Defense system created successfully"
        }
    except Exception as e:
        print(f"Error creating defense: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating defense: {str(e)}")

@router.put("/{defense_id}")
async def update_defense(defense_id: str, defense: DefenseUpdate, db=Depends(get_database)):
    """Update an existing defense system"""
    try:
        if not ObjectId.is_valid(defense_id):
            raise HTTPException(status_code=400, detail="Invalid defense ID format")
        
        # Get existing defense
        existing_defense = await db.defenses.find_one({"_id": ObjectId(defense_id)})
        if not existing_defense:
            raise HTTPException(status_code=404, detail="Defense not found")
        
        # Prepare update data
        update_data = {k: v for k, v in defense.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Recalculate ROI if relevant fields are updated
        if any(field in update_data for field in ["annual_cost", "estimated_loss_prevented", "effectiveness"]):
            annual_cost = update_data.get("annual_cost", existing_defense.get("annual_cost", 0))
            estimated_savings = update_data.get("estimated_loss_prevented", existing_defense.get("estimated_loss_prevented", 0))
            effectiveness = update_data.get("effectiveness", existing_defense.get("effectiveness", 0)) / 100
            
            if annual_cost > 0:
                update_data["roi"] = round(((estimated_savings * effectiveness - annual_cost) / annual_cost) * 100, 2)
        
        # Update in database
        result = await db.defenses.update_one(
            {"_id": ObjectId(defense_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Defense not found")
        
        # Fetch updated defense
        updated_defense = await db.defenses.find_one({"_id": ObjectId(defense_id)})
        
        return {
            "success": True,
            "data": serialize_defense(updated_defense),
            "message": "Defense system updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating defense: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating defense: {str(e)}")

@router.delete("/{defense_id}")
async def delete_defense(defense_id: str, db=Depends(get_database)):
    """Delete a defense system"""
    try:
        if not ObjectId.is_valid(defense_id):
            raise HTTPException(status_code=400, detail="Invalid defense ID format")
        
        result = await db.defenses.delete_one({"_id": ObjectId(defense_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Defense not found")
        
        return {
            "success": True,
            "message": "Defense system deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting defense: {str(e)}")

@router.get("/stats/summary")
async def get_defense_stats(db=Depends(get_database)):
    """Get aggregated statistics for all defense systems"""
    try:
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_cost": {"$sum": "$annual_cost"},
                    "total_savings": {"$sum": "$estimated_loss_prevented"},
                    "total_incidents_prevented": {"$sum": "$incidents_prevented"},
                    "average_roi": {"$avg": "$roi"},
                    "average_effectiveness": {"$avg": "$effectiveness"},
                    "total_threats_blocked": {"$sum": "$threats_blocked"},
                    "defense_count": {"$sum": 1},
                    "total_risk_reduction": {"$sum": "$risk_reduction"}
                }
            }
        ]
        
        result = await db.defenses.aggregate(pipeline).to_list(1)
        
        if result:
            stats = result[0]
            # Calculate average risk reduction
            if stats["defense_count"] > 0:
                stats["average_risk_reduction"] = stats["total_risk_reduction"] / stats["defense_count"]
            else:
                stats["average_risk_reduction"] = 0
            
            # Round averages
            stats["average_roi"] = round(stats.get("average_roi", 0), 2)
            stats["average_effectiveness"] = round(stats.get("average_effectiveness", 0), 2)
            stats["average_risk_reduction"] = round(stats.get("average_risk_reduction", 0), 2)
            
            return {
                "success": True,
                "data": stats
            }
        else:
            return {
                "success": True,
                "data": {
                    "total_cost": 0,
                    "total_savings": 0,
                    "total_incidents_prevented": 0,
                    "average_roi": 0,
                    "average_effectiveness": 0,
                    "total_threats_blocked": 0,
                    "defense_count": 0,
                    "average_risk_reduction": 0
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

@router.get("/filter/statuses")
async def get_defense_statuses(db=Depends(get_database)):
    """Get all unique defense statuses"""
    try:
        statuses = await db.defenses.distinct("status")
        return {
            "success": True,
            "data": statuses
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statuses: {str(e)}")