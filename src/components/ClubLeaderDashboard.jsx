function ClubLeaderDashboard({
  club,
  onBack,
  onCreateClub,
  onEditClub,
  onDeleteClub
}) {
  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <h1>Coordinator Dashboard</h1>

            <p>
              Manage your club and recruitment activities.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={onBack}
          >
            Logout
          </button>

        </div>

        {!club ? (
          <div className="empty-club-card">

            <div className="empty-club-icon">
              🏫
            </div>

            <h2>No Club Created Yet</h2>

            <p>
              Create your club profile to start recruiting students
              through ClubConnect.
            </p>

            <button
              className="primary-button"
              onClick={onCreateClub}
            >
              + Create New Club
            </button>

          </div>
        ) : (
          <div className="coordinator-club-card">

            <div className="club-card-header">

              <div className="club-title">

                <div className="club-icon">
                  {club.icon || '🏫'}
                </div>

                <div>
                  <h2>{club.name}</h2>

                  <span
                    className={`status-badge ${club.recruitmentStatus
                      ?.toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {club.recruitmentStatus}
                  </span>
                </div>

              </div>

              <div className="club-action-buttons">
  <button className="edit-button" onClick={onEditClub}>
    ✏️ Edit Club Details
  </button>

  <button
    className="delete-button"
    onClick={onDeleteClub}
  >
    🗑️ Delete Club
  </button>
</div>

            </div>

            <p className="club-description">
              {club.description}
            </p>

            <div className="coordinator-stats">

              <div className="stat-card">
                <strong>
                  {club.skills?.length || 0}
                </strong>

                <span>Required Skills</span>
              </div>

              <div className="stat-card">
                <strong>
                  {club.interests?.length || 0}
                </strong>

                <span>Interest Areas</span>
              </div>

              <div className="stat-card">
                <strong>
                  {club.activities?.length || 0}
                </strong>

                <span>Activities</span>
              </div>

              <div className="stat-card">
                <strong>
                  {club.events?.length || 0}
                </strong>

                <span>Events</span>
              </div>

            </div>

            <div className="club-information">

              <h3>Club Information</h3>

              <div className="information-grid">

                <div>
                  <span>Faculty Coordinator</span>
                  <strong>
                    {club.facultyCoordinator || 'Not provided'}
                  </strong>
                </div>

                <div>
                  <span>Application Deadline</span>
                  <strong>
                    {club.applicationDeadline
                      ? new Date(
                          club.applicationDeadline
                        ).toLocaleDateString()
                      : 'Not set'}
                  </strong>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}

export default ClubLeaderDashboard