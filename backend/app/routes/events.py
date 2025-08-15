# backend/app/routes/events.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.services.database import get_database

router = APIRouter()

def serialize_event(event_doc):
    """Convert MongoDB document to API response format"""
    if event_doc:
        event_doc["id"] = str(event_doc["_id"])
        del event_doc["_id"]
        
        # Convert datetime objects to ISO strings if they exist
        for field in ["created_at", "updated_at", "date"]:
            if event_doc.get(field) and isinstance(event_doc[field], datetime):
                event_doc[field] = event_doc[field].isoformat()
        
        return event_doc
    return None

@router.get("/")
async def get_all_events(db=Depends(get_database)):
    """Get all events"""
    try:
        cursor = db.events.find()
        events = await cursor.to_list(100)
        
        serialized_events = []
        for event in events:
            serialized_events.append(serialize_event(event))
        
        return {
            "success": True,
            "data": serialized_events,
            "count": len(serialized_events)
        }
    except Exception as e:
        print(f"Error fetching events: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching events: {str(e)}")

@router.get("/{event_id}/")
async def get_event(event_id: str, db=Depends(get_database)):
    """Get a single event by ID"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID format")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return {
            "success": True,
            "data": serialize_event(event)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching event: {str(e)}")

@router.post("/")
async def create_event(event_data: dict, db=Depends(get_database)):
    """Create a new event"""
    try:
        # Add timestamps
        event_data["created_at"] = datetime.utcnow()
        event_data["updated_at"] = datetime.utcnow()
        
        # Convert date string to datetime if provided
        if "date" in event_data and isinstance(event_data["date"], str):
            try:
                event_data["date"] = datetime.fromisoformat(event_data["date"].replace('Z', '+00:00'))
            except:
                pass  # Keep as string if conversion fails
        
        # Set default values
        event_data.setdefault("status", "resolved")
        event_data.setdefault("severity", "medium")
        event_data.setdefault("type", "operational_risk")
        
        # Insert into database
        result = await db.events.insert_one(event_data)
        
        # Fetch the created event
        created_event = await db.events.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "data": serialize_event(created_event),
            "message": "Event created successfully"
        }
    except Exception as e:
        print(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating event: {str(e)}")

@router.put("/{event_id}/")
async def update_event(event_id: str, event_data: dict, db=Depends(get_database)):
    """Update an existing event"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID format")
        
        # Add update timestamp
        event_data["updated_at"] = datetime.utcnow()
        
        # Convert date string to datetime if provided
        if "date" in event_data and isinstance(event_data["date"], str):
            try:
                event_data["date"] = datetime.fromisoformat(event_data["date"].replace('Z', '+00:00'))
            except:
                pass  # Keep as string if conversion fails
        
        # Update in database
        result = await db.events.update_one(
            {"_id": ObjectId(event_id)}, 
            {"$set": event_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Fetch updated event
        updated_event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        return {
            "success": True,
            "data": serialize_event(updated_event),
            "message": "Event updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating event: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating event: {str(e)}")

@router.delete("/{event_id}/")
async def delete_event(event_id: str, db=Depends(get_database)):
    """Delete an event"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID format")
        
        result = await db.events.delete_one({"_id": ObjectId(event_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return {
            "success": True,
            "message": "Event deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting event: {str(e)}")

@router.post("/sample-data/")
async def create_sample_events(db=Depends(get_database)):
    """Create sample event data for testing"""
    try:
        sample_events = [
            {
                "name": "Ransomware Attack - NYC Office",
                "type": "cyber_attack",
                "severity": "critical",
                "date": datetime(2024, 2, 15),
                "duration": "48 hours",
                "location": "New York Headquarters",
                "description": "Advanced ransomware infiltrated through phishing email, encrypted critical databases",
                "revenue_impact": -850000,
                "downtime": 48,
                "affected_systems": ["CRM", "Financial Database", "Email Server"],
                "recovery_time": "24 hours",
                "status": "resolved",
                "prevention_cost": 80000,
                "actual_loss": 450000,
                "employees_affected": 45,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Power Grid Failure",
                "type": "operational_risk",
                "severity": "medium",
                "date": datetime(2024, 1, 20),
                "duration": "6 hours",
                "location": "London Office",
                "description": "Regional power outage affected office operations, backup generators failed after 2 hours",
                "revenue_impact": -125000,
                "downtime": 6,
                "affected_systems": ["All Office Systems", "VoIP"],
                "recovery_time": "6 hours",
                "status": "resolved",
                "prevention_cost": 15000,
                "actual_loss": 125000,
                "employees_affected": 120,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "name": "Data Breach Investigation",
                "type": "cyber_attack",
                "severity": "high",
                "date": datetime(2024, 3, 10),
                "duration": "72 hours",
                "location": "Data Center A",
                "description": "Unauthorized access detected in customer database, investigation ongoing",
                "revenue_impact": -320000,
                "downtime": 12,
                "affected_systems": ["Customer Database", "API Gateway"],
                "recovery_time": "48 hours",
                "status": "investigating",
                "prevention_cost": 45000,
                "actual_loss": 280000,
                "employees_affected": 25,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Clear existing sample data
        await db.events.delete_many({"name": {"$in": [s["name"] for s in sample_events]}})
        
        # Insert sample data
        result = await db.events.insert_many(sample_events)
        
        return {
            "success": True,
            "message": f"Created {len(result.inserted_ids)} sample events",
            "inserted_ids": [str(id) for id in result.inserted_ids]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating sample data: {str(e)}")

@router.get("/stats/summary/")
async def get_event_stats(db=Depends(get_database)):
    """Get event statistics"""
    try:
        total_events = await db.events.count_documents({})
        critical_events = await db.events.count_documents({"severity": "critical"})
        high_events = await db.events.count_documents({"severity": "high"})
        resolved_events = await db.events.count_documents({"status": "resolved"})
        
        # Calculate total impact
        pipeline = [
            {"$group": {
                "_id": None,
                "total_revenue_impact": {"$sum": "$revenue_impact"},
                "total_downtime": {"$sum": "$downtime"},
                "total_employees_affected": {"$sum": "$employees_affected"},
                "total_actual_loss": {"$sum": "$actual_loss"}
            }}
        ]
        
        impact_stats = await db.events.aggregate(pipeline).to_list(1)
        impact_data = impact_stats[0] if impact_stats else {}
        
        return {
            "success": True,
            "data": {
                "total_events": total_events,
                "critical_events": critical_events,
                "high_events": high_events,
                "resolved_events": resolved_events,
                "total_revenue_impact": abs(impact_data.get("total_revenue_impact", 0)),
                "total_downtime": impact_data.get("total_downtime", 0),
                "total_employees_affected": impact_data.get("total_employees_affected", 0),
                "total_actual_loss": impact_data.get("total_actual_loss", 0)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching event stats: {str(e)}")

@router.get("/filter/by-severity/{severity}/")
async def get_events_by_severity(severity: str, db=Depends(get_database)):
    """Get events filtered by severity"""
    try:
        cursor = db.events.find({"severity": severity})
        events = await cursor.to_list(100)
        
        serialized_events = []
        for event in events:
            serialized_events.append(serialize_event(event))
        
        return {
            "success": True,
            "data": serialized_events,
            "count": len(serialized_events)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching events by severity: {str(e)}")

@router.get("/filter/by-type/{event_type}/")
async def get_events_by_type(event_type: str, db=Depends(get_database)):
    """Get events filtered by type"""
    try:
        cursor = db.events.find({"type": event_type})
        events = await cursor.to_list(100)
        
        serialized_events = []
        for event in events:
            serialized_events.append(serialize_event(event))
        
        return {
            "success": True,
            "data": serialized_events,
            "count": len(serialized_events)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching events by type: {str(e)}")