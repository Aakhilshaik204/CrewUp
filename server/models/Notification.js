import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'PLAYER_JOINED',
        'PLAYER_LEFT',
        'ACTIVITY_FULL',
        'ACTIVITY_CANCELLED',
        'WAITLIST_PROMOTED',
        'ACTIVITY_STARTING_SOON',
        'REMOVED_FROM_ACTIVITY',
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
