from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# user models
class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"
    age: Optional[int] = None
    gender: Optional[str] = None
    favorite_genres: Optional[List[str]] = []   

class UserLogin(BaseModel):
    email: str
    password: str

#Book models
class Book(BaseModel):
    title: str
    author: str
    genre: str
    description: str
    price:float
    cover: Optional[str] = None
    rating: Optional[float] = 0
    publication_date: int
    pages: Optional[int] = None
    stock: Optional[int] = 0

#Review model
class Review(BaseModel):
    book_id: int
    name: str
    rating: int
    comment: str

#Preferences
class GenrePreference(BaseModel):
    email: str
    favorite_genres: List[str]

#Password Change
class ChangePassword(BaseModel):
    email: str
    old_password: str
    new_password: str

#Cart model
class Cart(BaseModel):
    book_id:int
    quantity:int=1

# Order Model
class Order(BaseModel):
    user_email: str
    name: str
    book_id: int
    quantity: int
    status: str = "Pending"
    order_date: date
    
# Order Item Model
class OrderItem(BaseModel):
    order_id: int
    book_id: int
    quantity: int