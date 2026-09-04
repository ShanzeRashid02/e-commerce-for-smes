from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    image = Column(String, nullable=False)
    stock = Column(Integer, default=0, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    is_admin = Column(Boolean, default=False, nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    full_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    postcode = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    total = Column(Float, nullable=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    size = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)