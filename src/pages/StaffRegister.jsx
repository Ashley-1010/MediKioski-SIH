import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function StaffRegister() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist'
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (form.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters')
      return
    }

    setLoading(true)

    try {

      const response = await api.registerStaff(form)

      if (response?.access_token) {
        localStorage.setItem(
          'medikiosk_token',
          response.access_token
        )
      }

      if (response?.user) {
        localStorage.setItem(
          'medikiosk_user',
          JSON.stringify(response.user)
        )
      }

      setSuccess('Staff account created successfully.')

      setTimeout(() => {

        if (
          response?.user?.role === 'doctor' ||
          response?.user?.role === 'ayurvedic_doctor'
        ) {
          navigate('/doctor/dashboard')
        } else {
          navigate('/reception/dashboard')
        }

      }, 800)

    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Medical Staff Registration</h1>

          <p>
            Create an account for authorized MediKiosk staff.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                updateField('name', e.target.value)
              }
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField('email', e.target.value)
              }
              placeholder="staff@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Staff Role</label>

            <select
              value={form.role}
              onChange={(e) =>
                updateField('role', e.target.value)
              }
            >
              <option value="doctor">
                Doctor
              </option>

              <option value="receptionist">
                Receptionist
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                updateField('password', e.target.value)
              }
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading
              ? 'Creating Account...'
              : 'Create Staff Account'}
          </button>

        </form>

        <div className="auth-links">

          <p>
            Already registered?

            <button
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Sign In
            </button>
          </p>

        </div>

      </div>

    </div>
  )
}