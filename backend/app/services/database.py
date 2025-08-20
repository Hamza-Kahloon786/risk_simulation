# import os
# from motor.motor_asyncio import AsyncIOMotorClient
# from dotenv import load_dotenv

# load_dotenv()

# class Database:
#     client: AsyncIOMotorClient = None
#     database = None

# db = Database()

# async def get_database():
#     return db.database

# async def init_db():
#     mongodb_url = os.getenv("MONGODB_URL")
#     if not mongodb_url:
#         raise ValueError("MONGODB_URL environment variable is not set")
    
#     db.client = AsyncIOMotorClient(mongodb_url)
#     db.database = db.client[os.getenv("DATABASE_NAME", "risk_simulation")]
    
#     # Test connection
#     try:
#         await db.client.admin.command('ping')
#         print("Successfully connected to MongoDB!")
#     except Exception as e:
#         print(f"Failed to connect to MongoDB: {e}")
#         raise
    
#     # Create indexes
#     await db.database.scenarios.create_index("name")
#     await db.database.risk_events.create_index("scenario_id")
#     await db.database.business_assets.create_index("scenario_id")
#     await db.database.defense_systems.create_index("scenario_id")

# async def close_db():
#     if db.client:
#         db.client.close()























# backend/app/services/database.py - FIXED DATABASE INITIALIZATION
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import CollectionInvalid, DuplicateKeyError
from pymongo import IndexModel

client = None
database = None

async def init_db():
    global client, database
    
    mongodb_url = "mongodb+srv://hamza:hamza@cluster0.n44j3.mongodb.net/"
    database_name = os.getenv("DATABASE_NAME", "risk_simulation")
    
    print(f"Connecting to MongoDB: {mongodb_url}")
    print(f"Database: {database_name}")
    
    client = AsyncIOMotorClient(mongodb_url)
    database = client[database_name]
    
    # Test connection
    try:
        await client.admin.command('ping')
        print("✓ Connected to MongoDB successfully")
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        raise
    
    # Create collections and indexes
    await create_collections()
    await create_indexes_safely()
    
    print("✓ Database initialization completed")

async def create_collections():
    """Create all required collections"""
    collections_to_create = [
        "users",
        "scenarios", 
        "risk_events",
        "business_assets",
        "defense_systems",
        "analysis_results"  # Collection for storing Monte Carlo results
    ]
    
    existing_collections = await database.list_collection_names()
    
    for collection_name in collections_to_create:
        if collection_name not in existing_collections:
            try:
                await database.create_collection(collection_name)
                print(f"✓ Created collection: {collection_name}")
            except CollectionInvalid:
                print(f"Collection {collection_name} already exists")

async def create_indexes_safely():
    """Create database indexes safely, handling existing data and duplicates"""
    
    # Clean up existing data first
    await cleanup_existing_data()
    
    # Users collection indexes - handle carefully
    try:
        # Check if email index exists
        existing_indexes = await database.users.list_indexes().to_list(None)
        email_index_exists = any(idx.get('key', {}).get('email') for idx in existing_indexes)
        username_index_exists = any(idx.get('key', {}).get('username') for idx in existing_indexes)
        
        if not email_index_exists:
            await database.users.create_index("email", unique=True, sparse=True)
            print("✓ Created email index")
        else:
            print("✓ Email index already exists")
            
        if not username_index_exists:
            await database.users.create_index("username", unique=True, sparse=True)
            print("✓ Created username index")
        else:
            print("✓ Username index already exists")
            
    except DuplicateKeyError as e:
        print(f"⚠ Skipping user indexes due to duplicate data: {e}")
        # Continue with other indexes
    except Exception as e:
        print(f"⚠ Error creating user indexes: {e}")
    
    # Scenarios collection indexes
    try:
        await database.scenarios.create_index("user_id")
        await database.scenarios.create_index("created_at")
        await database.scenarios.create_index("status")
        print("✓ Created scenario indexes")
    except Exception as e:
        print(f"⚠ Scenario indexes may already exist: {e}")
    
    # Risk events collection indexes
    try:
        await database.risk_events.create_index("scenario_id")
        await database.risk_events.create_index([("scenario_id", 1), ("created_at", -1)])
        print("✓ Created risk events indexes")
    except Exception as e:
        print(f"⚠ Risk events indexes may already exist: {e}")
    
    # Business assets collection indexes
    try:
        await database.business_assets.create_index("scenario_id")
        await database.business_assets.create_index([("scenario_id", 1), ("value", -1)])
        print("✓ Created business assets indexes")
    except Exception as e:
        print(f"⚠ Business assets indexes may already exist: {e}")
    
    # Defense systems collection indexes
    try:
        await database.defense_systems.create_index("scenario_id")
        await database.defense_systems.create_index([("scenario_id", 1), ("effectiveness", -1)])
        print("✓ Created defense systems indexes")
    except Exception as e:
        print(f"⚠ Defense systems indexes may already exist: {e}")
    
    # Analysis results collection indexes
    try:
        await database.analysis_results.create_index("scenario_id")
        await database.analysis_results.create_index([("scenario_id", 1), ("stored_at", -1)])
        await database.analysis_results.create_index([("scenario_id", 1), ("analysis_type", 1)])
        await database.analysis_results.create_index("generated_at")
        await database.analysis_results.create_index("risk_score")
        await database.analysis_results.create_index("expected_annual_loss")
        print("✓ Created analysis results indexes")
    except Exception as e:
        print(f"⚠ Analysis results indexes may already exist: {e}")
    
    print("✓ Database indexes created/verified successfully")

