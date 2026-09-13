import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Student registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Please provide name, email, password and role.'
      })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Registration failed.',
      error: error.message
    })
  }
})
// Student login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password.'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      })
    }

    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '7d'
  }
)

res.json({
  message: 'Login successful!',
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    clubId: user.clubId
  }
})

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Login failed.',
      error: error.message
    })
  }
})
router.put('/profile/:id', async (req, res) => {
  try {
    const {
      branch,
      year,
      skills,
      interests,
      careerGoal,
      availability,
      activities
    } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        profile: {
          branch,
          year,
          skills,
          interests,
          careerGoal,
          availability,
          activities
        }
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      })
    }

    res.json({
      message: 'Profile saved successfully!',
      profile: user.profile
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to save profile.',
      error: error.message
    })
  }
})
export default router