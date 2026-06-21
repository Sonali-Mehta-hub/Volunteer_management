from pydantic import BaseModel, Field, EmailStr

class VolunteerRegister(BaseModel):
    name: str 
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str = Field(..., min_length=10, max_length=15)
    address: str

class VolunteerLogin(BaseModel):
    email: EmailStr
    password: str

class StatusUpdate(BaseModel):
    status: str  

class RoleUpdate(BaseModel):
    role: str  