from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    auth,
    books,
    reviews,
    preferences,
    users,
    admin,
    recommendations,
    cart,
    orders,
    checkout,
    payment,
    delivery
)
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes (ONLY ONCE)
app.include_router(auth.router)
app.include_router(books.router)
app.include_router(reviews.router)
app.include_router(preferences.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(recommendations.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(checkout.router)
app.include_router(payment.router)
app.include_router(delivery.router)

