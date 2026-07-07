import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    crewCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      required: true,
    },
    activityType: {
      type: String,
      enum: ['Sports', 'Gaming'],
      required: true,
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
    },
    currentPlayers: {
      type: Number,
      default: 1, // host counts as 1
    },
    status: {
      type: String,
      enum: ['Open', 'Full', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Open',
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    minRank: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Virtual for remaining slots
activitySchema.virtual('remainingSlots').get(function () {
  return this.maxPlayers - this.currentPlayers;
});

activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
