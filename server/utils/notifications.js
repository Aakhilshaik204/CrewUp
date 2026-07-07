import Notification from '../models/Notification.js';

/**
 * Create a notification and optionally emit via socket.io
 * @param {Object} params
 * @param {string} params.recipientId - MongoDB user ID of recipient
 * @param {string} params.type - Notification type enum
 * @param {string} params.message - Human-readable message
 * @param {string} [params.relatedActivityId] - MongoDB activity ID
 * @param {Object} [params.io] - Socket.io server instance
 */
export const createNotification = async ({ recipientId, type, message, relatedActivityId, io }) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      message,
      ...(relatedActivityId && { relatedActivity: relatedActivityId }),
    });

    // Real-time push via socket.io if io instance is available
    if (io) {
      io.to(`user:${recipientId}`).emit('notification', {
        _id: notification._id,
        type: notification.type,
        message: notification.message,
        relatedActivity: notification.relatedActivity,
        read: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
