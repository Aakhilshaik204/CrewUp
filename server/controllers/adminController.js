import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Report from '../models/Report.js';
import Participant from '../models/Participant.js';
import Notification from '../models/Notification.js';

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v');

    res.json({ success: true, users, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/ban
export const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot ban an admin' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, user });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/activities
export const getAllActivities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Activity.countDocuments();
    const activities = await Activity.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, activities, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/activities/:id
export const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    await Participant.deleteMany({ activity: req.params.id });
    await Notification.deleteMany({ relatedActivity: req.params.id });

    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports
export const getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('targetActivity', 'title')
      .populate('targetUser', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, reports, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/reports/:id
export const updateReport = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalActivities, openActivities, pendingReports, categoryStats] = await Promise.all([
      User.countDocuments(),
      Activity.countDocuments(),
      Activity.countDocuments({ status: 'Open' }),
      Report.countDocuments({ status: 'Pending' }),
      Activity.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    let distribution = [];
    if (totalActivities > 0) {
      let top3Count = 0;
      const top3 = categoryStats.slice(0, 3).map(c => {
        top3Count += c.count;
        return { name: c._id || 'Unknown', percentage: Math.round((c.count / totalActivities) * 100) };
      });
      
      const othersCount = totalActivities - top3Count;
      if (othersCount > 0) {
        top3.push({ name: 'Others', percentage: Math.round((othersCount / totalActivities) * 100) });
      }
      distribution = top3;
    } else {
      distribution = [
        { name: 'Cricket', percentage: 0 },
        { name: 'Football', percentage: 0 },
        { name: 'Tennis', percentage: 0 },
        { name: 'Others', percentage: 0 },
      ];
    }

    res.json({ success: true, stats: { totalUsers, totalActivities, openActivities, pendingReports, distribution } });
  } catch (error) {
    next(error);
  }
};
