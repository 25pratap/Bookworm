from fastapi import APIRouter

router = APIRouter()

@router.get("/orders")
def get_orders():
    return {
        "status": "Coming Soon",
        "message": "Order functionality will be implemented in a future version."
    }