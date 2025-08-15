# backend/app/routes/dashboard.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.database import get_database

router = APIRouter()

@router.get("/stats/overview")
async def get_dashboard_overview(db=Depends(get_database)):
    """Get comprehensive dashboard statistics"""
    try:
        # Get all collections data in parallel
        scenarios = await db.scenarios.find().to_list(1000)
        defenses = await db.defenses.find().to_list(1000)
        events = await db.events.find().to_list(1000)
        locations = await db.locations.find().to_list(1000)
        
        # Calculate scenario stats
        active_scenarios = len([s for s in scenarios if s.get('status') == 'active'])
        total_scenarios = len(scenarios)
        avg_risk_score = sum(s.get('risk_score', 0) for s in scenarios) / len(scenarios) if scenarios else 0
        
        # Calculate defense stats
        defense_count = len(defenses)
        total_defense_cost = sum(d.get('annual_cost', 0) for d in defenses)
        avg_effectiveness = sum(d.get('effectiveness', 0) for d in defenses) / len(defenses) if defenses else 0
        total_incidents_prevented = sum(d.get('incidents_prevented', 0) for d in defenses)
        
        # Calculate event stats
        critical_events = len([e for e in events if e.get('severity') in ['critical', 'high']])
        total_events = len(events)
        
        # Calculate risk distribution by category
        risk_categories = {}
        for event in events:
            category = event.get('category', 'operational')
            risk_categories[category] = risk_categories.get(category, 0) + 1
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_scenarios = [
            s for s in scenarios 
            if s.get('updated_at') and isinstance(s['updated_at'], datetime) and s['updated_at'] > thirty_days_ago
        ]
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_risk_score": round(avg_risk_score, 1),
                    "active_scenarios": active_scenarios,
                    "total_scenarios": total_scenarios,
                    "critical_events": critical_events,
                    "total_events": total_events,
                    "defense_coverage": round(avg_effectiveness, 1),
                    "defense_count": defense_count,
                    "total_defense_investment": total_defense_cost,
                    "incidents_prevented": total_incidents_prevented
                },
                "risk_distribution": risk_categories,
                "recent_activity": {
                    "scenarios_updated": len(recent_scenarios),
                    "new_events": len([e for e in events if e.get('created_at') and isinstance(e['created_at'], datetime) and e['created_at'] > thirty_days_ago])
                },
                "locations_count": len(locations)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard overview: {str(e)}")

