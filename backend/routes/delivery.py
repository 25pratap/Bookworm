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
    print("CREDENTIALS:", credentials)

    user = get_current_user(credentials)



    order = (
        supabase
        .table("orders")
        .select("*")
        .eq("user_email", user["email"])
        .execute()
    )


    return order.data