# backend/app/models/defense.py
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

class Defense(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, max_length=100)
    category: str  # network_security, human_security, data_protection, etc.
    status: str = Field(default="active")  # active, inactive, maintenance
    effectiveness: int = Field(..., ge=0, le=100)
    deployment_date: datetime
    last_update: datetime
    annual_cost: float = Field(..., ge=0)
    implementation_cost: float = Field(..., ge=0)
    maintenance_cost: float = Field(default=0, ge=0)
    threats_blocked: int = Field(default=0, ge=0)
    incidents_prevented: int = Field(default=0, ge=0)
    estimated_loss_prevented: float = Field(default=0, ge=0)
    roi: float = Field(default=0)
    location: str
    vendor: str
    coverage: List[str] = Field(default=[])
    uptime: float = Field(default=100, ge=0, le=100)
    last_incident: Optional[datetime] = None
    risk_reduction: int = Field(default=0, ge=0, le=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DefenseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str
    status: str = Field(default="active")
    effectiveness: int = Field(..., ge=0, le=100)
    deployment_date: datetime
    last_update: datetime
    annual_cost: float = Field(..., ge=0)
    implementation_cost: float = Field(..., ge=0)
    maintenance_cost: float = Field(default=0, ge=0)
    threats_blocked: int = Field(default=0, ge=0)
    incidents_prevented: int = Field(default=0, ge=0)
    estimated_loss_prevented: float = Field(default=0, ge=0)
    roi: float = Field(default=0)
    location: str
    vendor: str
    coverage: List[str] = Field(default=[])
    uptime: float = Field(default=100, ge=0, le=100)
    last_incident: Optional[datetime] = None
    risk_reduction: int = Field(default=0, ge=0, le=100)

class DefenseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = None
    status: Optional[str] = None
    effectiveness: Optional[int] = Field(None, ge=0, le=100)
    deployment_date: Optional[datetime] = None
    last_update: Optional[datetime] = None
    annual_cost: Optional[float] = Field(None, ge=0)
    implementation_cost: Optional[float] = Field(None, ge=0)
    maintenance_cost: Optional[float] = Field(None, ge=0)
    threats_blocked: Optional[int] = Field(None, ge=0)
    incidents_prevented: Optional[int] = Field(None, ge=0)
    estimated_loss_prevented: Optional[float] = Field(None, ge=0)
    roi: Optional[float] = None
    location: Optional[str] = None
    vendor: Optional[str] = None
    coverage: Optional[List[str]] = None
    uptime: Optional[float] = Field(None, ge=0, le=100)
    last_incident: Optional[datetime] = None
    risk_reduction: Optional[int] = Field(None, ge=0, le=100)