@router.get("/stats/trends")
async def get_dashboard_trends(db=Depends(get_database)):
    """Get trend data for dashboard charts"""
    try:
        # Get scenarios with timestamps
        scenarios = await db.scenarios.find().to_list(1000)
        defenses = await db.defenses.find().to_list(1000)
        events = await db.events.find().to_list(1000)
        
        # Calculate monthly trends for the last 6 months
        now = datetime.utcnow()
        months = []
        for i in range(6):
            month_start = datetime(now.year, now.month - i, 1) if now.month > i else datetime(now.year - 1, 12 - (i - now.month), 1)
            months.append(month_start)
        
        months.reverse()  # Oldest to newest
        
        trend_data = []
        for month in months:
            next_month = datetime(month.year, month.month + 1, 1) if month.month < 12 else datetime(month.year + 1, 1, 1)
            
            # Count scenarios created in this month
            scenarios_count = len([
                s for s in scenarios 
                if s.get('created_at') and isinstance(s['created_at'], datetime) 
                and month <= s['created_at'] < next_month
            ])
            
            # Count events created in this month
            events_count = len([
                e for e in events 
                if e.get('created_at') and isinstance(e['created_at'], datetime) 
                and month <= e['created_at'] < next_month
            ])
            
            # Count defenses created in this month
            defenses_count = len([
                d for d in defenses 
                if d.get('created_at') and isinstance(d['created_at'], datetime) 
                and month <= d['created_at'] < next_month
            ])
            
            trend_data.append({
                "month": month.strftime("%b %Y"),
                "scenarios": scenarios_count,
                "events": events_count,
                "defenses": defenses_count
            })
        
        return {
            "success": True,
            "data": {
                "monthly_trends": trend_data,
                "total_scenarios": len(scenarios),
                "total_events": len(events),
                "total_defenses": len(defenses)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard trends: {str(e)}")

@router.get("/recent-activity")
async def get_recent_activity(limit: int = 10, db=Depends(get_database)):
    """Get recent activity across all entities"""
    try:
        # Get recent items from all collections
        recent_scenarios = await db.scenarios.find().sort("updated_at", -1).limit(limit).to_list(limit)
        recent_events = await db.events.find().sort("updated_at", -1).limit(limit).to_list(limit)
        recent_defenses = await db.defenses.find().sort("updated_at", -1).limit(limit).to_list(limit)
        
        # Combine and sort all activities
        activities = []
        
        for scenario in recent_scenarios:
            activities.append({
                "type": "scenario",
                "id": str(scenario["_id"]),
                "name": scenario.get("name", "Unnamed Scenario"),
                "action": "updated" if scenario.get("updated_at") != scenario.get("created_at") else "created",
                "timestamp": scenario.get("updated_at", scenario.get("created_at")),
                "status": scenario.get("status", "draft"),
                "risk_score": scenario.get("risk_score", 0)
            })
        
        for event in recent_events:
            activities.append({
                "type": "event",
                "id": str(event["_id"]),
                "name": event.get("name", "Unnamed Event"),
                "action": "updated" if event.get("updated_at") != event.get("created_at") else "created",
                "timestamp": event.get("updated_at", event.get("created_at")),
                "severity": event.get("severity", "medium"),
                "category": event.get("category", "operational")
            })
        
        for defense in recent_defenses:
            activities.append({
                "type": "defense",
                "id": str(defense["_id"]),
                "name": defense.get("name", "Unnamed Defense"),
                "action": "updated" if defense.get("updated_at") != defense.get("created_at") else "created",
                "timestamp": defense.get("updated_at", defense.get("created_at")),
                "status": defense.get("status", "active"),
                "effectiveness": defense.get("effectiveness", 0)
            })
        
        # Sort by timestamp (most recent first) and limit
        activities.sort(key=lambda x: x["timestamp"] or datetime.min, reverse=True)
        activities = activities[:limit]
        
        return {
            "success": True,
            "data": activities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent activity: {str(e)}")

@router.get("/risk-analysis")
async def get_risk_analysis(db=Depends(get_database)):
    """Get detailed risk analysis for dashboard"""
    try:
        scenarios = await db.scenarios.find().to_list(1000)
        events = await db.events.find().to_list(1000)
        defenses = await db.defenses.find().to_list(1000)
        
        # Risk score distribution
        risk_ranges = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for scenario in scenarios:
            risk_score = scenario.get("risk_score", 0)
            if risk_score < 25:
                risk_ranges["low"] += 1
            elif risk_score < 50:
                risk_ranges["medium"] += 1
            elif risk_score < 75:
                risk_ranges["high"] += 1
            else:
                risk_ranges["critical"] += 1
        
        # Event severity analysis
        severity_count = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for event in events:
            severity = event.get("severity", "medium")
            severity_count[severity] = severity_count.get(severity, 0) + 1
        
        # Defense effectiveness analysis
        defense_effectiveness = {
            "excellent": len([d for d in defenses if d.get("effectiveness", 0) >= 90]),
            "good": len([d for d in defenses if 70 <= d.get("effectiveness", 0) < 90]),
            "fair": len([d for d in defenses if 50 <= d.get("effectiveness", 0) < 70]),
            "poor": len([d for d in defenses if d.get("effectiveness", 0) < 50])
        }
        
        # Calculate overall risk posture
        total_risk_score = sum(s.get("risk_score", 0) for s in scenarios)
        scenario_count = len(scenarios)
        avg_defense_effectiveness = sum(d.get("effectiveness", 0) for d in defenses) / len(defenses) if defenses else 0
        
        overall_posture = "low"
        if scenario_count > 0:
            avg_risk = total_risk_score / scenario_count
            if avg_risk > 60 and avg_defense_effectiveness < 70:
                overall_posture = "critical"
            elif avg_risk > 40 or avg_defense_effectiveness < 80:
                overall_posture = "high"
            elif avg_risk > 20 or avg_defense_effectiveness < 90:
                overall_posture = "medium"
        
        return {
            "success": True,
            "data": {
                "risk_score_distribution": risk_ranges,
                "event_severity_analysis": severity_count,
                "defense_effectiveness": defense_effectiveness,
                "overall_risk_posture": overall_posture,
                "metrics": {
                    "average_scenario_risk": round(total_risk_score / scenario_count, 1) if scenario_count > 0 else 0,
                    "average_defense_effectiveness": round(avg_defense_effectiveness, 1),
                    "total_scenarios": scenario_count,
                    "total_events": len(events),
                    "total_defenses": len(defenses)
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing risk analysis: {str(e)}")