from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase
from models import GenrePreference

router = APIRouter()

# Save preferences
@router.put("/preferences")
def save_preferences(data: GenrePreference):
    result = (
        supabase.table("profiles")
        .update({
            "favorite_genres": data.favorite_genres
        })
        .eq("email", data.email)
        .execute()
    )

    return {
        "message": "Preferences saved successfully"
    }

# Get preferences
@router.get("/preferences/{email}")
def get_preferences(email: str):
    response = (
        supabase.table("profiles")
        .select("favorite_genres")
        .eq("email", email)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return response.data