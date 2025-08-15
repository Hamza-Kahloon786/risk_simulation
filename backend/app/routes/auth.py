# backend/app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from bson import ObjectId
from app.models.user import User, UserCreate, UserLogin, UserResponse, Token, UserUpdate
from app.services.auth import AuthService
from app.services.database import get_database
import json

router = APIRouter()
security = HTTPBearer()

def serialize_user(user_doc) -> dict:
    """Convert MongoDB user document to API response format"""
    if user_doc:
        # Convert ObjectId to string
        user_doc["id"] = str(user_doc["_id"])
        del user_doc["_id"]
        
        # Remove password hash from response
        user_doc.pop("password_hash", None)
        
        # Convert datetime objects to ISO strings
        if user_doc.get("created_at"):
            user_doc["created_at"] = user_doc["created_at"].isoformat()
        if user_doc.get("updated_at"):
            user_doc["updated_at"] = user_doc["updated_at"].isoformat()
        if user_doc.get("last_login"):
            user_doc["last_login"] = user_doc["last_login"].isoformat()
            
        return user_doc
    return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_database)):
    """Get current user from JWT token"""
    token_data = AuthService.verify_token(credentials.credentials)
    user = await db.users.find_one({"email": token_data.email})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )
    
    return serialize_user(user)

@router.post("/register")
async def register_user(user_data: UserCreate, db=Depends(get_database)):
    """Register a new user"""
    try:
        print(f"Registration attempt for email: {user_data.email}")
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Validate password strength
        if not AuthService.validate_password(user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters with letters and numbers"
            )
        
        # Create user document
        user_dict = {
            "email": user_data.email,
            "full_name": user_data.full_name,
            "company": user_data.company,
            "password_hash": AuthService.get_password_hash(user_data.password),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "role": "user",
            "is_active": True,
            "is_verified": False,
            "last_login": None
        }
        
        print(f"Creating user document for: {user_data.email}")
        
        # Insert user into database
        result = await db.users.insert_one(user_dict)
        
        # Fetch created user
        created_user = await db.users.find_one({"_id": result.inserted_id})
        user_response = serialize_user(created_user)
        
        print(f"User created successfully: {user_data.email}")
        
        # Create access token
        access_token_expires = timedelta(hours=24)
        access_token = AuthService.create_access_token(
            data={"sub": user_data.email}, expires_delta=access_token_expires
        )
        
        return {
            "success": True,
            "message": "User registered successfully",
            "data": {
                "access_token": access_token,
                "token_type": "bearer",
                "expires_in": 86400,  # 24 hours in seconds
                "user": user_response
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login_user(user_credentials: UserLogin, db=Depends(get_database)):
    """Authenticate user and return access token"""
    try:
        print(f"Login attempt for email: {user_credentials.email}")
        
        # Find user by email
        user = await db.users.find_one({"email": user_credentials.email})
        if not user:
            print(f"User not found: {user_credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not AuthService.verify_password(user_credentials.password, user["password_hash"]):
            print(f"Invalid password for user: {user_credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        print(f"Login successful for user: {user_credentials.email}")
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        access_token_expires = timedelta(hours=24)
        access_token = AuthService.create_access_token(
            data={"sub": user_credentials.email}, expires_delta=access_token_expires
        )
        
        # Prepare user response
        user_response = serialize_user(user)
        user_response["last_login"] = datetime.utcnow().isoformat()
        
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "access_token": access_token,
                "token_type": "bearer",
                "expires_in": 86400,  # 24 hours in seconds
                "user": user_response
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "success": True,
        "data": current_user
    }

@router.put("/profile")
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Update user profile"""
    try:
        # Prepare update data
        update_data = {k: v for k, v in user_update.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        update_data["updated_at"] = datetime.utcnow()
        
        # Update user in database
        result = await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Fetch updated user
        updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        user_response = serialize_user(updated_user)
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": user_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile update failed: {str(e)}"
        )

@router.post("/logout")
async def logout_user(current_user: dict = Depends(get_current_user)):
    """Logout user (client should remove token)"""
    return {
        "success": True,
        "message": "Logged out successfully"
    }

@router.post("/test-register")
async def test_register():
    """Test endpoint to create a demo user"""
    try:
        demo_user = {
            "email": "demo@example.com",
            "password": "Demo123!",
            "full_name": "Demo User",
            "company": "Demo Company"
        }
        
        user_create = UserCreate(**demo_user)
        # This would call the register endpoint
        return {
            "success": True,
            "message": "Demo user data prepared",
            "data": {
                "email": demo_user["email"],
                "password": demo_user["password"]
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }