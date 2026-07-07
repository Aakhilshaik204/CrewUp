import Message from '../models/Message.js';
import Participant from '../models/Participant.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join personal notification room
    socket.on('joinUserRoom', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined personal room`);
    });

    // Join activity chat room
    socket.on('joinActivityRoom', (activityId) => {
      socket.join(`activity:${activityId}`);
      console.log(`Socket ${socket.id} joined activity room: ${activityId}`);
    });

    // Leave activity chat room
    socket.on('leaveActivityRoom', (activityId) => {
      socket.leave(`activity:${activityId}`);
      console.log(`Socket ${socket.id} left activity room: ${activityId}`);
    });

    // Send chat message
    socket.on('sendMessage', async ({ activityId, senderId, senderName, senderImage, content }) => {
      try {
        if (!content || !content.trim()) return;

        // Verify sender is a participant
        const isParticipant = await Participant.findOne({ activity: activityId, user: senderId });
        if (!isParticipant) {
          socket.emit('error', { message: 'You must be a participant to chat' });
          return;
        }

        const message = await Message.create({
          activity: activityId,
          sender: senderId,
          content: content.trim(),
        });

        const messageData = {
          _id: message._id,
          activity: activityId,
          sender: {
            _id: senderId,
            name: senderName,
            profileImage: senderImage,
          },
          content: message.content,
          createdAt: message.createdAt,
        };

        // Broadcast to everyone in the room
        io.to(`activity:${activityId}`).emit('newMessage', messageData);
      } catch (error) {
        console.error('Socket sendMessage error:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
