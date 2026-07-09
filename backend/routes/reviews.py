from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from models import Review

router = APIRouter()


@router.get("/reviews/{book_id}")
def get_reviews(book_id: int):
    result = supabase.table("reviews").select("*").eq("book_id", book_id).execute()
    return result.data


@router.post("/reviews")
def add_review(review: Review):
    # Validate rating range
    if not (1 <= review.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    result = supabase.table("reviews").insert(review.model_dump()).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to add review")

    return {"message": "Review added successfully"}
@router.get("/reviews")
def get_all_reviews():
    result = supabase.table("reviews").select("*").execute()
    return result.data


@router.delete("/reviews/{review_id}")
def delete_review(review_id: int):
    supabase.table("reviews").delete().eq("id", review_id).execute()
    return {"message": "Review deleted successfully"}