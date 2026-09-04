import { Link } from 'react-router-dom'

type ProductCardProps = {
    id: number
    name: string
    price: number
    image: string
}

function ProductCard({ id, name, price, image }: ProductCardProps) {
    return (
        <div className='product-card'>
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p>£{price}</p>

            <Link to={`/products/${id}`}>
                <button>View Product</button>
            </Link>
        </div>
    )
}

export default ProductCard
