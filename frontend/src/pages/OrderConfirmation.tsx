import { Link, useLocation } from 'react-router-dom'
import './OrderConfirmation.css'

type OrderItem = {
    id: number
    name: string
    price: number
    size: string
    quantity: number
}

type OrderConfirmationState = {
    orderId: number
    items: OrderItem[]
    total: number
    fullName: string
    address: string
    postcode: string
    phone: string
}

function OrderConfirmation() {
    const location = useLocation()

    const state = location.state as OrderConfirmationState | null

    if (!state) {
        return (
            <main className="confirmation-page">
                <div className="confirmation-card confirmation-empty">
                    <h1>No order information found</h1>

                    <p>
                        Please return to the products page and place an order.
                    </p>

                    <Link
                        to="/products"
                        className="confirmation-primary-button"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        )
    }

    const {
        orderId,
        items,
        total,
        fullName,
        address,
        postcode,
        phone,
    } = state

    return (
        <main className="confirmation-page">
            <div className="confirmation-container">

                <section className="confirmation-card">

                    <div className="confirmation-header">
                        <div className="confirmation-check">
                            ✓
                        </div>

                        <p className="confirmation-brand">
                            Urban Threads
                        </p>

                        <h1>
                            Your order has been confirmed!
                        </h1>

                        <p className="confirmation-subtitle">
                            Thank you for your purchase.
                        </p>

                        <p className="confirmation-order-number">
                            Order #{orderId}
                        </p>
                    </div>

                    <div className="confirmation-divider"></div>

                    <section className="confirmation-section">
                        <h2>Order Summary</h2>

                        <div className="confirmation-items">
                            {items.map((item) => (
                                <div
                                    className="confirmation-item"
                                    key={`${item.id}-${item.size}`}
                                >
                                    <div className="confirmation-item-info">
                                        <h3>
                                            {item.name}
                                        </h3>

                                        <div className="confirmation-item-meta">
                                            <span>
                                                Size: {item.size}
                                            </span>

                                            <span>
                                                Quantity: {item.quantity}
                                            </span>
                                        </div>
                                    </div>

                                    <strong>
                                        £{(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="confirmation-divider"></div>

                    <div className="confirmation-total">
                        <span>Total</span>

                        <strong>
                            £{Number(total).toFixed(2)}
                        </strong>
                    </div>

                    <div className="confirmation-divider"></div>

                    <section className="confirmation-section">
                        <h2>Delivery Details</h2>

                        <div className="confirmation-delivery-grid">
                            <div>
                                <span>Name</span>
                                <strong>{fullName}</strong>
                            </div>

                            <div>
                                <span>Phone</span>
                                <strong>{phone}</strong>
                            </div>

                            <div className="confirmation-address">
                                <span>Address</span>

                                <strong>
                                    {address}, {postcode}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <div className="confirmation-actions">
                        <Link
                            to="/orders"
                            className="confirmation-primary-button"
                        >
                            View My Orders
                        </Link>

                        <Link
                            to="/products"
                            className="confirmation-secondary-button"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                </section>

            </div>
        </main>
    )
}

export default OrderConfirmation
