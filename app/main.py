from fastapi import FastAPI
from app.database import get_db

app  = FastAPI()

@app.get("/")
async def root():
    db = get_db()
    collections = await db.list_collection_names()
    return {"message": "...", "collections": collections}

    

