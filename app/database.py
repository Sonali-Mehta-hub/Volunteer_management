import os

from dotenv import load_dotenv 
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())
db = client[MONGO_DB_NAME]

def get_db():
    return db