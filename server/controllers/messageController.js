import Message from '../models/Message.js';

// GET /api/activities/:id/messages
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ activity: req.params.id })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};
