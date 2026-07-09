import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', ''],
      default: '',
    },
    interests: {
      sports: {
        type: [String],
        default: [],
      },
      gaming: {
        type: [String],
        default: [],
      },
    },
    gamingProfiles: [
      {
        game: {
          type: String,
          required: true,
        },
        inGameId: {
          type: String,
          required: true,
          trim: true,
        },
        inGameCode: {
          type: String,
          trim: true,
          default: '',
        },
        rank: {
          type: String,
          trim: true,
          default: '',
        },
      }
    ],
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
