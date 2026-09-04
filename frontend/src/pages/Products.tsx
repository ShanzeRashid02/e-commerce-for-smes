import ProductCard from '../components/ProductCard'
import './Products.css'
import { useEffect, useState } from 'react'
import { imageMap } from '../utils/productImages'

type Product = {
    id: number,
    name: string,
    price: number,
    image: string
}

function Products() {
    const [ products, setProducts ] = useState<Product[]>([])
    useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
        .then((response) => response.json())
        .then((data) => {
        setProducts(data)
        })
        .catch((error) => {
        console.error('Error loading products:', error)
        })
    }, [])
     return (
        <main className='products-page'>
        <h2>Our Products</h2>

        <div className='products-grid'>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={imageMap[product.image]}
                />
            ))}
        </div>
        </main>
    )
}

export default Products
