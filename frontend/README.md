# Urban Threads

A full-stack e-commerce web application for small and medium sized businesses (SMEs). The project combines a React + TypeScript frontend, FastAPI backend, and PostgreSQL database to support customer shopping, inventory management, and an admin dashboard.

## Overview

Urban Threads was built as a practical full stack e-commerce project covering both the customer and business sides of an online store.

Customers can:

- browse available products
- view product details
- select sizes
- add products to a shopping cart
- register and log in
- complete checkout
- place orders
- view previous orders
- see live stock availability

Administrators can:

- access a protected admin dashboard
- view all products
- add new products
- edit existing products
- delete products
- manage stock levels
- view customer orders

## Features

- Responsive React and TypeScript interface
- Product catalogue and product detail pages
- Shopping cart with quantity controls
- Product size selection
- Dynamic stock availability
- User registration and login
- Password hashing
- Persistent authentication using Zustand
- Checkout and order confirmation
- Customer order history
- Protected admin dashboard
- Add, edit and delete products
- Stock management
- Automatic stock deduction after checkout
- Customer order viewing for administrators
- PostgreSQL database integration
- REST API built with FastAPI

## Project Structure

- `frontend/src/pages/` – Main application pages including Home, Products, Cart, Checkout, Orders and Admin
- `frontend/src/components/` – Reusable React components
- `frontend/src/store/` – Zustand stores for authentication and cart management
- `frontend/src/utils/productImages.ts` – Maps product image keys to local image assets
- `backend/main.py` – FastAPI application and API endpoints
- `backend/models.py` – SQLAlchemy database models
- `backend/schemas.py` – Pydantic schemas
- `backend/database.py` – PostgreSQL database connection

## Requirements

The project uses:

- React
- TypeScript
- Vite
- Zustand
- React Router
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- pgAdmin

## Running the App

- Start the backend from the `backend` directory:

venv\Scripts\activate
python -m uvicorn main:app --reload

- Start the frontend from the frontend directory:

npm run dev

The frontend runs locally at:

http://127.0.0.1:8000


## How It Works

The React frontend requests product data from the FastAPI backend.
FastAPI retrieves product information from PostgreSQL using SQLAlchemy.
Customers browse products, choose a size, and add items to their cart.
Zustand manages cart and authentication state.
Available stock is checked before quantities can be increased.
Customers enter delivery details during checkout.
FastAPI validates stock and stores the order in PostgreSQL.
Purchased quantities are deducted from product stock.
Customers can view their order history.
Administrators can manage products, stock levels, and customer orders through the Admin Dashboard.


## Limitations

Payment integration has not yet been implemented
Authentication is suitable for an MVP/portfolio project rather than production
Product images are currently stored locally
The application currently runs locally rather than on a deployed environment

## Limitations

Possible improvements include:

Stripe payment integration
JWT authentication
product search and filtering
product categories
customer profiles
wishlists
reviews and ratings
discount codes
order status tracking
email order confirmations
product image uploads
sales analytics
cloud deployment


## License

This project is intended for educational and portfolio use.