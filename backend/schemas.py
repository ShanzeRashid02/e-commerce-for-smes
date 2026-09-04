from pydantic import BaseModel
from typing import List


class ProductCreate(BaseModel):
    name: str
    price: float
    description: str
    image: str
    stock: int


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class OrderItemCreate(BaseModel):
    product_id: int
    name: str
    price: float
    size: str
    quantity: int


class OrderCreate(BaseModel):
    user_id: int
    full_name: str
    address: str
    postcode: str
    phone: str
    total: float
    items: List[OrderItemCreate]


class ProductUpdate(BaseModel):
    name: str
    price: float
    description: str
    image: str
    stock: int
