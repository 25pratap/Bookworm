from fastapi import APIRouter, HTTPException,Depends
from database.supabase_client import supabase
from models import Book
from dependencies import require_admin

router = APIRouter()

@router.get("/admin/stats")
def admin_stats():

    books = supabase.table("books").select("id", count="exact").execute()

    users = supabase.table("profiles").select("id", count="exact").execute()

    reviews = supabase.table("reviews").select("id", count="exact").execute()

    return {
        "books": books.count,
        "users": users.count,
        "reviews": reviews.count
    }

@router.post("/books")
def add_book(
    book: Book,
    admin=Depends(require_admin)
):
    try:
        payload = book.model_dump()
        print("Payload:", payload)

        result = supabase.table("books").insert(payload).execute()

        print("Result:", result)

        return {
            "message": "Book added successfully",
            "book": result.data,
        }

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
        
@router.put("/books/{book_id}")
def update_book(
    book_id: int,
    updated_book: Book,
    admin=Depends(require_admin)
):

    existing = supabase.table("books").select("id").eq("id", book_id).execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Book not found")

    result = (
        supabase.table("books")
        .update(updated_book.model_dump())
        .eq("id", book_id)
        .execute()
    )

    return {
        "message": "Book updated successfully",
        "book": result.data
    }

@router.delete("/books/{book_id}")
def delete_book(
    book_id: int,
    admin=Depends(require_admin)
):
    existing = supabase.table("books").select("id").eq("id", book_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Book not found")


    supabase.table("books").delete().eq("id", book_id).execute()

    return {"message": "Book deleted successfully"}