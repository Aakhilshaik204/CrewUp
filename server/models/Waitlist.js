import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    inGameId: {
      type: String,
      trim: true,
    },
    rank: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

waitlistSchema.index({ activity: 1, user: 1 }, { unique: true });
waitlistSchema.index({ activity: 1, position: 1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);
export default Waitlist;
