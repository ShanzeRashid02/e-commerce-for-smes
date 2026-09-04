import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'
import './Cart.css'

function Cart() {
  const items = useCartStore((state) => state.items)

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  )

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  )

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  )

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <p className="cart-label">Urban Threads</p>
          <h1>Your Cart</h1>
          <p>
            {items.length === 0
              ? 'Your cart is currently empty.'
              : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything yet.
            </p>

            <Link to="/products" className="continue-shopping-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <section className="cart-items">
              {items.map((item) => (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}`}
                >
                  <div className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-item-details">
                    <h2>{item.name}</h2>

                    <p className="cart-item-size">
                      Size: {item.size}
                    </p>

                    <p className="cart-item-price">
                      £{item.price.toFixed(2)}
                    </p>

                    <div className="cart-item-actions">
                      <div className="cart-quantity">
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() =>
                              increaseQuantity(item.id, item.size)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            +
                        </button>
                      </div>

                      <button
                        className="remove-item-button"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>

                    {item.quantity >= item.stock && (
                          <span className="cart-stock-limit">
                            Maximum available stock reached
                          </span>
                    )}
                  </div>

                  <div className="cart-line-total">
                    £{(item.price * item.quantity).toFixed(2)}
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="continue-shopping-link"
              >
                Continue Shopping
              </Link>
            </aside>

          </div>
        )}
      </div>
    </main>
  )
}

export default Cart
