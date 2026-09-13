import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.login(email, password)

      const role = response?.user?.role

      if (role === 'patient') {
        navigate('/patient/dashboard')
      } else if (role === 'doctor' || role === 'ayurvedic_doctor') {
        navigate('/doctor/dashboard')
      } else if (role === 'receptionist') {
        navigate('/reception/dashboard')
      } else if (role === 'admin') {
        navigate('/doctor/dashboard')
      } else {
        setError('Unknown user role')
      }

    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Welcome to MediKiosk</h1>
          <p>
            Secure patient case-taking and clinical record management
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="auth-links">

          <p>
            New patient?
            <button
              onClick={() => navigate('/register/patient')}
              className="link-button"
            >
              Create Patient Account
            </button>
          </p>

          <p>
            Medical staff?
            <button
              onClick={() => navigate('/register/staff')}
              className="link-button"
            >
              Register Staff Account
            </button>
          </p>

        </div>

        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to MediKiosk
        </button>

      </div>

    </div>
  )
}