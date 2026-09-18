from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase

router = APIRouter()

@router.get("/books")
def get_books():
     # Get all books in one request
    books_result = (
        supabase
        .table("books")
        .select(
            "id, title, author, genre, price, cover, "
            "publication_date, pages, stock, description"
        )
        .order("id",desc=True)
        .execute()
    )

    books = books_result.data or []

    if not books:
        return []

    # Get all reviews in ONE request
    reviews_result = (
        supabase
        .table("reviews")
        .select("book_id, rating")
        .execute()
    )

    reviews = reviews_result.data or []

    # Calculate ratings in Python
    rating_totals = {}
    rating_counts = {}

    for review in reviews:
        book_id = int(review["book_id"])
        rating = float(review["rating"])

        rating_totals[book_id] = (
            rating_totals.get(book_id, 0) + rating
        )

        rating_counts[book_id] = (
            rating_counts.get(book_id, 0) + 1
        )

    # Add average rating to each book
    for book in books:
        book_id = int(book["id"])

        if book_id in rating_counts:
            average = (
                rating_totals[book_id]
                / rating_counts[book_id]
            )

            book["rating"] = round(average, 1)
        else:
            book["rating"] = 0

    return books

@router.get("/recommended-books/{email}")
def recommended_books(email: str):

    # Get user's favourite genres
    user = (
        supabase
        .table("profiles")
        .select("favorite_genres")
        .eq("email", email)
        .single()
        .execute()
    )

    if not user.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    genres = user.data.get("favorite_genres", [])

    if not genres:
        return []

    # Get only books matching favourite genres
    books_result = (
        supabase
        .table("books")
        .select(
            "id, title, author, genre, price, cover, "
            "publication_date, pages, stock, description"
        )
        .in_("genre", genres)
        .execute()
    )

    books = books_result.data or []

    if not books:
        return []

    # Get all review ratings in ONE request
    reviews_result = (
        supabase
        .table("reviews")
        .select("book_id, rating")
        .execute()
    )

    reviews = reviews_result.data or []

    # Calculate ratings
    rating_totals = {}
    rating_counts = {}

    for review in reviews:
        book_id = int(review["book_id"])
        rating = float(review["rating"])

        rating_totals[book_id] = (
            rating_totals.get(book_id, 0) + rating
        )

        rating_counts[book_id] = (
            rating_counts.get(book_id, 0) + 1
        )

    # Add average rating to each recommended book
    for book in books:
        book_id = int(book["id"])

        if book_id in rating_counts:
            book["rating"] = round(
                rating_totals[book_id] /
                rating_counts[book_id],
                1
            )
        else:
            book["rating"] = 0

    return books

@router.get("/books/{book_id}")
def get_book(book_id: int):
    result = supabase.table("books").select("*").eq("id", book_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Book not found")

    return result.data[0]


