from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import Base, Product, User, Order, OrderItem
from schemas import (
    ProductCreate,
    ProductUpdate,
    UserCreate,
    UserLogin,
    OrderCreate,
)
from pwdlib import PasswordHash

from database import engine, get_db

app = FastAPI()

password_hash = PasswordHash.recommended()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "E-Commerce API is running"}

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@app.post("/products")
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    product = Product(
        name=product_data.name,
        price=product_data.price,
        description=product_data.description,
        image=product_data.image,
        stock=product_data.stock,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = product_data.name
    product.price = product_data.price
    product.description = product_data.description
    product.image = product_data.image
    product.stock = product_data.stock

    db.commit()
    db.refresh(product)

    return product

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }


@app.post("/register")
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password=password_hash.hash(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id,
    }

@app.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not password_hash.verify(
        user_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "is_admin": user.is_admin
    }

@app.post("/orders")
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    # Check stock before creating the order
    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product '{item.name}' not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for '{item.name}'"
            )

    # Create order
    order = Order(
        user_id=order_data.user_id,
        full_name=order_data.full_name,
        address=order_data.address,
        postcode=order_data.postcode,
        phone=order_data.phone,
        total=order_data.total,
    )

    db.add(order)
    db.flush()

    # Create order items and reduce stock
    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        product.stock -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            name=item.name,
            price=item.price,
            size=item.size,
            quantity=item.quantity,
        )

        db.add(order_item)

    db.commit()
    db.refresh(order)

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
    }

@app.get("/orders/user/{user_id}")
def get_user_orders(
    user_id: int,
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.user_id == user_id
    ).all()

    result = []

    for order in orders:
        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        result.append({
            "id": order.id,
            "full_name": order.full_name,
            "address": order.address,
            "postcode": order.postcode,
            "phone": order.phone,
            "total": order.total,
            "items": items,
        })

    return result
