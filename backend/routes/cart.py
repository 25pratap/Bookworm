from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials
from database.supabase_client import supabase
from models import Cart

from utils.security import get_current_user, security

router = APIRouter()

@router.post("/cart")
def add_to_cart(
    cart: Cart,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = get_current_user(credentials)

    existing = (
        supabase.table("cart")
        .select("*")
        .eq("user_id", user["id"])
        .eq("book_id", cart.book_id)
        .execute()
    )

    # Book already exists in cart
    if existing.data:
        current = existing.data[0]

        result = (
            supabase.table("cart")
            .update({
                "quantity": current["quantity"] + cart.quantity
            })
            .eq("id", current["id"])
            .execute()
        )

        cart_score = 1.0

        return {
            "message": "Cart updated",
            "cart": result.data,
            "cart_score": cart_score
        }

    # Book does not exist → add it
    result = (
        supabase.table("cart")
        .insert({
            "user_id": user["id"],
            "book_id": cart.book_id,
            "quantity": cart.quantity
        })
        .execute()
    )

    cart_score = 1.0

    return {
        "message": "Book added to cart",
        "cart": result.data,
        "cart_score": cart_score
    }



@router.get("/cart")
def get_cart(credentials: HTTPAuthorizationCredentials = Depends(security)):

    user = get_current_user(credentials)

    result = (
        supabase.table("cart")
        .select("*,books(*)")
        .eq("user_id", user["id"])
        .execute()
    )

    return result.data

@router.put("/cart/{cart_id}")
def update_cart(
    cart_id: int,
    quantity: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = get_current_user(credentials)

    existing = (
        supabase.table("cart")
        .select("*")
        .eq("id", cart_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not existing.data:
        raise HTTPException(status_code=404, detail="Cart item not found")

    result = (
        supabase.table("cart")
        .update({"quantity": quantity})
        .eq("id", cart_id)
        .execute()
    )

    return {"message": "Cart updated", "cart": result.data}

@router.delete("/cart/{cart_id}")
def remove_from_cart(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user = get_current_user(credentials)

    existing = (
        supabase.table("cart")
        .select("*")
        .eq("id", cart_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not existing.data:
        raise HTTPException(status_code=404, detail="Cart item not found")
     # Delete only if it belongs to the logged-in user
    deleted = (
        supabase
        .table("cart")
        .delete()
        .eq("id", cart_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not deleted.data:
        raise HTTPException(
            status_code=404,
            detail="Cart item could not be removed"
        )

    return {
        "message": "Removed from cart",
        "cart_id": cart_id
    }
