import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['student', 'coordinator'],
      required: true
    },

    profile: {
      branch: {
        type: String,
        default: ''
      },

      year: {
        type: String,
        default: ''
      },

      skills: {
        type: [String],
        default: []
      },

      interests: {
        type: [String],
        default: []
      },

      careerGoal: {
        type: String,
        default: ''
      },

      availability: {
        type: String,
        default: ''
      },

      activities: {
        type: [String],
        default: []
      }
    },

    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      default: null
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

export default User