import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL
function EditClub({ club, onBack, onSave }) {
  const [name, setName] = useState(club?.name || '')
  const [icon, setIcon] = useState(club?.icon || '🏫')
  const [logo, setLogo] = useState(null)

  const [description, setDescription] = useState(
    club?.description || ''
  )

  const [facultyCoordinator, setFacultyCoordinator] = useState(
    club?.facultyCoordinator || ''
  )

  const [studentCoordinators, setStudentCoordinators] = useState(
    club?.studentCoordinators?.join(', ') || ''
  )

  const [objectives, setObjectives] = useState(
    club?.objectives?.join(', ') || ''
  )

  const [skills, setSkills] = useState(
    club?.skills?.join(', ') || ''
  )

  const [interests, setInterests] = useState(
    club?.interests?.join(', ') || ''
  )

  const [careers, setCareers] = useState(
    club?.careers?.join(', ') || ''
  )

  const [activities, setActivities] = useState(
    club?.activities?.join(', ') || ''
  )

  const [events, setEvents] = useState(
    club?.events?.join(', ') || ''
  )

  const [achievements, setAchievements] = useState(
    club?.achievements?.join(', ') || ''
  )

  const [recruitmentStatus, setRecruitmentStatus] = useState(
    club?.recruitmentStatus || 'Closed'
  )

  const [applicationDeadline, setApplicationDeadline] = useState(
    club?.applicationDeadline
      ? new Date(club.applicationDeadline)
          .toISOString()
          .split('T')[0]
      : ''
  )

  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(
    club?.logo
      ? `${API_URL}/api/clubs/${club._id}`
      : null
  )

  function handleLogoChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG, JPEG or PNG image.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setLogo(file)

    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  function convertToArray(value) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  async function handleSave(event) {
    event.preventDefault()

    if (!name.trim() || !description.trim()) {
      alert('Club name and description are required.')
      return
    }

    if (!club?._id) {
      alert('Club information is missing.')
      return
    }

    const token = localStorage.getItem('clubconnect_token')

    if (!token) {
      alert('Please login again.')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('name', name.trim())
      formData.append('icon', icon.trim() || '🏫')
      formData.append('description', description.trim())
      formData.append(
        'facultyCoordinator',
        facultyCoordinator.trim()
      )

      formData.append(
        'studentCoordinators',
        JSON.stringify(convertToArray(studentCoordinators))
      )

      formData.append(
        'objectives',
        JSON.stringify(convertToArray(objectives))
      )

      formData.append(
        'skills',
        JSON.stringify(convertToArray(skills))
      )

      formData.append(
        'interests',
        JSON.stringify(convertToArray(interests))
      )

      formData.append(
        'careers',
        JSON.stringify(convertToArray(careers))
      )

      formData.append(
        'activities',
        JSON.stringify(convertToArray(activities))
      )

      formData.append(
        'events',
        JSON.stringify(convertToArray(events))
      )

      formData.append(
        'achievements',
        JSON.stringify(convertToArray(achievements))
      )

      formData.append(
        'recruitmentStatus',
        recruitmentStatus
      )

      if (applicationDeadline) {
        formData.append(
          'applicationDeadline',
          applicationDeadline
        )
      }

      if (logo) {
        formData.append('logo', logo)
      }

      const response = await fetch(
        "${API_URL}/api/clubs/${club._id}",
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update club.')
        return
      }

      alert('Club details updated successfully!')

      onSave(data)
    } catch (error) {
      console.error('Update club error:', error)
      alert('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="edit-club-card">

          {/* HEADER */}
          <div className="edit-club-header">
            <div>
              <h1>Edit Club Details</h1>
              <p>
                Update your club information and recruitment
                details.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              ← Back
            </button>
          </div>

          <form
            className="edit-club-form"
            onSubmit={handleSave}
          >

            {/* LOGO */}
            <div className="edit-section">
              <h2>Club Logo</h2>

              <div className="logo-editor">

                <div className="logo-preview-box">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Club logo preview"
                      className="club-logo-preview"
                    />
                  ) : (
                    <div className="logo-placeholder">
                      {icon || '🏫'}
                    </div>
                  )}
                </div>

                <div className="logo-editor-content">
                  <h3>Upload Club Logo</h3>

                  <p>
                    Add a professional logo for your club.
                  </p>

                  <span className="logo-help-text">
                    JPG, JPEG or PNG · Maximum 5 MB
                  </span>

                  <label className="upload-button">
                    Choose Image

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleLogoChange}
                      hidden
                    />
                  </label>

                  {logo && (
                    <span className="selected-file">
                      Selected: {logo.name}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* BASIC INFORMATION */}
            <div className="edit-section">
              <h2>Basic Information</h2>

              <div className="edit-grid">

                <div className="form-group">
                  <label>Club Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter club name"
                  />
                </div>

                <div className="form-group">
                  <label>Club Icon</label>

                  <input
                    type="text"
                    value={icon}
                    onChange={(event) =>
                      setIcon(event.target.value)
                    }
                    placeholder="🤖"
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe your club..."
                  rows="5"
                />
              </div>
            </div>

            {/* PEOPLE */}
            <div className="edit-section">
              <h2>People</h2>

              <div className="form-group">
                <label>Faculty Coordinator</label>

                <input
                  type="text"
                  value={facultyCoordinator}
                  onChange={(event) =>
                    setFacultyCoordinator(
                      event.target.value
                    )
                  }
                  placeholder="Dr. Faculty Name"
                />
              </div>

              <div className="form-group">
                <label>Student Coordinators</label>

                <input
                  type="text"
                  value={studentCoordinators}
                  onChange={(event) =>
                    setStudentCoordinators(
                      event.target.value
                    )
                  }
                  placeholder="Student 1, Student 2"
                />

                <small>
                  Separate names with commas.
                </small>
              </div>
            </div>

            {/* CLUB PROFILE */}
            <div className="edit-section">
              <h2>Club Profile</h2>

              <div className="form-group">
                <label>Objectives</label>

                <textarea
                  value={objectives}
                  onChange={(event) =>
                    setObjectives(event.target.value)
                  }
                  placeholder="Innovation, teamwork, research"
                />

                <small>
                  Separate objectives with commas.
                </small>
              </div>

              <div className="form-group">
                <label>Required Skills</label>

                <input
                  type="text"
                  value={skills}
                  onChange={(event) =>
                    setSkills(event.target.value)
                  }
                  placeholder="Python, C++, React"
                />
              </div>

              <div className="form-group">
                <label>Interests</label>

                <input
                  type="text"
                  value={interests}
                  onChange={(event) =>
                    setInterests(event.target.value)
                  }
                  placeholder="AI, Robotics, Web Development"
                />
              </div>

              <div className="form-group">
                <label>Career Areas</label>

                <input
                  type="text"
                  value={careers}
                  onChange={(event) =>
                    setCareers(event.target.value)
                  }
                  placeholder="AI / ML Engineer, Researcher"
                />
              </div>

              <div className="form-group">
                <label>Activities</label>

                <input
                  type="text"
                  value={activities}
                  onChange={(event) =>
                    setActivities(event.target.value)
                  }
                  placeholder="Projects, Workshops, Hackathons"
                />
              </div>
            </div>

            {/* EVENTS */}
            <div className="edit-section">
              <h2>Events & Achievements</h2>

              <div className="form-group">
                <label>Events</label>

                <input
                  type="text"
                  value={events}
                  onChange={(event) =>
                    setEvents(event.target.value)
                  }
                  placeholder="Hackathon 2026, AI Workshop"
                />
              </div>

              <div className="form-group">
                <label>Achievements</label>

                <textarea
                  value={achievements}
                  onChange={(event) =>
                    setAchievements(event.target.value)
                  }
                  placeholder="Competition wins, awards, milestones"
                />
              </div>
            </div>

            {/* RECRUITMENT */}
            <div className="edit-section">
              <h2>Recruitment</h2>

              <div className="edit-grid">

                <div className="form-group">
                  <label>Recruitment Status</label>

                  <select
                    value={recruitmentStatus}
                    onChange={(event) =>
                      setRecruitmentStatus(
                        event.target.value
                      )
                    }
                  >
                    <option value="Open">
                      Open
                    </option>

                    <option value="Coming Soon">
                      Coming Soon
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>

                  <input
                    type="date"
                    value={applicationDeadline}
                    onChange={(event) =>
                      setApplicationDeadline(
                        event.target.value
                      )
                    }
                  />
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="edit-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={onBack}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? 'Saving Changes...'
                  : 'Save Club Details'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditClub