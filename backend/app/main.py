# Add this to your backend/app/routes/defenses.py
# The route is already there! The issue is the route registration order.

# In your main.py, make sure the routes are registered in the correct order:

# backend/app/main.py - FIXED ROUTE REGISTRATION
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.database import init_db, close_db

# Import routes
from app.routes import auth, scenarios, defenses, dashboard, events, locations, analysis, risk_events, business_assets, defense_systems

app = FastAPI(title="Risk Simulation API", version="1.0.0")

# CORS middleware - MUST be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✓ Database initialized successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# CRITICAL: Register routes in the correct order
# More specific routes MUST come before general routes

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

# Analysis routes (more specific) BEFORE scenario routes
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

# Scenario nested routes (more specific) BEFORE general scenario routes
app.include_router(risk_events.router, prefix="/api/scenarios", tags=["risk_events"])
app.include_router(business_assets.router, prefix="/api/scenarios", tags=["business_assets"])
app.include_router(defense_systems.router, prefix="/api/scenarios", tags=["defense_systems"])

# General routes
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["scenarios"])
app.include_router(defenses.router, prefix="/api/defenses", tags=["defenses"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(locations.router, prefix="/api/locations", tags=["locations"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
async def root():
    return {"message": "Risk Simulation API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "cors": "enabled"}

# Handle preflight OPTIONS requests
@app.options("/{path:path}")
async def options_handler(path: str):
    return {"message": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)