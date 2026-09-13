import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL
function Register({ onRegistrationComplete, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event) {
    event.preventDefault()

    if (name === '' || email === '' || password === '') {
      alert('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/auth/register`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: 'student'
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Registration failed.')
        setLoading(false)
        return
      }

      /*
        Registration was successful.
        Now log the student in automatically so we get
        the user ID and JWT token.
      */

      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            role: 'student'
          })
        }
      )

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        alert(
          loginData.message ||
          'Account created, but automatic login failed.'
        )

        setLoading(false)
        return
      }

      // Save login information
      localStorage.setItem(
        'clubconnect_token',
        loginData.token
      )

      localStorage.setItem(
        'clubconnect_user',
        JSON.stringify(loginData.user)
      )

      alert('Account created successfully!')

      // Send user information back to App.jsx
      onRegistrationComplete(loginData.user)

    } catch (error) {
      console.error('Registration error:', error)

      alert(
        'Unable to connect to the server. Make sure the backend is running.'
      )
    }

    setLoading(false)
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>Create Account</h1>

          <p>
            Create your ClubConnect student account.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>College Email</label>

            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        <p className="signup-text">

          Already have an account?

          <span onClick={onLogin}>
            Login
          </span>

        </p>

      </div>

    </div>
  )
}

export default Register