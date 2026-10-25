import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { authenticator } from '@otplib/v12-adapter'
import QRCode from 'qrcode'
import authenticateToken from '../middleware/authMiddleware.js'

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
    const { email, password, mfaCode } = req.body

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

    
    // Require an authenticator code when MFA is enabled
    if (user.mfaEnabled) {
      if (!/^\d{6}$/.test(String(mfaCode || ''))) {
        return res.status(401).json({
          message: 'Authenticator code required.'
        })
      }

      const userWithMfaSecret = await User.findById(user._id)
        .select('+mfaSecret')

      if (
        !userWithMfaSecret ||
        !userWithMfaSecret.mfaSecret ||
        !authenticator.verify({
          token: String(mfaCode),
          secret: userWithMfaSecret.mfaSecret
        })
      ) {
        return res.status(401).json({
          message: 'Invalid email, password, or authenticator code.'
        })
      }
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
router.put('/profile/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
  return res.status(403).json({
    message: 'You can only update your own profile.'
  })
}
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
// Start TOTP MFA enrollment
router.post('/mfa/setup', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('+mfaSecret +mfaPendingSecret')

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const secret = authenticator.generateSecret()

    user.mfaPendingSecret = secret
    await user.save()

    const otpauth = authenticator.keyuri(
      user.email,
      'ClubConnect',
      secret
    )

    const qrCodeDataUrl = await QRCode.toDataURL(otpauth)

    res.json({
      message: 'Scan the QR code with your authenticator app, then verify the code.',
      qrCode: qrCodeDataUrl
    })
  } catch (error) {
    console.error('MFA setup failed:', error.message)
    res.status(500).json({ message: 'MFA setup failed.' })
  }
})

 // Verify TOTP code and enable MFA
router.post('/mfa/verify-setup', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body

    if (!/^\d{6}$/.test(String(code || ''))) {
      return res.status(400).json({
        message: 'Please provide a valid six-digit code.'
      })
    }

    const user = await User.findById(req.user.userId)
      .select('+mfaSecret +mfaPendingSecret')

    if (!user || !user.mfaPendingSecret) {
      return res.status(400).json({
        message: 'Start MFA setup before verifying a code.'
      })
    }

    const valid = authenticator.verify({
      token: String(code),
      secret: user.mfaPendingSecret
    })

    if (!valid) {
      return res.status(401).json({
        message: 'Invalid authenticator code.'
      })
    }

    user.mfaSecret = user.mfaPendingSecret
    user.mfaPendingSecret = null
    user.mfaEnabled = true

    await user.save()

    res.json({
      message: 'Multi-factor authentication enabled successfully.',
      mfaEnabled: true
    })
  } catch (error) {
    console.error('MFA verification failed:', error.message)
    res.status(500).json({
      message: 'MFA verification failed.'
    })
  }
})

export default router