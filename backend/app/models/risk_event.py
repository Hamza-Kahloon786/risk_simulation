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

class RiskEvent(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    scenario_id: PyObjectId
    name: str = Field(..., min_length=1, max_length=100)
    type: str  # cyber_attack, supply_disruption, operational_risk, legal_action
    description: Optional[str] = Field(None, max_length=500)
    probability: float = Field(..., gt=0, le=100)  # Percentage
    impact_min: float = Field(..., ge=0)  # Minimum financial impact
    impact_max: float = Field(..., ge=0)  # Maximum financial impact
    frequency: float = Field(default=1.0, gt=0)  # Expected occurrences per year
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RiskEventCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str
    description: Optional[str] = Field(None, max_length=500)
    probability: float = Field(..., gt=0, le=100)
    impact_min: float = Field(..., ge=0)
    impact_max: float = Field(..., ge=0)
    frequency: float = Field(default=1.0, gt=0)

class RiskEventUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)
    probability: Optional[float] = Field(None, gt=0, le=100)
    impact_min: Optional[float] = Field(None, ge=0)
    impact_max: Optional[float] = Field(None, ge=0)
    frequency: Optional[float] = Field(None, gt=0)