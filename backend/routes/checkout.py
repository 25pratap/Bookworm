from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.supabase_client import supabase
from utils.security import get_current_user


router = APIRouter()

security = HTTPBearer()


@router.get("/checkout")
def checkout(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user = get_current_user(credentials)


    cart = (
        supabase
        .table("cart")
        .select("*, books(*)")
        .eq("user_id", user["id"])
        .execute()
    )


    if not cart.data:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )


    return {
        "items": cart.data,
        "message": "Ready for checkout"
    }