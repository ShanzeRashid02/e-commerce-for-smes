import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { imageMap } from '../utils/productImages'
import './ProductDetails.css'

type Product = {
    id: number
    name: string
    price: number
    description: string
    image: string
    stock: number
}

function ProductDetails() {
    const { id } = useParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [selectedSize, setSelectedSize] = useState('XS')
    const [showToast, setShowToast] = useState(false)
    const [isZoomOpen, setIsZoomOpen] = useState(false)

    const addToCart = useCartStore((state) => state.addToCart)
    const cartItems = useCartStore((state) => state.items)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
    }, [id])

    if (!product) {
        return <p>Loading product...</p>
    }

    const quantityInCart = cartItems
        .filter((item) => item.id === product.id)
        .reduce(
            (total, item) => total + item.quantity,
            0
        )

    const remainingStock = Math.max(
        product.stock - quantityInCart,
        0
    )

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    const handleAddToCart = () => {
        if (remainingStock === 0) {
            return
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: imageMap[product.image],
            size: selectedSize,
            quantity: 1,
            stock: product.stock,
        })

        setShowToast(true)

        setTimeout(() => {
            setShowToast(false)
        }, 2500)
    }

    return (
        <>
            <main className="product-details-page">
                <div className="product-details-container">

                    <div className="product-image-section">
                        <div className="product-image-wrapper">
                            <img
                                src={imageMap[product.image]}
                                alt={product.name}
                                className="product-details-image"
                                onClick={() => setIsZoomOpen(true)}
                            />
                        </div>
                    </div>

                    <div className="product-info-section">
                        <p className="product-brand">Urban Threads</p>

                        <h1>{product.name}</h1>

                        <p className="product-price">
                            £{product.price.toFixed(2)}
                        </p>

                        <div className="product-stock">
                            {remainingStock === 0 ? (
                                <span className="product-out-of-stock">
                                    Out of stock
                                </span>
                            ) : remainingStock <= 5 ? (
                                <span className="product-low-stock">
                                    Only {remainingStock} left
                                </span>
                            ) : (
                                <span className="product-in-stock">
                                    In stock
                                </span>
                            )}
                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-divider"></div>

                        <div className="product-option">
                            <label htmlFor="size">
                                Choose size
                            </label>

                            <select
                                id="size"
                                value={selectedSize}
                                onChange={(event) =>
                                    setSelectedSize(event.target.value)
                                }
                            >
                                {sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={remainingStock === 0}
                        >
                            {remainingStock === 0
                                ? 'Out of Stock'
                                : 'Add to Cart'}
                        </button>

                        <p className="delivery-note">
                            Free standard delivery on selected orders.
                        </p>
                    </div>

                </div>
            </main>

            {isZoomOpen && (
                <div
                    className="image-modal-overlay"
                    onClick={() => setIsZoomOpen(false)}
                >
                    <div
                        className="image-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-modal-button"
                            onClick={() => setIsZoomOpen(false)}
                        >
                            ✕
                        </button>

                        <img
                            src={imageMap[product.image]}
                            alt={product.name}
                            className="zoomed-product-image"
                        />
                    </div>
                </div>
            )}

            {showToast && (
                <div className="toast-notification">
                    <span>✓ Item added to cart successfully!</span>

                    <Link
                        to="/cart"
                        className="toast-cart-link"
                    >
                        View Cart
                    </Link>
                </div>
            )}
        </>
    )
}

export default ProductDetails
