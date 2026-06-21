from fastapi import FastAPI, Depends
from app.database import get_db
from app.schemas.volunteer import VolunteerRegister, VolunteerLogin, StatusUpdate, RoleUpdate

from app.core.security import hash_password
from fastapi import HTTPException

from app.core.security import verify_password, create_access_token

from app.core.dependencies import get_current_user
from app.core.dependencies import get_current_admin

from bson import ObjectId

app  = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    db = get_db()
    collections = await db.list_collection_names()
    return {"message": "Welcome to the Volunteer Management System", "collections": collections}

@app.post("/register")
async def register(volunteer: VolunteerRegister):
    db = get_db()
    
    # Step 2-3: check email exists
    existing = await db.volunteers.find_one({"email": volunteer.email})
    if existing:
        # error kaise return karte hain FastAPI me? socho ya google karo "FastAPI HTTPException"
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Step 4: hash password
    hashed_pw = hash_password(volunteer.password)
    
    # Step 5: dictionary banao
    new_volunteer = {
        "name": volunteer.name,
        "email": volunteer.email,
        "password": hashed_pw,
        "phone": volunteer.phone,
        "address": volunteer.address,
        "role": "volunteer",
        "status": "pending"
    }
    
    # Step 6: insert
    result = await db.volunteers.insert_one(new_volunteer)
    
    return {"message": "Registered successfully", "id": str(result.inserted_id)} 


@app.post("/login")
async def login(credentials: VolunteerLogin):
    db = get_db()
    
    # Step 2: email se user dhundo
    user = await db.volunteers.find_one({"email": credentials.email})
    
    # Step 3: user mila nahi to error
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Step 4: password verify karo
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Step 6: token banao
    token = create_access_token({"sub": str(user["_id"])})
    
    # Step 7: return karo
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user["phone"],
        "address": current_user["address"],
        "role": current_user["role"],
        "status": current_user["status"]
    }


@app.get("/admin/test")
async def admin_test(admin: dict = Depends(get_current_admin)):
    return {"message": f"Welcome admin {admin['name']}"}


@app.get("/admin/volunteers")
async def list_volunteers(admin: dict = Depends(get_current_admin)):
    db = get_db()
    cursor = db.volunteers.find({}, {"password": 0})  # password field exclude karo
    volunteers = await cursor.to_list(length=100)
    
    # ObjectId ko string me convert karna padega, JSON me directly nahi ja sakta
    for v in volunteers:
        v["_id"] = str(v["_id"])
    
    return volunteers

@app.patch("/admin/volunteers/{volunteer_id}/status")
async def update_status(
    volunteer_id: str, 
    update: StatusUpdate, 
    admin: dict = Depends(get_current_admin)
):
    db = get_db()
    
    result = await db.volunteers.update_one(
        {"_id": ObjectId(volunteer_id)},
        {"$set": {"status": update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    return {"message": f"Status updated to {update.status}"}

@app.patch("/admin/volunteers/{volunteer_id}/role")
async def update_role(
    volunteer_id: str,
    update: RoleUpdate,
    admin: dict = Depends(get_current_admin)
):
    db = get_db()
    
    result = await db.volunteers.update_one(
        {"_id": ObjectId(volunteer_id)},
        {"$set": {"role": update.role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    return {"message": f"Role updated to {update.role}"}

@app.delete("/admin/volunteers/{volunteer_id}")
async def delete_volunteer(
    volunteer_id: str,
    admin: dict = Depends(get_current_admin)
):
    db = get_db()
    
    result = await db.volunteers.delete_one({"_id": ObjectId(volunteer_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    return {"message": "Volunteer deleted successfully"}