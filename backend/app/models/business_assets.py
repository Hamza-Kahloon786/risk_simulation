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

class BusinessAsset(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    scenario_id: PyObjectId
    name: str = Field(..., min_length=1, max_length=100)
    type: str  # critical_system, business_location, data_asset, key_personnel
    description: Optional[str] = Field(None, max_length=500)
    value: float = Field(..., ge=0)  # Asset value in dollars
    criticality: str = Field(default="medium")  # low, medium, high, critical
    location: Optional[str] = Field(None, max_length=100)
    dependencies: List[str] = Field(default=[])  # List of dependent asset IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessAssetCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str
    description: Optional[str] = Field(None, max_length=500)
    value: float = Field(..., ge=0)
    criticality: str = Field(default="medium")
    location: Optional[str] = Field(None, max_length=100)
    dependencies: List[str] = Field(default=[])

class BusinessAssetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = None
    description: Optional[str] = Field(None, max_length=500)
    value: Optional[float] = Field(None, ge=0)
    criticality: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    dependencies: Optional[List[str]] = None