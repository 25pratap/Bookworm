from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase

router = APIRouter()


@router.get("/users")
def get_users():
    result = (
        supabase.table("profiles")
        .select("id,name,email,role,favorite_genres")
        .execute()
    )

    return result.data


@router.delete("/users/{id}")
def delete_user(id: int):

    result = (
        supabase.table("profiles")
        .delete()
        .eq("id", id)
        .execute()
    )

    return {
        "message": "User deleted successfully"
    }