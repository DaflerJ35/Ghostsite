from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# Analytics data model
class AnalyticsData(BaseModel):
    event_type: str
    data: Dict

# In-memory analytics database
analytics_db: List[AnalyticsData] = []

@app.post("/analytics")
async def log_analytics(data: AnalyticsData):
    analytics_db.append(data)
    return {"status": "success"}

@app.get("/analytics", response_model=List[AnalyticsData])
async def get_analytics():
    return analytics_db