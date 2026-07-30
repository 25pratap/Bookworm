from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase

router = APIRouter()

@router.get("/books")
def get_books():
    books = supabase.table("books").select("*").execute().data
    for book in books:
        reviews=(
            supabase
            .table("reviews")
            .select("rating")
            .eq("book_id", book["id"])
            .execute()
            .data
        )
        if reviews:
            average = sum(
                review["rating"] for review in reviews
            ) / len(reviews)

            book["rating"] = round(average, 1)

        else:
            book["rating"] = 0

    return books

@router.get("/books/{book_id}")
def get_book(book_id: int):
    result = supabase.table("books").select("*").eq("id", book_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Book not found")

    return result.data[0]


