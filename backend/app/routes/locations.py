# # app/routes/locations.py
# from fastapi import APIRouter, HTTPException, Depends
# from typing import List
# from bson import ObjectId
# from datetime import datetime
# from app.models.location import Location, LocationCreate, LocationUpdate
# from app.services.database import get_database

# router = APIRouter()

# @router.get("/", response_model=List[Location])
# async def get_locations(db=Depends(get_database)):
#     try:
#         locations = await db.locations.find().to_list(100)
        
#         # If no locations in database, return sample data
#         if not locations:
#             sample_locations = [
#                 {
#                     "_id": ObjectId(),
#                     "name": "New York Headquarters",
#                     "address": "123 Wall Street, NYC",
#                     "type": "headquarters",
#                     "employees": 250,
#                     "annual_revenue": 15000000,
#                     "monthly_profit": 850000,
#                     "monthly_loss": 125000,
#                     "recent_attacks": 3,
#                     "risk_score": 65,
#                     "last_incident": "2024-01-15",
#                     "defense_spending": 180000,
#                     "status": "active",
#                     "created_at": datetime.utcnow(),
#                     "updated_at": datetime.utcnow()
#                 },
#                 {
#                     "_id": ObjectId(),
#                     "name": "Chicago Data Center",
#                     "address": "456 Tech Blvd, Chicago",
#                     "type": "datacenter",
#                     "employees": 45,
#                     "annual_revenue": 8500000,
#                     "monthly_profit": 620000,
#                     "monthly_loss": 85000,
#                     "recent_attacks": 1,
#                     "risk_score": 35,
#                     "last_incident": "2024-02-20",
#                     "defense_spending": 320000,
#                     "status": "active",
#                     "created_at": datetime.utcnow(),
#                     "updated_at": datetime.utcnow()
#                 },
#                 {
#                     "_id": ObjectId(),
#                     "name": "London Office",
#                     "address": "789 Financial District, London",
#                     "type": "office",
#                     "employees": 120,
#                     "annual_revenue": 12000000,
#                     "monthly_profit": 750000,
#                     "monthly_loss": 95000,
#                     "recent_attacks": 2,
#                     "risk_score": 45,
#                     "last_incident": "2024-01-28",
#                     "defense_spending": 150000,
#                     "status": "active",
#                     "created_at": datetime.utcnow(),
#                     "updated_at": datetime.utcnow()
#                 },
#                 {
#                     "_id": ObjectId(),
#                     "name": "Manufacturing Plant",
#                     "address": "321 Industrial Ave, Detroit",
#                     "type": "manufacturing",
#                     "employees": 180,
#                     "annual_revenue": 18000000,
#                     "monthly_profit": 980000,
#                     "monthly_loss": 165000,
#                     "recent_attacks": 5,
#                     "risk_score": 78,
#                     "last_incident": "2024-02-10",
#                     "defense_spending": 220000,
#                     "status": "at-risk",
#                     "created_at": datetime.utcnow(),
#                     "updated_at": datetime.utcnow()
#                 }
#             ]
            
#             # Insert sample data into database
#             await db.locations.insert_many(sample_locations)
#             locations = sample_locations
            
#         return locations
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error loading locations: {str(e)}")

# @router.get("/{location_id}", response_model=Location)
# async def get_location(location_id: str, db=Depends(get_database)):
#     if not ObjectId.is_valid(location_id):
#         raise HTTPException(status_code=400, detail="Invalid location ID")
    
#     location = await db.locations.find_one({"_id": ObjectId(location_id)})
#     if not location:
#         raise HTTPException(status_code=404, detail="Location not found")
    
#     return location

# @router.post("/", response_model=Location)
# async def create_location(location: LocationCreate, db=Depends(get_database)):
#     try:
#         location_dict = location.dict()
#         location_dict["created_at"] = datetime.utcnow()
#         location_dict["updated_at"] = datetime.utcnow()
        
#         # Auto-calculate risk score based on attacks and defense spending
#         risk_score = min(100, max(0, 
#             (location_dict["recent_attacks"] * 15) - 
#             (location_dict["defense_spending"] / 10000)
#         ))
#         location_dict["risk_score"] = int(risk_score)
        
