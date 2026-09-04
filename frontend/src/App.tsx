import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import './App.css'
import OrderConfirmation from './pages/OrderConfirmation'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
    </BrowserRouter>
  )
}

export default App
