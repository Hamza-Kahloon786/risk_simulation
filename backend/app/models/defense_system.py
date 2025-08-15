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

class DefenseSystem(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    scenario_id: PyObjectId
    name: str = Field(..., min_length=1, max_length=100)
    type: str  # security_control, business_continuity, insurance_coverage
    description: Optional[str] = Field(None, max_length=500)
    effectiveness: float = Field(..., gt=0, le=100)  # Effectiveness percentage
    cost: float = Field(..., ge=0)  # Implementation cost
    coverage_percentage: float = Field(default=100, gt=0, le=100)  # Coverage percentage
    maintenance_cost: float = Field(default=0, ge=0)  # Annual maintenance cost
    protected_assets: List[str] = Field(default=[])  # List of protected asset IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DefenseSystemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str
    description: Optional[str] = Field(None, max_length=500)
    effectiveness: float = Field(..., gt=0, le=100)
    cost: float = Field(..., ge=0)
    coverage_percentage: float = Field(default=100, gt=0, le=100)
    maintenance_cost: float = Field(default=0, ge=0)
    protected_assets: List[str] = Field(default=[])

class DefenseSystemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)
    effectiveness: Optional[float] = Field(None, gt=0, le=100)
    cost: Optional[float] = Field(None, ge=0)
    coverage_percentage: Optional[float] = Field(None, gt=0, le=100)
    maintenance_cost: Optional[float] = Field(None, ge=0)
    protected_assets: Optional[List[str]] = None