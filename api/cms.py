from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Content model
class Content(BaseModel):
    id: int
    title: str
    body: str
    author: str

# In-memory content database
fake_content_db = [
    {"id": 1, "title": "Welcome to Our Website", "body": "This is the homepage content.", "author": "Admin"},
    {"id": 2, "title": "About Us", "body": "We are a team of developers.", "author": "Admin"},
]

@app.get("/content", response_model=List[Content])
async def get_content():
    return fake_content_db

@app.get("/content/{content_id}", response_model=Content)
async def get_content_by_id(content_id: int):
    content = next((c for c in fake_content_db if c["id"] == content_id), None)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@app.post("/content", response_model=Content)
async def create_content(content: Content):
    fake_content_db.append(content.dict())
    return content

@app.put("/content/{content_id}", response_model=Content)
async def update_content(content_id: int, updated_content: Content):
    content = next((c for c in fake_content_db if c["id"] == content_id), None)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    content.update(updated_content.dict())
    return content

@app.delete("/content/{content_id}")
async def delete_content(content_id: int):
    content = next((c for c in fake_content_db if c["id"] == content_id), None)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    fake_content_db.remove(content)
    return {"message": "Content deleted successfully"} 