async def cleanup_existing_data():
    """Clean up problematic existing data before creating indexes"""
    try:
        # Remove users with null usernames or emails to allow unique indexes
        result = await database.users.delete_many({
            "$or": [
                {"username": None},
                {"email": None},
                {"username": ""},
                {"email": ""}
            ]
        })
        if result.deleted_count > 0:
            print(f"✓ Cleaned up {result.deleted_count} users with null/empty usernames or emails")
        
        # Remove duplicate users by email (keep the first one)
        pipeline = [
            {"$group": {
                "_id": "$email",
                "ids": {"$push": "$_id"},
                "count": {"$sum": 1}
            }},
            {"$match": {"count": {"$gt": 1}}}
        ]
        
        cursor = database.users.aggregate(pipeline)
        duplicates = await cursor.to_list(None)
        
        for duplicate in duplicates:
            # Keep the first, delete the rest
            ids_to_delete = duplicate["ids"][1:]
            await database.users.delete_many({"_id": {"$in": ids_to_delete}})
            print(f"✓ Removed {len(ids_to_delete)} duplicate users for email: {duplicate['_id']}")
            
    except Exception as e:
        print(f"⚠ Error during data cleanup: {e}")

async def get_database():
    """Dependency function to get database instance"""
    return database

async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("✓ Database connection closed")

# Analysis Results Helper Functions
async def get_latest_analysis_result(scenario_id: str):
    """Get the most recent analysis result for a scenario"""
    from bson import ObjectId
    
    try:
        result = await database.analysis_results.find_one(
            {"scenario_id": ObjectId(scenario_id)},
            sort=[("stored_at", -1)]
        )
        return result
    except Exception as e:
        print(f"Error getting latest analysis result: {e}")
        return None

async def get_analysis_history(scenario_id: str, limit: int = 10):
    """Get analysis history for a scenario"""
    from bson import ObjectId
    
    try:
        cursor = database.analysis_results.find(
            {"scenario_id": ObjectId(scenario_id)}
        ).sort("stored_at", -1).limit(limit)
        
        return await cursor.to_list(limit)
    except Exception as e:
        print(f"Error getting analysis history: {e}")
        return []

async def delete_old_analysis_results(scenario_id: str, keep_count: int = 20):
    """Delete old analysis results, keeping only the most recent ones"""
    from bson import ObjectId
    
    try:
        # Get all results for the scenario, sorted by date
        cursor = database.analysis_results.find(
            {"scenario_id": ObjectId(scenario_id)}
        ).sort("stored_at", -1)
        
        results = await cursor.to_list(None)
        
        # If we have more than keep_count, delete the oldest ones
        if len(results) > keep_count:
            results_to_delete = results[keep_count:]
            ids_to_delete = [result["_id"] for result in results_to_delete]
            
            delete_result = await database.analysis_results.delete_many(
                {"_id": {"$in": ids_to_delete}}
            )
            
            print(f"Deleted {delete_result.deleted_count} old analysis results for scenario {scenario_id}")
            return delete_result.deleted_count
        
        return 0
    except Exception as e:
        print(f"Error deleting old analysis results: {e}")
        return 0

async def get_analysis_statistics():
    """Get overall analysis statistics across all scenarios"""
    try:
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_analyses": {"$sum": 1},
                    "avg_risk_score": {"$avg": "$risk_score"},
                    "avg_expected_loss": {"$avg": "$expected_annual_loss"},
                    "avg_security_roi": {"$avg": "$security_roi"},
                    "scenarios_analyzed": {"$addToSet": "$scenario_id"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "total_analyses": 1,
                    "avg_risk_score": {"$round": ["$avg_risk_score", 2]},
                    "avg_expected_loss": {"$round": ["$avg_expected_loss", 2]},
                    "avg_security_roi": {"$round": ["$avg_security_roi", 2]},
                    "unique_scenarios": {"$size": "$scenarios_analyzed"}
                }
            }
        ]
        
        cursor = database.analysis_results.aggregate(pipeline)
        result = await cursor.to_list(1)
        
        return result[0] if result else {
            "total_analyses": 0,
            "avg_risk_score": 0,
            "avg_expected_loss": 0,
            "avg_security_roi": 0,
            "unique_scenarios": 0
        }
    except Exception as e:
        print(f"Error getting analysis statistics: {e}")
        return {
            "total_analyses": 0,
            "avg_risk_score": 0,
            "avg_expected_loss": 0,
            "avg_security_roi": 0,
            "unique_scenarios": 0
        }

# Database health check
async def check_database_health():
    """Check database connection and collections health"""
    try:
        # Check connection
        await client.admin.command('ping')
        
        # Check collections
        collections = await database.list_collection_names()
        
        # Check analysis results collection specifically
        analysis_count = await database.analysis_results.count_documents({})
        
        return {
            "status": "healthy",
            "collections": collections,
            "analysis_results_count": analysis_count
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }