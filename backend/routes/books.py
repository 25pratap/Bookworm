from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase

router = APIRouter()

@router.get("/books")
def get_books():
    result = supabase.table("books").select("*").execute()
    return result.data

@router.get("/books/{book_id}")
def get_book(book_id: int):
    result = supabase.table("books").select("*").eq("id", book_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Book not found")

    return result.data[0]


