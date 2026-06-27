from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from models import Book

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


@router.post("/books")
def add_book(book: Book):
    result = supabase.table("books").insert(book.model_dump()).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to add book")

    return {
        "message": "Book added successfully",
        "book": result.data[0]
    }


@router.put("/books/{book_id}")
def update_book(book_id: int, updated_book: Book):
    # Check book exists
    existing = supabase.table("books").select("id").eq("id", book_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Book not found")

    result = supabase.table("books") \
        .update(updated_book.model_dump()) \
        .eq("id", book_id) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to update book")

    return {
        "message": "Book updated successfully",
        "book": result.data[0]
    }


@router.delete("/books/{book_id}")
def delete_book(book_id: int):
    existing = supabase.table("books").select("id").eq("id", book_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Book not found")

    supabase.table("books").delete().eq("id", book_id).execute()

    return {"message": "Book deleted successfully"}