#         result = await db.locations.insert_one(location_dict)
#         created_location = await db.locations.find_one({"_id": result.inserted_id})
        
#         return created_location
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating location: {str(e)}")

# @router.put("/{location_id}", response_model=Location)
# async def update_location(location_id: str, location: LocationUpdate, db=Depends(get_database)):
#     if not ObjectId.is_valid(location_id):
#         raise HTTPException(status_code=400, detail="Invalid location ID")
    
#     try:
#         update_data = {k: v for k, v in location.dict().items() if v is not None}
        
#         if update_data:
#             update_data["updated_at"] = datetime.utcnow()
            
#             # Recalculate risk score if relevant fields are updated
#             if any(field in update_data for field in ["recent_attacks", "defense_spending"]):
#                 current_location = await db.locations.find_one({"_id": ObjectId(location_id)})
#                 if current_location:
#                     attacks = update_data.get("recent_attacks", current_location.get("recent_attacks", 0))
#                     defense = update_data.get("defense_spending", current_location.get("defense_spending", 0))
#                     risk_score = min(100, max(0, (attacks * 15) - (defense / 10000)))
#                     update_data["risk_score"] = int(risk_score)
            
#             result = await db.locations.update_one(
#                 {"_id": ObjectId(location_id)}, 
#                 {"$set": update_data}
#             )
            
#             if result.matched_count == 0:
#                 raise HTTPException(status_code=404, detail="Location not found")
        
#         updated_location = await db.locations.find_one({"_id": ObjectId(location_id)})
#         return updated_location
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating location: {str(e)}")

# @router.delete("/{location_id}")
# async def delete_location(location_id: str, db=Depends(get_database)):
#     if not ObjectId.is_valid(location_id):
#         raise HTTPException(status_code=400, detail="Invalid location ID")
    
#     try:
#         result = await db.locations.delete_one({"_id": ObjectId(location_id)})
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Location not found")
        
#         return {"message": "Location deleted successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error deleting location: {str(e)}")

# @router.get("/stats/summary")
# async def get_location_stats(db=Depends(get_database)):
#     """Get aggregated statistics for all locations"""
#     try:
#         pipeline = [
#             {
#                 "$group": {
#                     "_id": None,
#                     "total_revenue": {"$sum": "$annual_revenue"},
#                     "total_profit": {"$sum": "$monthly_profit"},
#                     "total_loss": {"$sum": "$monthly_loss"},
#                     "total_employees": {"$sum": "$employees"},
#                     "total_attacks": {"$sum": "$recent_attacks"},
#                     "total_defense_spending": {"$sum": "$defense_spending"},
#                     "average_risk_score": {"$avg": "$risk_score"},
#                     "location_count": {"$sum": 1}
#                 }
#             }
#         ]
        
#         result = await db.locations.aggregate(pipeline).to_list(1)
#         if result:
#             return result[0]
#         else:
#             return {
#                 "total_revenue": 0,
#                 "total_profit": 0,
#                 "total_loss": 0,
#                 "total_employees": 0,
#                 "total_attacks": 0,
#                 "total_defense_spending": 0,
#                 "average_risk_score": 0,
#                 "location_count": 0
#             }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

# @router.post("/{location_id}/update-financials")
# async def update_location_financials(
#     location_id: str, 
#     annual_revenue: float,
#     monthly_profit: float,
#     monthly_loss: float,
#     defense_spending: float,
#     db=Depends(get_database)
# ):
#     """Update financial data for a location and recalculate metrics"""
#     if not ObjectId.is_valid(location_id):
#         raise HTTPException(status_code=400, detail="Invalid location ID")
    
#     try:
#         # Get current location
#         location = await db.locations.find_one({"_id": ObjectId(location_id)})
#         if not location:
#             raise HTTPException(status_code=404, detail="Location not found")
        
#         # Calculate new risk score
#         attacks = location.get("recent_attacks", 0)
#         risk_score = min(100, max(0, (attacks * 15) - (defense_spending / 10000)))
        
#         # Update the location
#         update_data = {
#             "annual_revenue": annual_revenue,
#             "monthly_profit": monthly_profit,
#             "monthly_loss": monthly_loss,
#             "defense_spending": defense_spending,
#             "risk_score": int(risk_score),
#             "updated_at": datetime.utcnow()
#         }
        
