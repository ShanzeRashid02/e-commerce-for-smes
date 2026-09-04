import { useEffect, useState } from 'react'
import {
    Link,
    useNavigate,
    useLocation
} from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Auth.css'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Login() {
    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()
    const location = useLocation()
    const showRegisterToast = location.state?.showRegisterToast

    useEffect(() => {
        if (showRegisterToast) {
            const timer = setTimeout(() => {
                navigate('/login', {
                    replace: true,
                    state: {},
                })
            }, 2500)

            return () => clearTimeout(timer)
        }
    }, [showRegisterToast, navigate])

    const [errorMessage, setErrorMessage] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setErrorMessage(data.detail || 'Login failed')

                setTimeout(() => {
                    setErrorMessage('')
                }, 2500)

                return
            }

            login({
                id: data.user_id,
                name: data.name,
                is_admin: data.is_admin,
            })

            navigate('/', {
                state: {
                    showLoginToast: true,
                },
            })

            setEmail('')
            setPassword('')
        } catch (error) {
            console.error('Login error:', error)

            setErrorMessage('Something went wrong')

            setTimeout(() => {
                setErrorMessage('')
            }, 2500)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <p className="auth-brand">Urban Threads</p>
                    <h1>Welcome back</h1>
                    <p>Sign in to continue shopping.</p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-field">
                        <label htmlFor="email">
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label=
                                    {
                                        showPassword ? 'Hide password' : 'Show password'
                                    }
                            >
                                {showPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                        </div>
                    </div>

                    <button
                        className="auth-submit-button"
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </p>
            </div>
            {showRegisterToast && (
                <div className="login-toast">
                    ✓ Registration successful! Please log in.
                </div>
            )}

            {errorMessage && (
                <div className="login-error-toast">
                    ✕ {errorMessage}
                </div>
            )}
        </main>
    )
}

export default Login
