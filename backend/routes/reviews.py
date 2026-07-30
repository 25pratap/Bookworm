from fastapi import APIRouter, HTTPException,Depends
from fastapi.security import HTTPAuthorizationCredentials

from database.supabase_client import supabase
from models import Review
from utils.security import get_current_user,security

router = APIRouter()
#Get Reviews by book

    
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
    credentials:HTTPAuthorizationCredentials = Depends(security)
    ):
        try:
            user = get_current_user(credentials)

            print("USER FROM TOKEN:", user)

            # Check if user already reviewed this book
            existing = (
                supabase
                .table("reviews")
                .select("*")
                .eq("book_id", review.book_id)
                .eq("user_email", user["email"])
                .execute()
            )


            if existing.data:
                raise HTTPException(
                    status_code=400,
                    detail="You already reviewed this book"
                )


            result =supabase.table("reviews").insert({
                "book_id":review.book_id,
                "user_email":user["email"],
                "name":user["name"],
                "rating":review.rating,
                "comment":review.comment
            }).execute()

            print("INSERT RESULT:", result.data)

            return {
                "message": "Review added successfully",
                "data": result.data
            }
        except Exception as e:
            print("ADD REVIEW ERROR:", e)
            raise HTTPException(
                status_code=500,
                detail=str(e)
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