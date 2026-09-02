from unicodedata import name

from fastapi import APIRouter, HTTPException,Depends
from fastapi.security import HTTPAuthorizationCredentials

from database.supabase_client import supabase
from models import Review
from utils.security import get_current_user,security

router = APIRouter()

# Get all reviews (for Admin / general)
@router.get("/reviews")
def get_all_reviews():
    try:
        result = (
            supabase
            .table("reviews")
            .select("*")
            .order("id", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print("GET ALL REVIEWS ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch reviews"
        )

# Get Reviews by book
@router.get("/reviews/{book_id}")
def get_reviews(book_id: int):
    try:
        result = (
            supabase
            .table("reviews")
            .select("*")
            .eq("book_id", book_id)
            .execute()
        )

        print(result)

        return result.data

    except Exception as e:
        print("GET REVIEW FROM ERROR:", e)
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch reviews"
        )
    #ADD REVIEW
@router.post("/reviews")
def add_review(
    review: Review,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        # Get logged-in user from JWT
        user = get_current_user(credentials)

        print("USER FROM TOKEN:", user)

        # If get_current_user returns a dictionary
        if isinstance(user, dict):
            user_email = user.get("email") or user.get("sub")
            user_name = user.get("name") or user.get("email", "User")

        else:
            # If it returns only the email
            user_email = user
            user_name = user

        if not user_email:
            raise HTTPException(
                status_code=401,
                detail="Unable to identify logged-in user"
            )

        # Check if this user has already reviewed this book
        existing = (
            supabase
            .table("reviews")
            .select("id")
            .eq("user_email", user_email)
            .eq("book_id", review.book_id)
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=400,
                detail="You already reviewed this book"
            )

        # Insert the review
        result = (
            supabase
            .table("reviews")
            .insert({
                "book_id": review.book_id,
                "user_email": user_email,
                "name": user_name,
                "rating": review.rating,
                "comment": review.comment
            })
            .execute()
        )

        print("INSERT RESULT:", result.data)

        return {
            "message": "Review added successfully",
            "data": result.data
        }

    except HTTPException:
        raise

    except Exception as e:
        print("ADD REVIEW ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to add review"
        )

#Delete review
@router.delete("/reviews/{review_id}")
def delete_review(review_id: int):
    try:
        supabase.table("reviews")\
        .delete()\
        .eq("id", review_id)\
        .execute()

        return {
            "message": "Review deleted successfully"
            }
    except Exception as e:
        print("DELETE REVIEW ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to delete review"
        )