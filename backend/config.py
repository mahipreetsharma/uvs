# backend/config.py
import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

load_dotenv()

def get_database():
    CONNECTION_STRING = os.getenv("MONGO_URI")
    if not CONNECTION_STRING:
        print("❌ Error: MONGO_URI missing from your .env file!")
        return None
    try:
        client = MongoClient(CONNECTION_STRING, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("🚀 Successfully connected to MongoDB Atlas Cloud Database!")
        return client["campus_voting_db"]
    except PyMongoError as error:
        print("❌ Cloud Database Connection Failure:", error)
        return None

db = get_database()

if db is not None:
    blocks_collection = db["blockchain"]
    voters_collection = db["voters"]
    candidates_collection = db["candidates"]
    users_collection = db["users"]  # Added collection for user credentials
else:
    blocks_collection = None
    voters_collection = None
    candidates_collection = None
    users_collection = None
