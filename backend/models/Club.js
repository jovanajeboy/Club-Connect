import mongoose from 'mongoose'

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      default: '🏫'
    },
    logo: {
  type: String,
  default: ''
},

    description: {
      type: String,
      required: true
    },

    objectives: {
      type: [String],
      default: []
    },

    facultyCoordinator: {
      type: String,
      default: ''
    },

    studentCoordinators: {
      type: [String],
      default: []
    },

    skills: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    careers: {
      type: [String],
      default: []
    },

    activities: {
      type: [String],
      default: []
    },

    events: {
      type: [String],
      default: []
    },

    achievements: {
      type: [String],
      default: []
    },

    recruitmentStatus: {
      type: String,
      enum: ['Open', 'Closed', 'Coming Soon'],
      default: 'Closed'
    },

    applicationDeadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const Club = mongoose.model('Club', clubSchema)

export default Club