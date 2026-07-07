import Report from '../models/Report.js';

// POST /api/reports
export const createReport = async (req, res, next) => {
  try {
    const { targetType, targetActivity, targetUser, reason, description } = req.body;

    if (targetType === 'Activity' && !targetActivity) {
      return res.status(400).json({ success: false, message: 'targetActivity is required for Activity reports' });
    }
    if (targetType === 'User' && !targetUser) {
      return res.status(400).json({ success: false, message: 'targetUser is required for User reports' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetActivity,
      targetUser,
      reason,
      description,
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};
