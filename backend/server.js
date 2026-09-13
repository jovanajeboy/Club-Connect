import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import Club from './models/Club.js'
import authenticateToken from './middleware/authMiddleware.js'
import User from './models/User.js'
import multer from 'multer'
const PORT = process.env.PORT || 5000
const app = express()

// --------------------------------
// MULTER FILE UPLOAD CONFIGURATION
// --------------------------------

const storage = multer.diskStorage({
  destination: 'uploads/',

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      file.originalname.replace(/\s+/g, '-')

    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Only JPG, JPEG and PNG images are allowed.'
        )
      )
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

// --------------------------------
// MIDDLEWARE
// --------------------------------

app.use(cors())
app.use(express.json())

// Serve uploaded images
app.use(
  '/uploads',
  express.static('uploads')
)

// Authentication routes
app.use(
  '/api/auth',
  authRoutes
)

// --------------------------------
// HOME ROUTE
// --------------------------------

app.get('/', (req, res) => {
  res.send('ClubConnect Backend is running!')
})

// --------------------------------
// GET ALL CLUBS
// --------------------------------
// This is used by the Student Dashboard
// for AI recommendations.

app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find()
      .sort({ createdAt: -1 })

    res.json(clubs)

  } catch (error) {
    console.error(
      'Fetch clubs error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch clubs.',
      error: error.message
    })
  }
})

// --------------------------------
// GET ONE CLUB
// --------------------------------

app.get('/api/clubs/:id', async (req, res) => {
  try {
    const club = await Club.findById(
      req.params.id
    )

    if (!club) {
      return res.status(404).json({
        message: 'Club not found.'
      })
    }

    res.json(club)

  } catch (error) {
    console.error(
      'Fetch club error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch club.',
      error: error.message
    })
  }
})

// --------------------------------
// CREATE CLUB
// --------------------------------

app.post(
  '/api/clubs',
  authenticateToken,
  upload.single('logo'),

  async (req, res) => {
    try {

      // Only coordinators can create clubs
      if (req.user.role !== 'coordinator') {
        return res.status(403).json({
          message:
            'Only club coordinators can create clubs.'
        })
      }

      // Check whether this coordinator
      // already has a club
      const user = await User.findById(
        req.user.userId
      )

      if (!user) {
        return res.status(404).json({
          message: 'Coordinator not found.'
        })
      }

      if (user.clubId) {
        return res.status(400).json({
          message:
            'You already have a club assigned to your account.'
        })
      }

      // Create club data
      const clubData = {

        name: req.body.name,

        icon:
          req.body.icon ||
          '🏫',

        description:
          req.body.description,

        facultyCoordinator:
          req.body.facultyCoordinator,

        skills: req.body.skills
          ? JSON.parse(req.body.skills)
          : [],

        interests: req.body.interests
          ? JSON.parse(req.body.interests)
          : [],

        careers: req.body.careers
          ? JSON.parse(req.body.careers)
          : [],

        activities: req.body.activities
          ? JSON.parse(req.body.activities)
          : [],

        recruitmentStatus:
          req.body.recruitmentStatus ||
          'Closed',

        applicationDeadline:
          req.body.applicationDeadline ||
          undefined,

        logo: req.file
          ? `/uploads/${req.file.filename}`
          : ''
      }

      const club =
        await Club.create(clubData)

      // Link the club to the coordinator
      await User.findByIdAndUpdate(
        req.user.userId,
        {
          clubId: club._id
        }
      )

      res.status(201).json(club)

    } catch (error) {

      console.error(
        'Create club error:',
        error
      )

      res.status(500).json({
        message:
          'Failed to create club.',
        error: error.message
      })
    }
  }
)

// --------------------------------
// EDIT CLUB
// --------------------------------

app.put(
  '/api/clubs/:id',

  authenticateToken,

  upload.single('logo'),

  async (req, res) => {

    try {

      // Only coordinators can edit clubs
      if (req.user.role !== 'coordinator') {
        return res.status(403).json({
          message:
            'Only club coordinators can edit clubs.'
        })
      }

      // Find coordinator
      const user =
        await User.findById(
          req.user.userId
        )

      if (!user) {
        return res.status(404).json({
          message:
            'Coordinator not found.'
        })
      }

      // Coordinator can only edit
      // their own club
      if (
        !user.clubId ||
        user.clubId.toString() !==
          req.params.id
      ) {
        return res.status(403).json({
          message:
            'You can only edit your own club.'
        })
      }

      // Build update data
      const updateData = {

        name:
          req.body.name,

        icon:
          req.body.icon ||
          '🏫',

        description:
          req.body.description,

        facultyCoordinator:
          req.body.facultyCoordinator,

        studentCoordinators:
          req.body.studentCoordinators
            ? JSON.parse(
                req.body.studentCoordinators
              )
            : [],

        objectives:
          req.body.objectives
            ? JSON.parse(
                req.body.objectives
              )
            : [],

        skills:
          req.body.skills
            ? JSON.parse(
                req.body.skills
              )
            : [],

        interests:
          req.body.interests
            ? JSON.parse(
                req.body.interests
              )
            : [],

        careers:
          req.body.careers
            ? JSON.parse(
                req.body.careers
              )
            : [],

        activities:
          req.body.activities
            ? JSON.parse(
                req.body.activities
              )
            : [],

        events:
          req.body.events
            ? JSON.parse(
                req.body.events
              )
            : [],

        achievements:
          req.body.achievements
            ? JSON.parse(
                req.body.achievements
              )
            : [],

        recruitmentStatus:
          req.body.recruitmentStatus,

        applicationDeadline:
          req.body.applicationDeadline ||
          undefined
      }

      // If a new logo was uploaded
      // replace the old logo
      if (req.file) {
        updateData.logo =
          `/uploads/${req.file.filename}`
      }

      const updatedClub =
        await Club.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators: true
          }
        )

      if (!updatedClub) {
        return res.status(404).json({
          message:
            'Club not found.'
        })
      }

      res.json(updatedClub)

    } catch (error) {

      console.error(
        'Update club error:',
        error
      )

      res.status(500).json({
        message:
          'Failed to update club.',
        error: error.message
      })
    }
  }
)
// DELETE a club
app.delete('/api/clubs/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({
        message: 'Only coordinators can delete clubs.'
      })
    }

    const club = await Club.findById(req.params.id)

    if (!club) {
      return res.status(404).json({
        message: 'Club not found.'
      })
    }

    const coordinator = await User.findById(req.user.userId)

    if (!coordinator) {
      return res.status(404).json({
        message: 'Coordinator not found.'
      })
    }

    if (
      !coordinator.clubId ||
      coordinator.clubId.toString() !== club._id.toString()
    ) {
      return res.status(403).json({
        message: 'You can only delete your own club.'
      })
    }

    await Club.findByIdAndDelete(req.params.id)

    // Remove the deleted club reference from the coordinator
    coordinator.clubId = null
    await coordinator.save()

    res.json({
      message: 'Club deleted successfully.'
    })
  } catch (error) {
    console.error('Delete club error:', error)

    res.status(500).json({
      message: 'Failed to delete club.'
    })
  }
})

// --------------------------------
// START SERVER
// --------------------------------


console.log(
  'MongoDB URI loaded:',
  !!process.env.MONGO_URI
)

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      'MongoDB connected successfully!'
    )

    app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `Server running on port ${PORT}`
    )
  }
)

  })

  .catch((error) => {

    console.error(
      'MongoDB connection failed:'
    )

    console.error(
      error.message
    )
  })