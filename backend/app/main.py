# 














# backend/app/main.py - UPDATED WITH ENHANCED ANALYSIS ROUTES
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.services.database import init_db, close_db
# In your main app file
from app.routes.analysis import router as analysis_router

# Import routes - UPDATED with enhanced analysis routes
from app.routes import auth, scenarios, defenses, dashboard, events, locations, risk_events, business_assets, defense_systems
from app.routes import analysis  # Enhanced analysis routes with database storage

app = FastAPI(
    title="Risk Simulation API with Real Monte Carlo Analysis", 
    version="2.0.0",
    description="FastAPI backend with real Monte Carlo simulation and database storage"
)

# CORS middleware - MUST be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
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

# Initialize database with analysis results collection
@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✓ Database initialized successfully with analysis results storage!")
    print("✓ Ready for real Monte Carlo analysis with database persistence")

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()



app.include_router(analysis_router, prefix="/analysis", tags=["analysis"])



# ENHANCED ROUTE REGISTRATION
# Analysis routes (ENHANCED) - MUST come before scenario routes for proper routing
app.include_router(analysis.router, prefix="/api/analysis", tags=["enhanced_analysis"])

# Authentication routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

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
    return {
        "message": "Risk Simulation API with Real Monte Carlo Analysis", 
        "status": "healthy",
        "version": "2.0.0",
        "features": [
            "Real Monte Carlo simulation",
            "Database storage for analysis results",
            "Historical analysis tracking",
            "Statistical confidence intervals",
            "ROI calculations",
            "Risk scoring"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "cors": "enabled",
        "database": "connected",
        "analysis_engine": "monte_carlo_v2",
        "storage": "mongodb_analysis_results"
    }

# Enhanced API info endpoint
@app.get("/api/info")
async def api_info():
    return {
        "api_name": "Risk Simulation API",
        "version": "2.0.0", 
        "analysis_engine": "Enhanced Monte Carlo Simulation",
        "storage": "MongoDB with Analysis Results Collection",
        "features": {
            "real_monte_carlo": True,
            "database_storage": True,
            "historical_tracking": True,
            "statistical_analysis": True,
            "confidence_intervals": True,
            "roi_calculations": True,
            "risk_scoring": True
        },
        "endpoints": {
            "run_analysis": "/api/analysis/scenarios/{scenario_id}/run-analysis",
            "store_results": "/api/analysis/scenarios/{scenario_id}/results",
            "get_results": "/api/analysis/scenarios/{scenario_id}/results",
            "get_summary": "/api/analysis/scenarios/{scenario_id}/results/summary"
        }
    }

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
        return {"message": "React app not built yet. Real Monte Carlo analysis backend is ready!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)