import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

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

DEFAULT_FRONTEND_ORIGINS = (
    "http://localhost:3000,http://127.0.0.1:3000,"
    "http://localhost:5173,http://127.0.0.1:5173"
)
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_ORIGINS", DEFAULT_FRONTEND_ORIGINS).split(",")
    if origin.strip()
]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

