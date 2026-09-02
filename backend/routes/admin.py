from fastapi import APIRouter, HTTPException,Depends
from database.supabase_client import supabase
from models import Book
from dependencies import require_admin

router = APIRouter()

@router.get("/admin/stats")
def admin_stats():

    # Total books
    books = (
        supabase
        .table("books")
        .select("id", count="exact")
        .execute()
    )

    # Total users
    users = (
        supabase
        .table("profiles")
        .select("id", count="exact")
        .execute()
    )

    # Get all reviews
    reviews = (
        supabase
        .table("reviews")
        .select("id, rating, book_id")
        .execute()
    )

    review_data = reviews.data or []

    # Total reviews
    total_reviews = len(review_data)

    # Average rating
    if total_reviews > 0:
        average_rating = round(
            sum(float(r["rating"]) for r in review_data) / total_reviews,
            2
        )
    else:
        average_rating = 0

    # Rating distribution
    rating_distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    }

    for review in review_data:
        rating = str(int(float(review["rating"])))

        if rating in rating_distribution:
            rating_distribution[rating] += 1

    return {
        "books": books.count or 0,
        "users": users.count or 0,
        "reviews": total_reviews,
        "average_rating": average_rating,
        "rating_distribution": rating_distribution
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