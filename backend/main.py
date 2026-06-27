from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, books, reviews

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