#         await db.locations.update_one(
#             {"_id": ObjectId(location_id)},
#             {"$set": update_data}
#         )
        
#         updated_location = await db.locations.find_one({"_id": ObjectId(location_id)})
#         return updated_location
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error updating financials: {str(e)}")














# backend/app/routes/locations.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.services.database import get_database

router = APIRouter()

def serialize_location(location_doc):
    """Convert MongoDB document to API response format"""
    if location_doc:
        location_doc["id"] = str(location_doc["_id"])
        del location_doc["_id"]
        
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at", "last_incident"]:
            if location_doc.get(field) and isinstance(location_doc[field], datetime):
                location_doc[field] = location_doc[field].isoformat()
        
        return location_doc
    return None

@router.get("/")
async def get_all_locations(db=Depends(get_database)):
    """Get all locations"""
    try:
        cursor = db.locations.find()
        locations = await cursor.to_list(100)
        
        serialized_locations = []
        for location in locations:
            serialized_locations.append(serialize_location(location))
        
        return serialized_locations  # Return array directly for frontend compatibility
    except Exception as e:
        print(f"Error fetching locations: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching locations: {str(e)}")

@router.get("/{location_id}/")
async def get_location(location_id: str, db=Depends(get_database)):
    """Get a single location by ID"""
    try:
        if not ObjectId.is_valid(location_id):
            raise HTTPException(status_code=400, detail="Invalid location ID format")
        
        location = await db.locations.find_one({"_id": ObjectId(location_id)})
        if not location:
            raise HTTPException(status_code=404, detail="Location not found")
        
        return {
            "success": True,
            "data": serialize_location(location)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching location: {str(e)}")

@router.post("/")
async def create_location(location_data: dict, db=Depends(get_database)):
    """Create a new location"""
    try:
        # Add timestamps
        location_data["created_at"] = datetime.utcnow()
        location_data["updated_at"] = datetime.utcnow()
        
        # Set default values
        location_data.setdefault("status", "active")
        location_data.setdefault("type", "office")
        location_data.setdefault("employees", 0)
        location_data.setdefault("risk_score", 0)
        location_data.setdefault("recent_attacks", 0)
        
        # Insert into database
        result = await db.locations.insert_one(location_data)
        
        # Fetch the created location
        created_location = await db.locations.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_location(created_location),
            "message": "Location created successfully"
        }
    except Exception as e:
        print(f"Error creating location: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating location: {str(e)}")

