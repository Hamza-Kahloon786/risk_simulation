# backend/app/main.py - FIXED ROUTE REGISTRATION
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.services.database import init_db, close_db

# Import routes
from app.routes import auth, scenarios, defenses, dashboard, events, locations, analysis, risk_events, business_assets, defense_systems

app = FastAPI(title="Risk Simulation API", version="1.0.0")

# CORS middleware - MUST be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:5173",
        # "http://localhost:3000",
        # "http://127.0.0.1:5173",
        # "http://127.0.0.1:3000",
        "*"  # Allow all origins for development
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React build files (only if static directory exists)
if os.path.exists("static"):
    from fastapi.staticfiles import StaticFiles
    app.mount("/static", StaticFiles(directory="static", html=True), name="static")
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

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

# Serve React app for all other routes (must be last)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Serve static assets directly without catch-all
    if full_path.startswith("assets/"):
        return FileResponse(f"static/{full_path}")
    
    # Don't interfere with API routes
    if full_path.startswith("api"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API route not found")
    
    # Serve React app for all other routes
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html", media_type="text/html")
    else:
        return {"message": "React app not built yet."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)