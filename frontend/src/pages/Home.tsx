import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Home.css'
import heroImage from '../assets/hero-fashion.jpg'

function Home() {
    const location = useLocation()
    const navigate = useNavigate()

    const showLoginToast = location.state?.showLoginToast

    useEffect(() => {
        if (showLoginToast) {
            const timer = setTimeout(() => {
                navigate('/', {
                    replace: true,
                    state: {},
                })
            }, 2500)

            return () => clearTimeout(timer)
        }
    }, [showLoginToast, navigate])

    return (
        <div className="home-page">
            <main className="hero">
                <div className="hero-content">
                <h1>
                    Style made
                    <br />
                    simple.
                </h1>

                <p>
                    Everyday fashion for everyone.
                    <br />
                    Clean looks. Simple shopping.
                </p>

                <Link to="/products" className="shop-button">
                    Shop Now <span>→</span>
                </Link>
                </div>

                <div className="hero-image-container">
                <img
                    src={heroImage}
                    alt="Urban Threads fashion"
                    className="hero-image"
                />
                </div>
            </main>

            <footer className="home-footer">
                © {new Date().getFullYear()} Urban Threads
            </footer>

            {showLoginToast && (
                <div className="login-toast">
                    ✓ Login successful!
                </div>
            )}
        </div>
    )
}

export default Home
