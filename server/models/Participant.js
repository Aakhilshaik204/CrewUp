import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
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

// Prevent duplicate joins
participantSchema.index({ activity: 1, user: 1 }, { unique: true });

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;
