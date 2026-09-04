import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Orders.css'

type OrderItem = {
  id: number
  product_id: number
  name: string
  price: number
  size: string
  quantity: number
}

type Order = {
  id: number
  full_name: string
  address: string
  postcode: string
  phone: string
  total: number
  items: OrderItem[]
}

function Orders() {
  const user = useAuthStore((state) => state.user)

  const location = useLocation()
  const navigate = useNavigate()

  const showOrderToast = location.state?.showOrderToast
  const orderId = location.state?.orderId

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetch(`http://127.0.0.1:8000/orders/user/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading orders:', error)
        setLoading(false)
      })
  }, [user])

  useEffect(() => {
    if (showOrderToast) {
      const timer = setTimeout(() => {
        navigate('/orders', {
          replace: true,
          state: {},
        })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showOrderToast, navigate])

  if (!user) {
    return (
      <main className="orders-page">
        <div className="orders-empty">
          <h2>Please log in</h2>

          <p>
            You need to be logged in to view your orders.
          </p>

          <Link to="/login" className="orders-button">
            Login
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-loading">
          Loading your orders...
        </div>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <div className="orders-container">

        <div className="orders-heading">
          <p className="orders-brand">
            Urban Threads
          </p>

          <h1>My Orders</h1>

          <p>
            View your previous purchases and delivery details.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No orders yet</h2>

            <p>
              You haven't placed an order yet.
            </p>

            <Link
              to="/products"
              className="orders-button"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <article
                key={order.id}
                className="order-card"
              >

                {/* ORDER HEADER */}

                <div className="order-header">
                  <div>
                    <span className="order-label">
                      Order
                    </span>

                    <h2>
                      #{order.id}
                    </h2>
                  </div>

                  <div className="order-total">
                    <span>Total</span>

                    <strong>
                      £{Number(order.total).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="order-divider"></div>

                {/* ORDER ITEMS */}

                <div className="order-items">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="order-item"
                    >
                      <div className="order-item-info">
                        <h3>
                          {item.name}
                        </h3>

                        <div className="order-item-details">
                          <span>
                            Size: {item.size}
                          </span>

                          <span>
                            Quantity: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="order-item-price">
                        £{(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}

                </div>

                <div className="order-divider"></div>

                {/* DELIVERY */}

                <div className="delivery-details">
                  <h3>
                    Delivery details
                  </h3>

                  <div className="delivery-grid">

                    <div>
                      <span>Name</span>

                      <strong>
                        {order.full_name}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>

                      <strong>
                        {order.phone}
                      </strong>
                    </div>

                    <div className="delivery-address">
                      <span>Address</span>

                      <strong>
                        {order.address}, {order.postcode}
                      </strong>
                    </div>

                  </div>
                </div>

              </article>
            ))}

          </div>
        )}

      </div>
      {showOrderToast && (
        <div className="order-success-toast">
          ✓ Order #{orderId} placed successfully!
        </div>
      )}
    </main>
  )
}

export default Orders
