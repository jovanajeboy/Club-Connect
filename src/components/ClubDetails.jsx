function ClubDetails({ club, onBack, onApply }) {
  return (
    <div className="club-details-page">

      <nav className="dashboard-navbar">
        <div className="logo">ClubConnect</div>

        <div className="nav-links">
          <span onClick={onBack}>Dashboard</span>
          <span className="active">Club Details</span>
          <span>Applications</span>
        </div>

        <div className="profile-icon">
          👤
        </div>
      </nav>

      <main className="club-details-content">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <section className="club-header">

          <div className="large-club-icon">
            {club.icon}
          </div>

          <div>
            <h1>{club.name}</h1>

            <p>
              {club.description}
            </p>

            <span className="recruitment-status">
              🟢 Recruitment Open
            </span>
          </div>

        </section>

        <div className="club-details-grid">

          <section className="details-card">

            <h2>About the Club</h2>

            <p>
              {club.description}
            </p>

          </section>

          <section className="details-card">

            <h2>Objectives</h2>

            <ul>
              <li>Develop practical technical skills</li>
              <li>Encourage teamwork and innovation</li>
              <li>Participate in competitions and projects</li>
              <li>Provide opportunities for students to learn</li>
            </ul>

          </section>

          <section className="details-card">

            <h2>Faculty Coordinator</h2>

            <p className="coordinator-name">
              Dr. Faculty Coordinator
            </p>

            <p>
              Department of Computer Science
            </p>

          </section>

          <section className="details-card">

            <h2>Student Coordinators</h2>

            <p>Rahul Sharma — President</p>
            <p>Ananya Singh — Vice President</p>
            <p>Arjun Kumar — Technical Lead</p>

          </section>

          <section className="details-card">

            <h2>Required Skills</h2>

            <div className="club-tags">
              {club.skills.map((skill) => (
                <span key={skill}>
                  {skill}
                </span>
              ))}
            </div>

          </section>

          <section className="details-card">

            <h2>Achievements</h2>

            <ul>
              <li>Winner of Inter-College Innovation Challenge</li>
              <li>Participated in National Tech Fest</li>
              <li>Developed multiple student projects</li>
            </ul>

          </section>

        </div>

        <section className="events-card">

          <h2>Upcoming Events</h2>

          <div className="event-item">
            <div>
              <h3>Club Orientation</h3>
              <p>Introduction to the club and its activities</p>
            </div>

            <strong>15 Sept 2026</strong>
          </div>

          <div className="event-item">
            <div>
              <h3>Technical Workshop</h3>
              <p>Hands-on workshop for new members</p>
            </div>

            <strong>20 Sept 2026</strong>
          </div>

        </section>

        <section className="recruitment-card">

          <div>
            <h2>Recruitment</h2>

            <p>
              Recruitment is currently open.
            </p>

            <p>
              Application deadline: <strong>25 Sept 2026</strong>
            </p>
          </div>

          <button
  className="apply-button"
  onClick={onApply}
>
  Apply Now →
</button>

        </section>

      </main>

    </div>
  )
}

export default ClubDetails