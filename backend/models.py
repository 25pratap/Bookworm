from pydantic import BaseModel
from typing import Optional


class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"


class UserLogin(BaseModel):
    email: str
    password: str


class Book(BaseModel):
    title: str
    author: str
    genre: str
    description: str
    cover: Optional[str] = None


class Review(BaseModel):
    book_id: int
    name: str
    rating: int
    comment: str