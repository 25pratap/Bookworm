from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from database.supabase_client import supabase
from utils.security import get_current_user


router = APIRouter()

security = HTTPBearer()


class CheckoutData(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    state: str


@router.post("/orders")
def place_order(
    data: CheckoutData,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user = get_current_user(credentials)

    cart = (
        supabase.table("cart")
        .select("*")
        .eq("user_id", user["id"])
        .execute()
    )

    if not cart.data:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )


    for item in cart.data:

        supabase.table("orders").insert({

            "user_email": user["email"],

            "name": data.name,
            "phone": data.phone,

            "address": data.address,
            "city": data.city,
            "state": data.state,

            "book_id": item["book_id"],
            "quantity": item["quantity"],

            "status": "Pending"

        }).execute()


    # clear cart after order
    supabase.table("cart")\
        .delete()\
        .eq("user_id", user["id"])\
        .execute()


    return {
        "message": "Order placed successfully"
    }


@router.put("/orders/payment")
def update_payment(
    data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user = get_current_user(credentials)

    payment_method = data.get("payment_method")

    if not payment_method:
        raise HTTPException(
            status_code=400,
            detail="Payment method required"
        )


    result = (
        supabase
        .table("orders")
        .update({
            "payment_method": payment_method,
            "status": "Confirmed"
        })
        .eq("user_email", user["email"])
        .eq("status", "Pending")
        .execute()
    )


    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="No pending orders found"
        )


    return {
        "message": "Payment successful",
        "payment_method": payment_method
    }
 
@router.put("/orders/{order_id}/cancel")
def cancel_specific_order(
    order_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = get_current_user(credentials)

    result = (
        supabase
        .table("orders")
        .update({
            "status": "Cancelled"
        })
        .eq("id", order_id)
        .eq("user_email", user["email"])
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "message": "Order cancelled successfully"
    }

@router.put("/orders/cancel")
def cancel_order(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user = get_current_user(credentials)

    result = (
        supabase
        .table("orders")
        .update({
            "status": "Cancelled"
        })
        .eq("user_email", user["email"])
        .eq("status", "Pending")
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="No pending order found"
        )

    return {
        "message": "Order cancelled"
    }