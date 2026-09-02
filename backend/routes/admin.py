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

@router.get("/admin/orders")
def get_all_orders(admin=Depends(require_admin)):
    try:
        orders_res = (
            supabase
            .table("orders")
            .select("*")
            .order("id", desc=True)
            .execute()
        )
        orders = orders_res.data or []
        if orders:
            book_ids = list(set([int(o["book_id"]) for o in orders if o.get("book_id")]))
            if book_ids:
                books_res = (
                    supabase
                    .table("books")
                    .select("id, title, author, genre, price, cover")
                    .in_("id", book_ids)
                    .execute()
                )
                books_map = {b["id"]: b for b in (books_res.data or [])}
                for o in orders:
                    o["books"] = books_map.get(int(o.get("book_id", 0)))
        return orders
    except Exception as e:
        print("ADMIN GET ORDERS ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

@router.put("/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: dict,
    admin=Depends(require_admin)
):
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")

    result = (
        supabase
        .table("orders")
        .update({"status": status})
        .eq("id", order_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "message": f"Order status updated to {status}",
        "order": result.data[0]
    }