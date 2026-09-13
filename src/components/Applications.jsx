function Applications({ applications, onBack }) {
  return (
    <div className="applications-page">

      <nav className="dashboard-navbar">

        <div className="logo">
          ClubConnect
        </div>

        <div className="nav-links">
          <span onClick={onBack}>
            Dashboard
          </span>

          <span>
            Explore Clubs
          </span>

          <span className="active">
            Applications
          </span>
        </div>

        <div className="profile-icon">
          👤
        </div>

      </nav>

      <main className="applications-content">

        <div className="applications-header">
          <h1>My Applications</h1>

          <p>
            Track the status of your club applications.
          </p>
        </div>

        {applications.length === 0 ? (

          <div className="empty-applications">
            <div className="empty-icon">
              📋
            </div>

            <h2>No Applications Yet</h2>

            <p>
              You haven't applied to any clubs yet.
            </p>

            <button
              className="club-button"
              onClick={onBack}
            >
              Explore Clubs →
            </button>
          </div>

        ) : (

          <div className="applications-list">

            {applications.map((application) => (

              <div
                className="application-card"
                key={application.id}
              >

                <div className="application-club-icon">
                  {application.club.icon}
                </div>

                <div className="application-info">

                  <h2>
                    {application.club.name}
                  </h2>

                  <p>
                    Applied on {application.date}
                  </p>

                  <div className="application-status-row">

                    <span
                      className={`status-badge ${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>

                    {application.interviewDate && (
                      <span className="interview-info">
                        📅 Interview: {application.interviewDate}
                      </span>
                    )}

                  </div>

                </div>

                <button className="view-application-button">
                  View
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Applications