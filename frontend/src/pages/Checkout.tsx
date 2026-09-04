import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import './Checkout.css'

function Checkout() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const items = useCartStore((state) => state.items)
    const clearCart = useCartStore((state) => state.clearCart)

    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [postcode, setPostcode] = useState('')
    const [phone, setPhone] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    if (!user) {
        return (
            <main className="checkout-page">
                <div className="checkout-login-message">
                    <h2>Checkout</h2>

                    <p>
                        You need to log in before checking out.
                    </p>

                    <Link to="/login" className="checkout-login-button">
                        Go to Login
                    </Link>
                </div>
            </main>
        )
    }

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        full_name: fullName,
                        address,
                        postcode,
                        phone,
                        total,
                        items: items.map((item) => ({
                            product_id: item.id,
                            name: item.name,
                            price: item.price,
                            size: item.size,
                            quantity: item.quantity,
                        })),
                    }),
                }
            )

            const data = await response.json()
            
            if (!response.ok) {
                setErrorMessage(data.detail || 'Order could not be placed')

                setTimeout(() => {
                    setErrorMessage('')
                }, 2500)

                return
            }

            clearCart()

            navigate('/order-confirmation', {
                state: {
                    orderId: data.order_id,
                    items,
                    total,
                    fullName,
                    address,
                    postcode,
                    phone,
                },
            })  

            setFullName('')
            setAddress('')
            setPostcode('')
            setPhone('')
        } catch (error) {
            console.error('Order error:', error)

            setErrorMessage('Something went wrong')

            setTimeout(() => {
                setErrorMessage('')
            }, 2500)
        }
    }

    return (
        <main className="checkout-page">
            <div className="checkout-container">

                <div className="checkout-heading">
                    <p className="checkout-brand">
                        Urban Threads
                    </p>

                    <h1>Checkout</h1>

                    <p>
                        Welcome, <strong>{user.name}</strong>
                    </p>
                </div>

                <div className="checkout-layout">

                    <section className="checkout-form-card">
                        <h2>Delivery Details</h2>

                        <form
                            className="checkout-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="checkout-field">
                                <label htmlFor="fullName">
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label htmlFor="address">
                                    Address
                                </label>

                                <input
                                    id="address"
                                    type="text"
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="checkout-form-row">
                                <div className="checkout-field">
                                    <label htmlFor="postcode">
                                        Postcode
                                    </label>

                                    <input
                                        id="postcode"
                                        type="text"
                                        placeholder="e.g. B1 1AA"
                                        value={postcode}
                                        onChange={(event) =>
                                            setPostcode(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="phone">
                                        Phone
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="place-order-button"
                            >
                                Place Order
                            </button>
                        </form>
                    </section>

                    <aside className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div className="checkout-summary-items">
                            {items.map((item) => (
                                <div
                                    className="checkout-summary-item"
                                    key={`${item.id}-${item.size}`}
                                >
                                    <div>
                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            Size: {item.size} · Qty: {item.quantity}
                                        </span>
                                    </div>

                                    <span>
                                        £{(
                                            item.price * item.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary-divider"></div>

                        <div className="checkout-summary-row">
                            <span>Subtotal</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>

                        <div className="checkout-summary-divider"></div>

                        <div className="checkout-total">
                            <span>Total</span>
                            <strong>
                                £{total.toFixed(2)}
                            </strong>
                        </div>
                    </aside>

                </div>
            </div>
            {errorMessage && (
                <div className="checkout-error-toast">
                    ✕ {errorMessage}
                </div>
            )}
        </main>
    )
}

export default Checkout
