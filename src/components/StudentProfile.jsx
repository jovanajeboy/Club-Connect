import { useState } from 'react'
const careerOptions = [
  'Software Engineer',
  'AI / ML Engineer',
  'Data Scientist',
  'Cybersecurity Specialist',
  'Robotics Engineer',
  'UI / UX Designer',
  'Product Manager',
  'Entrepreneur',
  'Researcher',
  'Higher Studies',
  'Not sure yet'
]
const availabilityOptions = [
  '1–2 hours',
  '2–4 hours',
  '4–6 hours',
  '6+ hours'
]

const activityOptions = [
  'Workshops',
  'Hackathons',
  'Competitions',
  'Projects',
  'Research',
  'Event Management',
  'Social Activities',
  'Networking'
]
const technicalInterests = [
  'Artificial Intelligence',
  'Machine Learning',
  'Robotics',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'Internet of Things',
  'Competitive Programming'
]

const nonTechnicalInterests = [
  'Photography',
  'Music',
  'Dance',
  'Sports',
  'Public Speaking',
  'Entrepreneurship',
  'Writing',
  'Social Service',
  'Event Management',
  'Leadership'
]
const availableSkills = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'React',
  'AI / ML',
  'Data Science',
  'Public Speaking',
  'Leadership',
  'Event Management',
  'UI / UX Design',
  'Photography'
]

