from database import SessionLocal
from models import Product

db = SessionLocal()

products = [
    Product(
        id=1,
        name="Classic Black T-Shirt",
        price=19.99,
        description="A comfortable everyday black t-shirt.",
        image="blackTshirtImage",
    ),
    Product(
        id=2,
        name="Oversized Hoodie",
        price=39.99,
        description="A relaxed fit hoodie for casual everyday wear.",
        image="hoodieImage",
    ),
    Product(
        id=3,
        name="High Waisted Jeans",
        price=49.99,
        description="Classic high waist jeans with a modern look.",
        image="jeansImage",
    ),
]

db.add_all(products)
db.commit()
db.close()

print("Products added successfully.")
