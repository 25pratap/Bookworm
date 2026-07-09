from fastapi import APIRouter

router = APIRouter()

@router.get("/delivery")
def get_delivery():
    return {
        "status": "Coming Soon",
        "message": "Delivery management will be implemented in a future version."
    }