# backend/app/models/event.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema, handler):
        return {"type": "string", "format": "objectid"}

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _info=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class Event(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str, datetime: lambda v: v.isoformat()}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, max_length=200, description="Event name")
    type: str = Field(..., description="Event type: cyber_attack, supply_disruption, operational_risk, legal_action")
    severity: str = Field(default="medium", description="Severity level: low, medium, high, critical")
    date: datetime = Field(..., description="Date when the event occurred")
    duration: str = Field(..., description="Duration of the event (e.g., '2 hours', '1 day')")
    location: str = Field(..., description="Location where the event occurred")
    description: Optional[str] = Field(default="", max_length=1000, description="Detailed description of the event")
    revenue_impact: float = Field(..., description="Revenue impact (should be negative for losses)")
    downtime: int = Field(default=0, ge=0, description="Downtime in hours")
    affected_systems: List[str] = Field(default_factory=list, description="List of affected systems")
    recovery_time: str = Field(..., description="Time taken to recover from the event")
    status: str = Field(default="resolved", description="Current status: resolved, in_progress, investigating")
    prevention_cost: float = Field(default=0, ge=0, description="Cost spent on prevention measures")
    actual_loss: float = Field(default=0, ge=0, description="Actual financial loss incurred")
    employees_affected: int = Field(default=0, ge=0, description="Number of employees affected")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., pattern="^(cyber_attack|supply_disruption|operational_risk|legal_action)$")
    severity: str = Field(default="medium", pattern="^(low|medium|high|critical)$")
    date: datetime
    duration: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    description: Optional[str] = Field(default="", max_length=1000)
    revenue_impact: float = Field(...)
    downtime: int = Field(default=0, ge=0)
    affected_systems: List[str] = Field(default_factory=list)
    recovery_time: str = Field(..., min_length=1)
    status: str = Field(default="resolved", pattern="^(resolved|in_progress|investigating)$")
    prevention_cost: float = Field(default=0, ge=0)
    actual_loss: float = Field(default=0, ge=0)
    employees_affected: int = Field(default=0, ge=0)

class EventUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    type: Optional[str] = Field(None, pattern="^(cyber_attack|supply_disruption|operational_risk|legal_action)$")
    severity: Optional[str] = Field(None, pattern="^(low|medium|high|critical)$")
    date: Optional[datetime] = None
    duration: Optional[str] = Field(None, min_length=1)
    location: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, max_length=1000)
    revenue_impact: Optional[float] = None
    downtime: Optional[int] = Field(None, ge=0)
    affected_systems: Optional[List[str]] = None
    recovery_time: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = Field(None, pattern="^(resolved|in_progress|investigating)$")
    prevention_cost: Optional[float] = Field(None, ge=0)
    actual_loss: Optional[float] = Field(None, ge=0)
    employees_affected: Optional[int] = Field(None, ge=0)

class EventResponse(BaseModel):
    """Response model that matches frontend expectations"""
    id: str
    name: str
    type: str
    severity: str
    date: str  # ISO format string
    duration: str
    location: str
    description: str
    revenueImpact: float
    downtime: int
    affectedSystems: List[str]
    recoveryTime: str
    status: str
    preventionCost: float
    actualLoss: float
    employees_affected: int
    created_at: str
    updated_at: str