function StudentProfile({ onProfileComplete }) {
  function handleSkillsContinue() {
  if (skills.length === 0) {
    alert('Please select at least one skill.')
    return
  }

  setStep(3)
}
function handleInterestsContinue() {
  if (interests.length === 0) {
    alert('Please select at least one interest.')
    return
  }

  setStep(4)
}
function handleCareerContinue() {
  if (careerGoal === '') {
    alert('Please select a career aspiration.')
    return
  }

  setStep(5)
}
function handleProfileComplete() {
  if (availability === '') {
    alert('Please select your weekly availability.')
    return
  }

  if (activities.length === 0) {
    alert('Please select at least one preferred activity.')
    return
  }

  onProfileComplete(profile)
}
  function toggleSkill(skill) {
  if (skills.includes(skill)) {
    setSkills(
      skills.filter((item) => item !== skill)
    )
  } else {
    setSkills([...skills, skill])
  }
}
function toggleInterest(interest) {
  if (interests.includes(interest)) {
    setInterests(
      interests.filter((item) => item !== interest)
    )
  } else {
    setInterests([...interests, interest])
  }
}
function toggleActivity(activity) {
  if (activities.includes(activity)) {
    setActivities(
      activities.filter((item) => item !== activity)
    )
  } else {
    setActivities([...activities, activity])
  }
}
  // Which step are we currently on?
  const [step, setStep] = useState(1)

  // Step 1 information
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('')
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [careerGoal, setCareerGoal] = useState('')
  const [availability, setAvailability] = useState('')
  const [activities, setActivities] = useState([])
  
  const profile = {
  branch,
  year,
  skills,
  interests,
  careerGoal,
  availability,
  activities
}

  function handleAcademicContinue(event) {
    event.preventDefault()

    if (branch === '' || year === '') {
      alert('Please select your branch and year.')
      return
    }

    setStep(2)
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* Progress */}
        <div className="progress-section">

          <div className="progress-text">
            Step {step} of 5
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${step * 20}%`
              }}
            ></div>
          </div>

        </div>


        {/* STEP 1 */}
        {step === 1 && (

          <>

            <div className="profile-header">

              <h1>
                Tell us about yourself
              </h1>

              <p>
                This information helps us find clubs
                that are relevant to you.
              </p>

            </div>


            <form
              className="profile-form"
              onSubmit={handleAcademicContinue}
            >

              <div className="form-group">

                <label>
                  Academic Branch
                </label>

                <select
                  value={branch}
                  onChange={(event) =>
                    setBranch(event.target.value)
                  }
                >

                  <option value="">
                    Select your branch
                  </option>

                  <option value="Computer Science and Engineering">
                    Computer Science and Engineering
                  </option>

                  <option value="Information Technology">
                    Information Technology
                  </option>

                  <option value="Electronics and Communication">
                    Electronics and Communication
                  </option>

                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>

                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>

                  <option value="Civil Engineering">
                    Civil Engineering
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Year of Study
                </label>

                <select
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                >

                  <option value="">
                    Select your year
                  </option>

                  <option value="1st Year">
                    1st Year
                  </option>

                  <option value="2nd Year">
                    2nd Year
                  </option>

                  <option value="3rd Year">
                    3rd Year
                  </option>

                  <option value="4th Year">
                    4th Year
                  </option>

                </select>

              </div>


              <button
  className="continue-button"
  onClick={handleSkillsContinue}
>
  Continue →
</button>

            </form>

          </>

        )}


        {/* STEP 2 */}
        {step === 2 && (

          <div>

            <div className="profile-header">

              <h1>
                What are your skills?
              </h1>

              <p>
                Select the skills you currently have.
                You can choose multiple.
              </p>

            </div>


            <div className="skills-container">

  {availableSkills.map((skill) => (

    <button
      key={skill}
      type="button"
      className={
        skills.includes(skill)
          ? 'skill-button selected'
          : 'skill-button'
      }
      onClick={() => toggleSkill(skill)}
    >
      {skills.includes(skill) && '✓ '}
      {skill}
    </button>

  ))
  }

</div>

            <button
              className="continue-button"
              onClick={() => setStep(3)}
            >
              Continue →
            </button>

          </div>

        )}
        {step === 3 && (

  <div>

    <div className="profile-header">

      <h1>
        What are you interested in?
      </h1>

      <p>
        Select the topics and activities that interest you.
      </p>

    </div>


    <div className="interest-section">

      <h2>
        Technical Interests
      </h2>

      <div className="skills-container">

        {technicalInterests.map((interest) => (

          <button
            key={interest}
            type="button"
            className={
              interests.includes(interest)
                ? 'skill-button selected'
                : 'skill-button'
            }
            onClick={() => toggleInterest(interest)}
          >
            {interests.includes(interest) && '✓ '}
            {interest}
          </button>

        ))}

      </div>

    </div>


    <div className="interest-section">

      <h2>
        Non-Technical Interests
      </h2>

      <div className="skills-container">

        {nonTechnicalInterests.map((interest) => (

          <button
            key={interest}
            type="button"
            className={
              interests.includes(interest)
                ? 'skill-button selected'
                : 'skill-button'
            }
            onClick={() => toggleInterest(interest)}
          >
            {interests.includes(interest) && '✓ '}
            {interest}
          </button>

        ))}

      </div>

    </div>


    <button
      className="continue-button"
      onClick={handleInterestsContinue}
    >
      Continue →
    </button>

  </div>

)}
{step === 4 && (

  <div>

    <div className="profile-header">

      <h1>
        What are your career aspirations?
      </h1>

      <p>
        Your career goals help us recommend clubs
        that can support your future.
      </p>

    </div>


    <div className="career-options">

      {careerOptions.map((career) => (

        <button
          key={career}
          type="button"
          className={
            careerGoal === career
              ? 'career-button selected'
              : 'career-button'
          }
          onClick={() => setCareerGoal(career)}
        >

          <span className="career-radio">

            {careerGoal === career ? '●' : '○'}

          </span>

          {career}

        </button>

      ))}

    </div>


    <button
      className="continue-button"
      onClick={handleCareerContinue}
    >
      Continue →
    </button>

  </div>

)}
{step === 5 && (

  <div>

    <div className="profile-header">

      <h1>
        Tell us about your availability
      </h1>

      <p>
        This helps us recommend clubs that fit
        your schedule and interests.
      </p>

    </div>


    {/* Availability */}

    <div className="interest-section">

      <h2>
        Weekly Availability
      </h2>

      <div className="career-options">

        {availabilityOptions.map((option) => (

          <button
            key={option}
            type="button"
            className={
              availability === option
                ? 'career-button selected'
                : 'career-button'
            }
            onClick={() => setAvailability(option)}
          >

            <span className="career-radio">
              {availability === option ? '●' : '○'}
            </span>

            {option}

          </button>

        ))}

      </div>

    </div>


    {/* Activities */}

    <div className="interest-section">

      <h2>
        Preferred Activities
      </h2>

      <p className="section-description">
        What kind of activities would you like to participate in?
      </p>

      <div className="skills-container">

        {activityOptions.map((activity) => (

          <button
            key={activity}
            type="button"
            className={
              activities.includes(activity)
                ? 'skill-button selected'
                : 'skill-button'
            }
            onClick={() => toggleActivity(activity)}
          >

            {activities.includes(activity) && '✓ '}

            {activity}

          </button>

        ))}

      </div>

    </div>


    <button
      className="continue-button"
      onClick={handleProfileComplete}
    >
      Complete Profile ✓
    </button>

  </div>

)}

      </div>

    </div>
  )
}

export default StudentProfile