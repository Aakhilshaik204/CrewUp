import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Participant from '../models/Participant.js';

// Permanent admin emails — loaded from ADMIN_EMAILS env variable
// Format: comma-separated list e.g. "a@b.com,c@d.com"
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// POST /api/users/sync
// Sync Clerk user to MongoDB on every login (Google OAuth + Email signup both go through here)
export const syncUser = async (req, res, next) => {
  try {
    const { clerkId, name, email, profileImage } = req.body;

    if (!clerkId || !name || !email) {
      return res.status(400).json({ success: false, message: 'clerkId, name, and email are required' });
    }

    // Check if this email is a permanent admin
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    // Build update — always refresh name/email/profileImage
    // role: only force to 'admin' if they're in the admin list; never downgrade an existing admin
    const update = {
      $set: {
        name,
        email,
        profileImage: profileImage || '',
        ...(isAdmin ? { role: 'admin' } : {}),
      },
      $setOnInsert: {
        // Only set role on brand-new accounts (upsert insert)
        ...(!isAdmin ? { role: 'student' } : {}),
      },
    };

    const user = await User.findOneAndUpdate(
      { clerkId },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
// Accepts both MongoDB _id AND Clerk clerkId (user_xxx format)
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // If ID looks like a Clerk ID (starts with 'user_'), query by clerkId
    const query = id.startsWith('user_') ? { clerkId: id } : { _id: id };
    const user = await User.findOne(query).select('-__v');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['branch', 'year', 'interests', 'gamingProfiles'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id/activities?type=created|joined
// Accepts both MongoDB _id AND Clerk clerkId (user_xxx format)
export const getUserActivities = async (req, res, next) => {
  try {
    const { type = 'created' } = req.query;
    let userId = req.params.id;

    // Resolve Clerk ID to MongoDB _id first
    if (typeof userId === 'string' && userId.startsWith('user_')) {
      const resolved = await User.findOne({ clerkId: userId }).select('_id');
      if (!resolved) return res.status(404).json({ success: false, message: 'User not found' });
      userId = resolved._id;
    }

    let activities = [];

    if (type === 'created') {
      activities = await Activity.find({ host: userId })
        .populate('host', 'name profileImage')
        .sort({ createdAt: -1 });
    } else if (type === 'joined') {
      const participations = await Participant.find({ user: userId }).populate({
        path: 'activity',
        populate: { path: 'host', select: 'name profileImage' },
      });
      activities = participations.map((p) => p.activity).filter(Boolean);
    }

    // Filter out Private activities ONLY when viewing someone else's profile
    // When viewing your own profile (created OR joined), show all your activities including private ones
    const isOwnProfile = req.user._id.toString() === userId.toString();
    if (!isOwnProfile) {
      activities = activities.filter((act) => act.visibility !== 'Private');
    }

    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};