@router.put("/{location_id}/")
async def update_location(location_id: str, location_data: dict, db=Depends(get_database)):
    """Update an existing location"""
    try:
        if not ObjectId.is_valid(location_id):
            raise HTTPException(status_code=400, detail="Invalid location ID format")
        
        # Add update timestamp
        location_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        result = await db.locations.update_one(
            {"_id": ObjectId(location_id)}, 
            {"$set": location_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Location not found")
        
        # Fetch updated location
        updated_location = await db.locations.find_one({"_id": ObjectId(location_id)})
        
        return {
            "success": True,
            "data": serialize_location(updated_location),
            "message": "Location updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating location: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating location: {str(e)}")

@router.delete("/{location_id}/")
async def delete_location(location_id: str, db=Depends(get_database)):
    """Delete a location"""
    try:
        if not ObjectId.is_valid(location_id):
            raise HTTPException(status_code=400, detail="Invalid location ID format")
        
        result = await db.locations.delete_one({"_id": ObjectId(location_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Location not found")
        
        return {
            "success": True,
            "message": "Location deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting location: {str(e)}")

@router.post("/sample-data/")
async def create_sample_locations(db=Depends(get_database)):
    """Create sample location data for testing"""
    try:
        sample_locations = [
            {
                "name": "New York Headquarters",
                "address": "123 Business Ave, New York, NY 10001",
                "type": "headquarters",
                "employees": 450,
                "annual_revenue": 15000000,
                "monthly_profit": 850000,
                "monthly_loss": 125000,
                "risk_score": 35,
                "defense_spending": 180000,
                "recent_attacks": 2,
                "status": "active",
                "last_incident": datetime(2024, 2, 15),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "London Office",
                "address": "456 Tech Street, London, UK EC1A 1AA",
                "type": "office",
                "employees": 120,
                "annual_revenue": 5500000,
                "monthly_profit": 320000,
                "monthly_loss": 45000,
                "risk_score": 28,
                "defense_spending": 85000,
                "recent_attacks": 1,
                "status": "active",
                "last_incident": datetime(2024, 1, 20),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Data Center A",
                "address": "789 Server Lane, Virginia, VA 22030",
                "type": "datacenter",
                "employees": 25,
                "annual_revenue": 2800000,
                "monthly_profit": 180000,
                "monthly_loss": 25000,
                "risk_score": 45,
                "defense_spending": 220000,
                "recent_attacks": 3,
                "status": "active",
                "last_incident": datetime(2024, 3, 10),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Manufacturing Plant",
                "address": "321 Industrial Way, Detroit, MI 48201",
                "type": "manufacturing",
                "employees": 280,
                "annual_revenue": 8200000,
                "monthly_profit": 520000,
                "monthly_loss": 80000,
                "risk_score": 32,
                "defense_spending": 95000,
                "recent_attacks": 0,
                "status": "active",
                "last_incident": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Clear existing sample data
        await db.locations.delete_many({"name": {"$in": [s["name"] for s in sample_locations]}})
        
        # Insert sample data
        result = await db.locations.insert_many(sample_locations)
        
        return {
            "success": True,
            "message": f"Created {len(result.inserted_ids)} sample locations",
            "inserted_ids": [str(id) for id in result.inserted_ids]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating sample data: {str(e)}")

@router.get("/stats/summary/")
async def get_location_stats(db=Depends(get_database)):
    """Get location statistics"""
    try:
        total_locations = await db.locations.count_documents({})
        active_locations = await db.locations.count_documents({"status": "active"})
        
        # Calculate totals
        pipeline = [
            {"$group": {
                "_id": None,
                "total_employees": {"$sum": "$employees"},
                "total_annual_revenue": {"$sum": "$annual_revenue"},
                "total_monthly_profit": {"$sum": "$monthly_profit"},
                "total_monthly_loss": {"$sum": "$monthly_loss"},
                "total_defense_spending": {"$sum": "$defense_spending"},
                "total_attacks": {"$sum": "$recent_attacks"},
                "avg_risk_score": {"$avg": "$risk_score"}
            }}
        ]
        
        stats_result = await db.locations.aggregate(pipeline).to_list(1)
        stats_data = stats_result[0] if stats_result else {}
        
        return {
            "success": True,
            "data": {
                "total_locations": total_locations,
                "active_locations": active_locations,
                "total_employees": stats_data.get("total_employees", 0),
                "total_annual_revenue": stats_data.get("total_annual_revenue", 0),
                "total_monthly_profit": stats_data.get("total_monthly_profit", 0),
                "total_monthly_loss": stats_data.get("total_monthly_loss", 0),
                "total_defense_spending": stats_data.get("total_defense_spending", 0),
                "total_recent_attacks": stats_data.get("total_attacks", 0),
                "average_risk_score": round(stats_data.get("avg_risk_score", 0), 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching location stats: {str(e)}")

@router.get("/filter/by-type/{location_type}/")
async def get_locations_by_type(location_type: str, db=Depends(get_database)):
    """Get locations filtered by type"""
    try:
        cursor = db.locations.find({"type": location_type})
        locations = await cursor.to_list(100)
        
        serialized_locations = []
        for location in locations:
            serialized_locations.append(serialize_location(location))
        
        return {
            "success": True,
            "data": serialized_locations,
            "count": len(serialized_locations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching locations by type: {str(e)}")

@router.get("/filter/high-risk/")
async def get_high_risk_locations(risk_threshold: int = 50, db=Depends(get_database)):
    """Get locations with risk score above threshold"""
    try:
        cursor = db.locations.find({"risk_score": {"$gte": risk_threshold}})
        locations = await cursor.to_list(100)
        
        serialized_locations = []
        for location in locations:
            serialized_locations.append(serialize_location(location))
        
        return {
            "success": True,
            "data": serialized_locations,
            "count": len(serialized_locations),
            "risk_threshold": risk_threshold
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching high-risk locations: {str(e)}")