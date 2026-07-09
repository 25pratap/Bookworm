from fastapi import APIRouter

router = APIRouter()

@router.post("/payment")
def get_payment():
    return {
        "status": "Coming Soon",
        "message": "Payment functionality will be implemented in a future version."
    }