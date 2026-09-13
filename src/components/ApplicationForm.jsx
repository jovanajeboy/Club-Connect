function ApplicationForm({ club, profile, onBack, onSubmit }) {
  return (
    <div className="application-page">

      <nav className="dashboard-navbar">
        <div className="logo">ClubConnect</div>

        <div className="nav-links">
          <span>Dashboard</span>
          <span>Explore Clubs</span>
          <span className="active">Application</span>
        </div>

        <div className="profile-icon">
          👤
        </div>
      </nav>

      <main className="application-content">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Club
        </button>

        <div className="application-header">
          <div className="large-club-icon">
            {club.icon}
          </div>

          <div>
            <h1>Apply to {club.name}</h1>
            <p>
              Complete the application below to join this club.
            </p>
          </div>
        </div>

        <form
          className="application-form"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >

          <div className="form-section">

            <h2>Personal Information</h2>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              required
            />

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-section">

            <h2>Academic Information</h2>

            <label>
              Branch
            </label>

            <input
              type="text"
              value={profile.branch}
              readOnly
            />

            <label>
              Year
            </label>

            <input
              type="text"
              value={profile.year}
              readOnly
            />

          </div>

          <div className="form-section">

            <h2>Why do you want to join?</h2>

            <textarea
              placeholder="Tell the club why you are interested..."
              rows="5"
              required
            />

          </div>

          <div className="form-section">

            <h2>Relevant Skills</h2>

            <div className="application-skills">

              {profile.skills.map((skill) => (
                <span key={skill}>
                  {skill}
                </span>
              ))}

            </div>

          </div>

          <div className="form-section">

            <h2>Previous Experience</h2>

            <textarea
              placeholder="Describe any relevant projects, competitions, internships, or experience..."
              rows="5"
            />

          </div>

          <button
            type="submit"
            className="submit-application-button"
          >
            Submit Application →
          </button>

        </form>

      </main>

    </div>
  )
}

export default ApplicationForm