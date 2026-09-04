import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
              setErrorMessage(data.detail || 'Registration failed')
                setTimeout(() => {
                    setErrorMessage('')
                }, 2500)

                return
            }

            navigate('/login', {
                state: {
                    showRegisterToast: true,
                },
            })

            setName('')
            setEmail('')
            setPassword('')
        } catch (error) {
            console.error('Registration error:', error)

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
                    <h1>Create an account</h1>
                    <p>Join Urban Threads and start shopping.</p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-field">
                        <label htmlFor="name">
                            Full name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />
                    </div>

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
                                placeholder="Create a password"
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
                        Register
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">Login</Link>
                </p>
            </div>
            {errorMessage && (
              <div className="register-error-toast">
                  ✕ {errorMessage}
              </div>
            )}
        </main>
    )
}

export default Register
