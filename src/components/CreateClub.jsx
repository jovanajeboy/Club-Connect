import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL
function CreateClub({ onBack, onClubCreated }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🏫')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const [description, setDescription] = useState('')
  const [facultyCoordinator, setFacultyCoordinator] = useState('')
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [careers, setCareers] = useState('')
  const [activities, setActivities] = useState('')

  const [recruitmentStatus, setRecruitmentStatus] =
    useState('Closed')

  const [applicationDeadline, setApplicationDeadline] =
    useState('')

  const [loading, setLoading] = useState(false)

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

  async function handleCreate(event) {
    event.preventDefault()

    if (!name.trim() || !description.trim()) {
      alert('Club name and description are required.')
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
        `${API_URL}/api/clubs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to create club.')
        return
      }

      alert('Club created successfully!')

      onClubCreated(data)
    } catch (error) {
      console.error('Create club error:', error)
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
              <h1>Create Your Club</h1>
              <p>
                Add your club information and start recruiting
                students through ClubConnect.
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
            onSubmit={handleCreate}
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
            </div>

            {/* CLUB PROFILE */}
            <div className="edit-section">
              <h2>Club Profile</h2>

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

                <small>
                  Separate skills with commas.
                </small>
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

                <small>
                  Separate interests with commas.
                </small>
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

                <small>
                  Separate career areas with commas.
                </small>
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

                <small>
                  Separate activities with commas.
                </small>
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
                  ? 'Creating Club...'
                  : 'Create Club'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateClub