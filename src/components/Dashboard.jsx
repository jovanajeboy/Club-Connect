
import { useEffect, useState } from 'react'

import {
  calculateClubMatch,
  generateReasons,
  generateOverallExplanation
} from './ExplainableAI'
const API_URL = import.meta.env.VITE_API_URL
function Dashboard({
  profile,
  onViewClub,
  onViewApplications,
  onLeaderDashboard
}) {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // --------------------------------
  // FETCH CLUBS FROM MONGODB
  // --------------------------------

  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/clubs`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load clubs.'
          )
        }

        setClubs(data)
      } catch (error) {
        console.error('Fetch clubs error:', error)

        setError(
          'Unable to load clubs. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  // --------------------------------
  // CREATE AI RECOMMENDATIONS
  // --------------------------------

  const recommendations = clubs
    .map((club) => {
      const match = calculateClubMatch(profile, club)

      return {
        ...club,
        match
      }
    })
    .sort((a, b) => b.match.score - a.match.score)

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div className="logo">
          ClubConnect
        </div>

        <div className="nav-links">

          <span className="active">
            Dashboard
          </span>

          <span>
            Explore Clubs
          </span>

          <span onClick={onViewApplications}>
            Applications
          </span>

        </div>

        <div className="profile-icon">
          👤
        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="dashboard-content">

        {/* WELCOME */}

        <section className="welcome-section">

          <h1>
            Good morning! 👋
          </h1>

          <p>
            Discover clubs that match your interests,
            skills, and career goals.
          </p>

        </section>


        {/* TEMPORARY COORDINATOR BUTTON */}

        <button
          className="leader-test-button"
          onClick={onLeaderDashboard}
        >
          🏫 Club Leader Dashboard
        </button>


        {/* PROFILE SUMMARY */}

        <section className="profile-summary">

          <div>

            <p className="summary-label">
              YOUR PROFILE
            </p>

            <h2>
              Student Profile
            </h2>

            <p className="summary-details">
              {profile?.branch} • {profile?.year}
            </p>

          </div>

          <div className="profile-stats">

            <div>
              <strong>
                {profile?.skills?.length || 0}
              </strong>

              <span>
                Skills
              </span>
            </div>

            <div>
              <strong>
                {profile?.interests?.length || 0}
              </strong>

              <span>
                Interests
              </span>
            </div>

            <div>
              <strong>
                {profile?.careerGoal || '—'}
              </strong>

              <span>
                Career Goal
              </span>
            </div>

          </div>

        </section>


        {/* RECOMMENDATIONS */}

        <section className="recommendation-section">

          <div className="section-heading">

            <div>

              <h2>
                ✨ Recommended for You
              </h2>

              <p>
                Personalized using your skills,
                interests, career goals and activities.
              </p>

            </div>

            <button
              className="view-all-button"
              type="button"
            >
              View all →
            </button>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="loading-message">

              <div className="loading-spinner"></div>

              <p>
                Finding clubs that match your profile...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading && error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}


          {/* NO CLUBS */}

          {!loading &&
            !error &&
            recommendations.length === 0 && (

              <div className="empty-clubs-message">

                <div>
                  🏫
                </div>

                <h3>
                  No clubs available yet
                </h3>

                <p>
                  Club coordinators haven't added any
                  clubs yet. Check back soon!
                </p>

              </div>

            )}


          {/* CLUB CARDS */}

          {!loading &&
            !error &&
            recommendations.length > 0 && (

              <div className="club-grid">

                {recommendations.map((club) => (

                  <div
                    className="club-card"
                    key={club._id}
                  >

                    {/* CLUB IMAGE / ICON */}

                    <div className="club-icon">

                      {club.logo ? (

                        <img
                          src={`${API_URL}${club.logo}`}
                          alt={`${club.name} logo`}
                          className="club-card-logo"
                        />

                      ) : (

                        club.icon || '🏫'

                      )}

                    </div>


                    {/* MATCH SCORE */}

                    <div className="match-badge">

                      {club.match.score}% Match

                    </div>


                    {/* CLUB NAME */}

                    <h3>
                      {club.name}
                    </h3>


                    {/* DESCRIPTION */}

                    <p>
                      {club.description}
                    </p>


                    {/* TAGS */}

                    <div className="club-tags">

                      {(club.interests || [])
                        .slice(0, 3)
                        .map((interest) => (

                          <span key={interest}>
                            {interest}
                          </span>

                        ))}

                    </div>


                    {/* AI EXPLANATION */}

                    <div className="match-explanation">

                      <h4>
                        🤖 Why we recommend this
                      </h4>

                      <p>
                        {generateOverallExplanation(
                          club.match
                        )}
                      </p>


                      {/* PERSONALIZED REASONS */}

                      <ul>

                        {generateReasons(
                          profile,
                          club.match
                        ).map(
                          (reason, index) => (

                            <li key={index}>
                              ✓ {reason}
                            </li>

                          )
                        )}

                      </ul>

                    </div>


                    {/* MATCH BREAKDOWN */}

                    <div className="match-breakdown">

                      <div>

                        <span>
                          Skills
                        </span>

                        <strong>
                          {club.match.skillScore}%
                        </strong>

                      </div>


                      <div>

                        <span>
                          Interests
                        </span>

                        <strong>
                          {club.match.interestScore}%
                        </strong>

                      </div>


                      <div>

                        <span>
                          Career
                        </span>

                        <strong>
                          {club.match.careerScore}%
                        </strong>

                      </div>


                      <div>

                        <span>
                          Activities
                        </span>

                        <strong>
                          {club.match.activityScore}%
                        </strong>

                      </div>

                    </div>


                    {/* VIEW CLUB */}

                    <button
                      className="club-button"
                      onClick={() =>
                        onViewClub(club)
                      }
                    >
                      View Club →
                    </button>

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

    </div>
  )
}

export default Dashboard