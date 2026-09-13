
function calculateSkillScore(profile, club) {
  const studentSkills = profile?.skills || []
  const clubSkills = club?.skills || []

  if (clubSkills.length === 0) {
    return {
      score: 0,
      matched: []
    }
  }

  const matched = studentSkills.filter((skill) =>
    clubSkills.includes(skill)
  )

  const score =
    (matched.length / clubSkills.length) * 100

  return {
    score: Math.min(score, 100),
    matched
  }
}


// --------------------------------------------------
// 2. Calculate Interest Match
// --------------------------------------------------

function calculateInterestScore(profile, club) {
  const studentInterests = profile?.interests || []
  const clubInterests = club?.interests || []

  if (clubInterests.length === 0) {
    return {
      score: 0,
      matched: []
    }
  }

  const matched = studentInterests.filter((interest) =>
    clubInterests.includes(interest)
  )

  const score =
    (matched.length / clubInterests.length) * 100

  return {
    score: Math.min(score, 100),
    matched
  }
}


// --------------------------------------------------
// 3. Calculate Career Match
// --------------------------------------------------

function calculateCareerScore(profile, club) {
  const careerGoal = profile?.careerGoal || ''
  const clubCareers = club?.careers || []

  if (!careerGoal || clubCareers.length === 0) {
    return {
      score: 0,
      matched: false
    }
  }

  const matched = clubCareers.includes(careerGoal)

  return {
    score: matched ? 100 : 0,
    matched
  }
}


// --------------------------------------------------
// 4. Calculate Activity Match
// --------------------------------------------------

function calculateActivityScore(profile, club) {
  const studentActivities = profile?.activities || []
  const clubActivities = club?.activities || []

  if (clubActivities.length === 0) {
    return {
      score: 0,
      matched: []
    }
  }

  const matched = studentActivities.filter((activity) =>
    clubActivities.includes(activity)
  )

  const score =
    (matched.length / clubActivities.length) * 100

  return {
    score: Math.min(score, 100),
    matched
  }
}


// --------------------------------------------------
// 5. Main Recommendation Calculation
// --------------------------------------------------

export function calculateClubMatch(profile, club) {

  const skillResult =
    calculateSkillScore(profile, club)

  const interestResult =
    calculateInterestScore(profile, club)

  const careerResult =
    calculateCareerScore(profile, club)

  const activityResult =
    calculateActivityScore(profile, club)


  /*
    Weighted recommendation formula:

    Skills      → 30%
    Interests   → 30%
    Career      → 25%
    Activities  → 15%
  */

  const score =
    skillResult.score * 0.30 +
    interestResult.score * 0.30 +
    careerResult.score * 0.25 +
    activityResult.score * 0.15


  return {
    score: Math.round(score),

    skillScore: Math.round(skillResult.score),

    interestScore:
      Math.round(interestResult.score),

    careerScore:
      Math.round(careerResult.score),

    activityScore:
      Math.round(activityResult.score),

    matchedSkills:
      skillResult.matched,

    matchedInterests:
      interestResult.matched,

    careerMatch:
      careerResult.matched,

    matchedActivities:
      activityResult.matched
  }
}


// --------------------------------------------------
// 6. Generate Personalized Reasons
// --------------------------------------------------

export function generateReasons(profile, match) {

  const reasons = []


  // Skill explanation

  if (match.matchedSkills.length > 0) {

    reasons.push(
      `Your skill${match.matchedSkills.length > 1 ? 's' : ''} ` +
      `${match.matchedSkills.join(', ')} ` +
      `match${match.matchedSkills.length > 1 ? '' : 'es'} ` +
      `the club's required skills.`
    )
  }


  // Interest explanation

  if (match.matchedInterests.length > 0) {

    reasons.push(
      `Your interest${match.matchedInterests.length > 1 ? 's' : ''} ` +
      `in ${match.matchedInterests.join(', ')} ` +
      `align${match.matchedInterests.length > 1 ? '' : 's'} ` +
      `with this club.`
    )
  }


  // Career explanation

  if (match.careerMatch) {

    reasons.push(
      `This club aligns with your career goal of ` +
      `${profile.careerGoal}.`
    )
  }


  // Activity explanation

  if (match.matchedActivities.length > 0) {

    reasons.push(
      `Your preferred activit${match.matchedActivities.length > 1 ? 'ies' : 'y'} ` +
      `${match.matchedActivities.join(', ')} ` +
      `match${match.matchedActivities.length > 1 ? '' : 'es'} ` +
      `this club's activities.`
    )
  }


  // No strong matches

  if (reasons.length === 0) {

    reasons.push(
      'This club has limited overlap with your current profile, ' +
      'but you can still explore it to discover new interests.'
    )
  }


  return reasons
}


// --------------------------------------------------
// 7. Overall Explanation
// --------------------------------------------------

export function generateOverallExplanation(match) {

  if (match.score >= 80) {

    return (
      'Strong match! This club closely aligns with ' +
      'your skills, interests, career goals, and activities.'
    )
  }


  if (match.score >= 60) {

    return (
      'Good match! This club aligns with several ' +
      'important parts of your profile.'
    )
  }


  if (match.score >= 40) {

    return (
      'Moderate match. This club has some areas ' +
      'that align with your profile.'
    )
  }


  return (
    'Limited match. You may still explore this club ' +
    'if you want to develop new skills or interests.'
  )
}