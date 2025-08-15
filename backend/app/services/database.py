import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def get_database():
    return db.database

async def init_db():
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        raise ValueError("MONGODB_URL environment variable is not set")
    
    db.client = AsyncIOMotorClient(mongodb_url)
    db.database = db.client[os.getenv("DATABASE_NAME", "risk_simulation")]
    
    # Test connection
    try:
        await db.client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise
    
    # Create indexes
    await db.database.scenarios.create_index("name")
    await db.database.risk_events.create_index("scenario_id")
    await db.database.business_assets.create_index("scenario_id")
    await db.database.defense_systems.create_index("scenario_id")

async def close_db():
    if db.client:
        db.client.close()