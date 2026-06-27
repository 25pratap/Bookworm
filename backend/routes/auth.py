from fastapi import APIRouter, HTTPException
from jose import jwt
from datetime import datetime, timedelta
import os

from database.supabase_client import supabase
from models import UserSignup, UserLogin

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


router = APIRouter()


@router.post("/signup")
def signup(user: UserSignup):
    # Check if email already exists
    existing = supabase.table("profiles").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    result = supabase.table("profiles").insert({
        "name": user.name,
        "email": user.email,
        "password": user.password,   # ⚠️ Hash this in production (e.g. bcrypt)
        "role": user.role
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to register user")

    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin):
    result = supabase.table("profiles") \
        .select("*") \
        .eq("email", user.email) \
        .eq("password", user.password) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    u = result.data[0]
    token = create_token({
        "email": u["email"],
        "role": u["role"],
        "name": u["name"]
    })

    return {
        "message": "Login successful",
        "token": token,
        "role": u["role"],
        "name": u["name"]
    }