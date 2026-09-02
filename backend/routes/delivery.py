from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.supabase_client import supabase
from utils.security import get_current_user


router = APIRouter()

security = HTTPBearer()


@router.get("/delivery")
def get_delivery(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = get_current_user(credentials)

    orders_res = (
        supabase
        .table("orders")
        .select("*")
        .eq("user_email", user["email"])
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