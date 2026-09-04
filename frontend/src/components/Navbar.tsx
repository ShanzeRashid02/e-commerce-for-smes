import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Navbar.css'

function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Urban Threads
      </Link>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Cart
        </NavLink>

        {user && (
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            My Orders
          </NavLink>
        )}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Admin
          </NavLink>
        )}
      </div>

      <div className="navbar-account">
        {user ? (
          <>
            <span className="welcome-text">
              Welcome <strong>{user.name}</strong>
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="account-link">
              Login
            </Link>

            <Link to="/register" className="register-button">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
