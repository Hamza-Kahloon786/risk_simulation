# backend/app/routes/business_assets.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.models.business_assets import BusinessAsset, BusinessAssetCreate, BusinessAssetUpdate
from app.services.database import get_database

router = APIRouter()

def serialize_business_asset(asset_doc):
    """Convert MongoDB document to API response format"""
    if asset_doc:
        asset_doc["id"] = str(asset_doc["_id"])
        del asset_doc["_id"]
        
        # Convert ObjectId fields to strings
        if "scenario_id" in asset_doc and isinstance(asset_doc["scenario_id"], ObjectId):
            asset_doc["scenario_id"] = str(asset_doc["scenario_id"])
            
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at"]:
            if asset_doc.get(field) and isinstance(asset_doc[field], datetime):
                asset_doc[field] = asset_doc[field].isoformat()
        
        return asset_doc
    return None

@router.get("/{scenario_id}/business-assets/")
async def get_business_assets(scenario_id: str, db=Depends(get_database)):
    """Get all business assets for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        cursor = db.business_assets.find({"scenario_id": ObjectId(scenario_id)})
        business_assets = await cursor.to_list(100)
        
        serialized_assets = []
        for asset in business_assets:
            serialized_assets.append(serialize_business_asset(asset))
        
        return {
            "success": True,
            "data": serialized_assets,
            "count": len(serialized_assets)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching business assets: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching business assets: {str(e)}")

@router.post("/{scenario_id}/business-assets/")
async def create_business_asset(scenario_id: str, business_asset: BusinessAssetCreate, db=Depends(get_database)):
    """Create a new business asset for a scenario"""
    try:
        if not ObjectId.is_valid(scenario_id):
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        # Verify scenario exists
        scenario = await db.scenarios.find_one({"_id": ObjectId(scenario_id)})
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        
        # Convert Pydantic model to dict and add metadata
        business_asset_dict = business_asset.model_dump()
        business_asset_dict["scenario_id"] = ObjectId(scenario_id)
        business_asset_dict["created_at"] = datetime.utcnow()
        business_asset_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await db.business_assets.insert_one(business_asset_dict)
        
        # Fetch the created business asset
        created_business_asset = await db.business_assets.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_business_asset(created_business_asset),
            "message": "Business asset created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating business asset: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating business asset: {str(e)}")

@router.put("/{scenario_id}/business-assets/{asset_id}/")
async def update_business_asset(scenario_id: str, asset_id: str, business_asset: BusinessAssetUpdate, db=Depends(get_database)):
    """Update an existing business asset"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(asset_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        # Prepare update data
        update_data = {k: v for k, v in business_asset.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.business_assets.update_one(
            {"_id": ObjectId(asset_id), "scenario_id": ObjectId(scenario_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Business asset not found")
        
        # Fetch updated business asset
        updated_business_asset = await db.business_assets.find_one({"_id": ObjectId(asset_id)})
        
        return {
            "success": True,
            "data": serialize_business_asset(updated_business_asset),
            "message": "Business asset updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating business asset: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating business asset: {str(e)}")

@router.delete("/{scenario_id}/business-assets/{asset_id}/")
async def delete_business_asset(scenario_id: str, asset_id: str, db=Depends(get_database)):
    """Delete a business asset"""
    try:
        if not ObjectId.is_valid(scenario_id) or not ObjectId.is_valid(asset_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        result = await db.business_assets.delete_one({
            "_id": ObjectId(asset_id), 
            "scenario_id": ObjectId(scenario_id)
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Business asset not found")
        
        return {
            "success": True,
            "message": "Business asset deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting business asset: {str(e)}")