import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Admin.css'

type Product = {
    id: number
    name: string
    price: number
    description: string
    image: string
    stock: number
}

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
    user_id: number
    full_name: string
    address: string
    postcode: string
    phone: string
    total: number
    items: OrderItem[]
}

function Admin() {
    const user = useAuthStore((state) => state.user)

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [showAddForm, setShowAddForm] = useState(false)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [stock, setStock] = useState('')
    const [orders, setOrders] = useState<Order[]>([])
    const [ordersLoading, setOrdersLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await fetch(
            'http://127.0.0.1:8000/products'
            )

            if (!response.ok) {
            throw new Error('Failed to fetch products')
            }

            const data = await response.json()

            setProducts(data)
        } catch (error) {
            console.error('Admin product error:', error)
            setError('Could not load products')
        } finally {
            setLoading(false)
        }
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
            const response = await fetch(
                'http://127.0.0.1:8000/orders'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch orders')
            }

            const data = await response.json()

            setOrders(data)
            } catch (error) {
            console.error('Admin orders error:', error)
            } finally {
            setOrdersLoading(false)
            }
        }

        fetchOrders()
        }, [])

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!user.is_admin) {
        return <Navigate to="/" replace />
    }

    const handleAddProduct = async (
        event: React.FormEvent
        ) => {
        event.preventDefault()

        try {
            const url = editingProduct
            ? `http://127.0.0.1:8000/products/${editingProduct.id}`
            : 'http://127.0.0.1:8000/products'

            const response = await fetch(url, {
            method: editingProduct ? 'PUT' : 'POST',

            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                name,
                price: Number(price),
                description,
                image,
                stock: Number(stock),
            }),
            })

            const data = await response.json()

            if (!response.ok) {
            throw new Error(
                data.detail || 'Could not save product'
            )
            }

            if (editingProduct) {
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                product.id === editingProduct.id
                    ? data
                    : product
                )
            )
            } else {
            setProducts((currentProducts) => [
                ...currentProducts,
                data,
            ])
            }

            setName('')
            setPrice('')
            setDescription('')
            setImage('')
            setStock('')

            setEditingProduct(null)
            setShowAddForm(false)
            setError('')
        } catch (error) {
            console.error('Save product error:', error)
            setError('Could not save product')
        }
        }

    const handleEditClick = (product: Product) => {
            setEditingProduct(product)

            setName(product.name)
            setPrice(String(product.price))
            setDescription(product.description)
            setImage(product.image)
            setStock(String(product.stock))

            setShowAddForm(true)
            }

        const handleDeleteProduct = async () => {
            if (!productToDelete) {
                return
            }

            try {
                const response = await fetch(
                `http://127.0.0.1:8000/products/${productToDelete.id}`,
                {
                    method: 'DELETE',
                }
                )

                const data = await response.json()

                if (!response.ok) {
                throw new Error(
                    data.detail || 'Could not delete product'
                )
                }

                setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                    product.id !== productToDelete.id
                )
                )

                setProductToDelete(null)
                setError('')
            } catch (error) {
                console.error('Delete product error:', error)
                setError('Could not delete product')
            }
            }

    return (
        <main className="admin-page">
        <div className="admin-container">

            <div className="admin-header">
            <div>
                <p className="admin-label">
                Urban Threads
                </p>

                <h1>Admin Dashboard</h1>

                <p>
                Welcome, <strong>{user.name}</strong>
                </p>
            </div>

            <button
                className="admin-add-button"
                onClick={() => {
                    setEditingProduct(null)
                    setName('')
                    setPrice('')
                    setDescription('')
                    setImage('')
                    setStock('')
                    setShowAddForm(true)
                }}
            >
                + Add Product
            </button>
            </div>

            {showAddForm && (
            <section className="admin-add-form-card">
                <div className="admin-add-form-header">
                    <h2>
                        {editingProduct ? 'Edit Product' : 'Add Product'}
                    </h2>

                    <button
                        type="button"
                        className="admin-close-button"
                        onClick={() => {
                            setShowAddForm(false)
                            setEditingProduct(null)
                            setName('')
                            setPrice('')
                            setDescription('')
                            setImage('')
                            setStock('')
                        }}
                    >
                        ✕
                    </button>
                </div>

                <form
                className="admin-add-form"
                onSubmit={handleAddProduct}
                >
                <div className="admin-form-field">
                    <label htmlFor="productName">
                    Product Name
                    </label>

                    <input
                    id="productName"
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    placeholder="e.g. Black Jacket"
                    required
                    />
                </div>

                <div className="admin-form-field">
                    <label htmlFor="productPrice">
                    Price
                    </label>

                    <input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(event) =>
                        setPrice(event.target.value)
                    }
                    placeholder="49.99"
                    required
                    />
                </div>

                    <div className="admin-form-field">
                        <label htmlFor="productStock">
                            Stock
                        </label>

                        <input
                            id="productStock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(event) =>
                            setStock(event.target.value)
                            }
                            placeholder="e.g. 25"
                            required
                        />
                    </div>

                <div className="admin-form-field">
                    <label htmlFor="productDescription">
                    Description
                    </label>

                    <textarea
                    id="productDescription"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Product description"
                    required
                    />
                </div>

                <div className="admin-form-field">
                    <label htmlFor="productImage">
                    Image Key
                    </label>

                    <input
                    id="productImage"
                    type="text"
                    value={image}
                    onChange={(event) =>
                        setImage(event.target.value)
                    }
                    placeholder="e.g. hoodie"
                    required
                    />
                </div>

                <div className="admin-form-actions">
                    <button
                        type="button"
                        className="admin-cancel-button"
                        onClick={() => {
                            setShowAddForm(false)
                            setEditingProduct(null)
                            setName('')
                            setPrice('')
                            setDescription('')
                            setImage('')
                            setStock('')
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="admin-save-button"
                        >
                            {editingProduct ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
                </form>
            </section>
            )}

            <section className="admin-section">
                <div className="admin-section-header">
                    <h2>Products</h2>

                    <span>
                    {products.length} products
                    </span>
                </div>

                {loading && (
                    <p className="admin-message">
                    Loading products...
                    </p>
                )}

                {error && (
                    <p className="admin-error">
                    {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="admin-products-table">
                        <div className="admin-table-header">
                            <span>ID</span>
                            <span>Product</span>
                            <span>Price</span>
                            <span>Stock</span>
                            <span>Description</span>
                            <span>Actions</span>
                        </div>

                    {products.map((product) => (
                        <div
                        className="admin-product-row"
                        key={product.id}
                        >
                        <span>
                            #{product.id}
                        </span>

                        <strong>
                            {product.name}
                        </strong>

                        <span>
                            £{Number(product.price).toFixed(2)}
                        </span>

                        <span
                                className={
                                    product.stock === 0
                                    ? 'stock-badge out-of-stock'
                                    : product.stock <= 5
                                    ? 'stock-badge low-stock'
                                    : 'stock-badge in-stock'
                                }
                                >
                                {product.stock === 0
                                    ? 'Out of stock'
                                    : product.stock <= 5
                                    ? `${product.stock} Low`
                                    : `${product.stock} In stock`}
                            </span>

                        <span className="admin-description">
                            {product.description}
                        </span>

                        <div className="admin-actions">
                            <button
                                className="admin-edit-button"
                                onClick={() => handleEditClick(product)}
                                >
                                    Edit
                            </button>

                            <button
                                className="admin-delete-button"
                                onClick={() => setProductToDelete(product)}
                            >
                                Delete
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </section>

        </div>
        

        {productToDelete && (
            <div className="delete-modal-overlay">
                <div className="delete-modal">
                <div className="delete-modal-icon">
                    !
                </div>

                <h2>Delete Product?</h2>

                <p>
                    Are you sure you want to delete{' '}
                    <strong>
                    {productToDelete.name}
                    </strong>
                    ?
                </p>

                <p className="delete-modal-warning">
                    This action cannot be undone.
                </p>

                <div className="delete-modal-actions">
                    <button
                    type="button"
                    className="delete-modal-cancel"
                    onClick={() =>
                        setProductToDelete(null)
                    }
                    >
                    Cancel
                    </button>

                    <button
                    type="button"
                    className="delete-modal-confirm"
                    onClick={handleDeleteProduct}
                    >
                    Delete Product
                    </button>
                </div>
                </div>
            </div>
            )}
        </main>
    )
}

export default Admin
