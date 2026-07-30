from fastapi import APIRouter, HTTPException, status
from database.supabase_client import supabase
from models import UserSignup, UserLogin, ChangePassword

from utils.security import (
    hash_password,
    verify_password,
    create_token,
)

router = APIRouter()

# =========================
# REGISTER
# =========================
@router.post("/register")
def register(user: UserSignup):
    try:
        print("Received:", user.model_dump())
        
         # check empty values
        if not user.email.strip():
            raise HTTPException(
                status_code=400,
                detail="Email is required"
            )

        if not user.name.strip():
            raise HTTPException(
                status_code=400,
                detail="Name is required"
            )
        # check existing user
        existing = (
            supabase.table("profiles")
            .select("id")
            .eq("email", user.email)
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_pw = hash_password(user.password)

        supabase.table("profiles").insert({
            "name": user.name,
            "email": user.email,
            "password": hashed_pw,
            "role": user.role or "user",
            "age": user.age,
            "gender": user.gender,
            "favorite_genres": user.favorite_genres or [],
        }).execute()

        return {"message": "User registered successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print("REGISTER ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Registration failed"
        )


# =========================
# LOGIN
# =========================
@router.post("/login")
def login(user: UserLogin):
    try:
        result = (
            supabase.table("profiles")
            .select("*")
            .eq("email", user.email)
            .execute()
        )
    
        print("SUPABASE RESULT:", result.data)
    
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not found"
            )

        u = result.data[0]
        print("USER FOUND:",u["email"])
        print("HASH FROM DB:",u["password"])

        password_valid =verify_password(
             user.password,
             u["password"]
        )
        print("PASSWORD VALID:",password_valid)

        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password Incorrect"
            )

        token = create_token({
            "id": u["id"],
            "email": u["email"],
            "role": u.get("role"),
            "name": u.get("name"),
        })

        return {
            "message": "Login successful",
            "token": token,
            "id": u.get("id"),
            "email": u.get("email"),
            "role": u.get("role"),
            "name": u.get("name"),
            "favorite_genres": u.get("favorite_genres", []),
        }

    except HTTPException:
        raise

    except Exception as e:
        print("LOGIN ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Login failed"
        )


# =========================
# CHANGE PASSWORD
# =========================
@router.put("/change-password")
def change_password(data: ChangePassword):
    try:
        user = (
            supabase.table("profiles")
            .select("*")
            .eq("email", data.email)
            .single()
            .execute()
        )
    except HTTPException:
                raise
    except Exception as e:
                # .single() raises when no row matches the email
                print("CHANGE PASSWORD LOOKUP ERROR:", repr(e))
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
    try:
        if not user.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        u = user.data

        if not verify_password(data.old_password, u["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Old password is incorrect"
            )

        new_hashed = hash_password(data.new_password)

        supabase.table("profiles").update({
            "password": new_hashed
        }).eq("email", data.email).execute()

        return {"message": "Password changed successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print("CHANGE PASSWORD ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Password update failed"
        )
    