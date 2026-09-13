import { useState } from 'react'
import './App.css'
import Register from './components/Register'
import StudentProfile from './components/StudentProfile'
import Dashboard from './components/Dashboard'
import ClubDetails from './components/ClubDetails'
import ApplicationForm from './components/ApplicationForm'
import Applications from './components/Applications'
import ClubLeaderDashboard from './components/ClubLeaderDashboard'
import EditClub from './components/EditClub'
import CreateClub from './components/CreateClub'
const API_URL = import.meta.env.VITE_API_URL
function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [page, setPage] = useState('role-selection')

  const [studentProfile, setStudentProfile] = useState(null)
  const [selectedClub, setSelectedClub] = useState(null)
  const [applications, setApplications] = useState([])
  const [userId, setUserId] = useState(null)
  const [coordinatorClub, setCoordinatorClub] = useState(null)

  // -----------------------------
  // ROLE SELECTION
  // -----------------------------

  if (page === 'role-selection') {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-header">
            <h1>ClubConnect</h1>

            <p>
              Welcome! Choose how you want to continue.
            </p>
          </div>

          <div className="role-selection">

            <button
  type="button"
  onClick={() => setPage('student-login')}
>
  <div className="role-icon">🎓</div>

  <strong>Student</strong>

  <span>
    Find clubs and apply to opportunities
  </span>
</button>

            <button
  type="button"
  onClick={() => setPage('coordinator-login')}
>
  <div className="role-icon">🏫</div>

  <strong>Club Coordinator</strong>

  <span>
    Manage your club and recruitment
  </span>
</button>

          </div>

        </div>

      </div>
    )
  }

  // -----------------------------
  // STUDENT LOGIN
  // -----------------------------

  if (page === 'student-login') {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-header">
            <h1>Student Login</h1>

            <p>
              Login to find clubs that match your interests and goals.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleStudentLogin}
          >

            <div className="form-group">
              <label>College Email</label>

              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button type="submit">
              Login
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?

            <span onClick={() => setPage('register')}>
              Create one
            </span>
          </p>

          <p className="signup-text">
            <span onClick={() => setPage('role-selection')}>
              ← Back
            </span>
          </p>

        </div>

      </div>
    )
  }

  // -----------------------------
  // STUDENT REGISTRATION
  // -----------------------------

  if (page === 'register') {
    return (
      <Register
  onRegistrationComplete={(user) => {
    setUserId(user.id)
    setStudentProfile(user.profile || null)
    setPage('profile')
  }}
  onLogin={() => setPage('login')}
/>
    )
  }

  // -----------------------------
  // STUDENT PROFILE
  // -----------------------------

  if (page === 'profile') {
    return (
      <StudentProfile
        onProfileComplete={async (profile) => {
          try {
            const response = await fetch(
              `${API_URL}/api/auth/profile/${userId}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
              }
            )

            const data = await response.json()

            if (!response.ok) {
              alert(data.message || 'Failed to save profile.')
              return
            }

            setStudentProfile(data.profile)
            setPage('dashboard')

          } catch (error) {
            console.error('Profile save error:', error)
            alert('Unable to connect to the server.')
          }
        }}
      />
    )
  }

  // -----------------------------
  // STUDENT DASHBOARD
  // -----------------------------

  if (page === 'dashboard') {
    return (
      <Dashboard
        profile={studentProfile}

        onViewClub={(club) => {
          setSelectedClub(club)
          setPage('club')
        }}

        onViewApplications={() => {
          setPage('applications')
        }}

        onLeaderDashboard={() => {
          setPage('role-selection')
        }}
      />
    )
  }

  // -----------------------------
  // CLUB DETAILS
  // -----------------------------

  if (page === 'club') {
    return (
      <ClubDetails
        club={selectedClub}
        onBack={() => setPage('dashboard')}
        onApply={() => setPage('application')}
      />
    )
  }

  // -----------------------------
  // APPLICATION FORM
  // -----------------------------

  if (page === 'application') {
    return (
      <ApplicationForm
        club={selectedClub}
        profile={studentProfile}

        onBack={() => setPage('club')}

        onSubmit={() => {

          const newApplication = {
            id: Date.now(),
            club: selectedClub,
            status: 'Submitted',
            date: new Date().toLocaleDateString(),
            interviewDate: null
          }

          setApplications([
            ...applications,
            newApplication
          ])

          alert('Application submitted successfully!')

          setPage('applications')
        }}
      />
    )
  }

  // -----------------------------
  // APPLICATIONS
  // -----------------------------

  if (page === 'applications') {
    return (
      <Applications
        applications={applications}
        onBack={() => setPage('dashboard')}
      />
    )
  }

  // -----------------------------
  // COORDINATOR LOGIN
  // -----------------------------

  if (page === 'coordinator-login') {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-header">
            <h1>Coordinator Login</h1>

            <p>
              Login to manage your club and recruitment.
            </p>
          </div>

          <form
  className="login-form"
  onSubmit={handleCoordinatorLogin}
>
            <div className="form-group">
              <label>College Email</label>

              <input
  type="email"
  placeholder="coordinator@college.edu"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
  type="password"
  placeholder="Enter your password"
  value={password}
  onChange={(event) => setPassword(event.target.value)}
/>
            </div>

            <button type="submit">
  Login
</button>
          </form>

          <p className="signup-text">
            <span onClick={() => setPage('role-selection')}>
              ← Back
            </span>
          </p>

        </div>

      </div>
    )
  }

  // -----------------------------
  // COORDINATOR DASHBOARD
  // TEMPORARY
  // -----------------------------
if (page === 'create-club') {
  return (
    <CreateClub
      onBack={() => setPage('leader')}
      onClubCreated={(club) => {
  setCoordinatorClub(club)
  setSelectedClub(club)
  setPage('leader')
}}
    />
  )
}
  
if (page === 'leader') {
  return (
    <ClubLeaderDashboard
      club={coordinatorClub}

      onBack={() => {
        localStorage.removeItem('clubconnect_token')
        localStorage.removeItem('clubconnect_user')
        setCoordinatorClub(null)
        setPage('role-selection')
      }}

      onCreateClub={() => setPage('create-club')}

      onEditClub={() => {
        setSelectedClub(coordinatorClub)
        setPage('edit-club')
      }}

      onDeleteClub={async () => {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${coordinatorClub?.name}"?`
        )

        if (!confirmed) {
          return
        }

        try {
          const token = localStorage.getItem(
            'clubconnect_token'
          )

          const response = await fetch(
            `${API_URL}/api/clubs/${coordinatorClub._id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const data = await response.json()

          if (!response.ok) {
            throw new Error(
              data.message || 'Failed to delete club.'
            )
          }

          alert('Club deleted successfully.')

          setCoordinatorClub(null)
          setSelectedClub(null)
          setPage('leader')
        } catch (error) {
          console.error('Delete club error:', error)

          alert(
            error.message ||
            'Failed to delete club. Please try again.'
          )
        }
      }}
    />
  )
}
  // -----------------------------
  // EDIT CLUB
  // -----------------------------

  if (page === 'edit-club') {
  return (
    <EditClub
      club={coordinatorClub}
      onBack={() => setPage('leader')}
      onSave={(updatedClub) => {
        setCoordinatorClub(updatedClub)
        setSelectedClub(updatedClub)
        setPage('leader')
      }}
    />
  )
}

  // -----------------------------
  // STUDENT LOGIN FUNCTION
  // -----------------------------

  async function handleStudentLogin(event) {
    event.preventDefault()

    if (email === '' || password === '') {
      alert('Please enter your email and password.')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Login failed.')
        return
      }

      // Make sure this account is actually a student
      if (data.user.role !== 'student') {
        alert('This account is not registered as a student.')
        return
      }

      console.log('Logged in student:', data.user)

      setUserId(data.user.id)

      setStudentProfile(data.user.profile)

      const profile = data.user.profile

      const hasProfile =
        profile &&
        profile.branch &&
        profile.year &&
        profile.skills?.length > 0 &&
        profile.interests?.length > 0 &&
        profile.careerGoal &&
        profile.availability &&
        profile.activities?.length > 0

      if (hasProfile) {
        setPage('dashboard')
      } else {
        setPage('profile')
      }

    } catch (error) {
      console.error('Login error:', error)

      alert('Unable to connect to the server.')
    }
  }

  // Fallback
  async function handleCoordinatorLogin(event) {
  event.preventDefault()

  if (email === '' || password === '') {
    alert('Please enter your email and password.')
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Login failed.')
      return
    }

    // Make sure this is actually a coordinator
    if (data.user.role !== 'coordinator') {
      alert('This account is not registered as a club coordinator.')
      return
    }

    console.log('Logged in coordinator:', data.user)

    setUserId(data.user.id)
    if (data.user.clubId) {
  try {
    const clubResponse = await fetch(
      `${API_URL}/api/clubs/${data.user.clubId}`
    )

    if (clubResponse.ok) {
      const clubData = await clubResponse.json()
      setCoordinatorClub(clubData)
    }
  } catch (error) {
    console.error('Failed to load coordinator club:', error)
  }
} else {
  setCoordinatorClub(null)
}

localStorage.setItem('clubconnect_token', data.token)

localStorage.setItem(
  'clubconnect_user',
  JSON.stringify(data.user)
)

setPage('leader')

  } catch (error) {
    console.error('Coordinator login error:', error)

    alert('Unable to connect to the server.')
  }
}
  return null
}

export default App