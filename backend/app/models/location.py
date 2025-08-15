# app/models/location.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
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

class Location(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., max_length=200)
    type: str = Field(default="office")  # headquarters, datacenter, office, manufacturing
    employees: int = Field(..., ge=0)
    annual_revenue: float = Field(..., ge=0)
    monthly_profit: float = Field(..., ge=0)
    monthly_loss: float = Field(default=0, ge=0)
    recent_attacks: int = Field(default=0, ge=0)
    risk_score: int = Field(default=0, ge=0, le=100)
    last_incident: Optional[str] = None  # Date string
    defense_spending: float = Field(default=0, ge=0)
    status: str = Field(default="active")  # active, inactive, at-risk
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LocationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., max_length=200)
    type: str = Field(default="office")
    employees: int = Field(..., ge=0)
    annual_revenue: float = Field(..., ge=0)
    monthly_profit: float = Field(..., ge=0)
    monthly_loss: float = Field(default=0, ge=0)
    recent_attacks: int = Field(default=0, ge=0)
    risk_score: int = Field(default=0, ge=0, le=100)
    last_incident: Optional[str] = None
    defense_spending: float = Field(default=0, ge=0)
    status: str = Field(default="active")

class LocationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, max_length=200)
    type: Optional[str] = None
    employees: Optional[int] = Field(None, ge=0)
    annual_revenue: Optional[float] = Field(None, ge=0)
    monthly_profit: Optional[float] = Field(None, ge=0)
    monthly_loss: Optional[float] = Field(None, ge=0)
    recent_attacks: Optional[int] = Field(None, ge=0)
    risk_score: Optional[int] = Field(None, ge=0, le=100)
    last_incident: Optional[str] = None
    defense_spending: Optional[float] = Field(None, ge=0)
    status: Optional[str] = None