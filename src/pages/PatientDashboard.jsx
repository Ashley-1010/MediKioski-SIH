import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function PatientDashboard() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [patient, setPatient] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const storedUser =
      localStorage.getItem('medikiosk_user')

    if (!storedUser) {
      navigate('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)

      if (parsedUser.role !== 'patient') {
        navigate('/login')
        return
      }

      setUser(parsedUser)

      loadPatientData(parsedUser)

    } catch {
      localStorage.removeItem('medikiosk_user')
      navigate('/login')
    }

  }, [navigate])


  const loadPatientData = async (currentUser) => {

    try {

      setLoading(true)
      setError('')

      const patientCode =
        currentUser.patient_code

      if (!patientCode) {
        setError(
          'Patient record is not linked to this account.'
        )
        return
      }

      const patientResponse =
        await api.getPatient(patientCode)

      setPatient(patientResponse)

      const historyResponse =
        await api.getPatientHistory(patientCode)

      setHistory(
        Array.isArray(historyResponse)
          ? historyResponse
          : historyResponse?.history || []
      )

    } catch (err) {

      setError(
        err.message ||
        'Unable to load patient information'
      )

    } finally {

      setLoading(false)

    }
  }


  const logout = () => {

    localStorage.removeItem('medikiosk_token')
    localStorage.removeItem('medikiosk_user')

    navigate('/login')

  }


  if (loading) {

    return (
      <div className="dashboard-page">

        <div className="dashboard-loading">
          Loading your patient portal...
        </div>

      </div>
    )

  }


  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div>

          <h1>MediKiosk</h1>

          <p>
            Patient Portal
          </p>

        </div>

        <div className="dashboard-actions">

          <span>
            {user?.name}
          </span>

          <button
            onClick={logout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        <section className="welcome-section">

          <h2>
            Welcome, {patient?.full_name || user?.name}
          </h2>

          <p>
            Manage your MediKiosk records and visit information.
          </p>

        </section>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <section className="patient-summary">

          <div className="info-card">

            <span className="card-label">
              Patient ID
            </span>

            <strong>
              {patient?.patient_code || 'N/A'}
            </strong>

          </div>


          <div className="info-card">

            <span className="card-label">
              Full Name
            </span>

            <strong>
              {patient?.full_name || 'N/A'}
            </strong>

          </div>


          <div className="info-card">

            <span className="card-label">
              Total Visits
            </span>

            <strong>
              {history.length}
            </strong>

          </div>

        </section>


        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Visit History
              </h2>

              <p>
                Your previous MediKiosk visits
              </p>

            </div>

          </div>


          {history.length === 0 ? (

            <div className="empty-state">
              No visit records available.
            </div>

          ) : (

            <div className="visit-list">

              {history.map((visit, index) => (

                <div
                  className="visit-card"
                  key={visit.id || index}
                >

                  <div>

                    <strong>
                      {visit.registration_id ||
                        `Visit ${index + 1}`}
                    </strong>

                    <p>
                      {visit.visit_date ||
                        'Date unavailable'}
                    </p>

                  </div>


                  <span className="status-badge">

                    {visit.status ||
                      'Recorded'}

                  </span>

                </div>

              ))}

            </div>

          )}

        </section>


        <section className="dashboard-section">

          <h2>
            Patient Services
          </h2>

          <div className="service-grid">

            <button
              className="service-card"
              onClick={() =>
                navigate('/patient/registration')
              }
            >

              <h3>
                New Registration
              </h3>

              <p>
                Start a new patient case.
              </p>

            </button>


            <div className="service-card">

              <h3>
                Medical Reports
              </h3>

              <p>
                View reports made available to you.
              </p>

            </div>


            <div className="service-card">

              <h3>
                Visit Status
              </h3>

              <p>
                Track the status of your current visit.
              </p>

            </div>

          </div>

        </section>


        <section className="privacy-notice">

          <h3>
            Privacy & Security
          </h3>

          <p>
            Your account only displays patient information
            intended for patient access. Internal doctor notes,
            clinical assessments and other restricted records
            are protected by role-based access control.
          </p>

        </section>

      </main>

    </div>
  )
}