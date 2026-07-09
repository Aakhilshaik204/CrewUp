import Activity from '../models/Activity.js';
import Participant from '../models/Participant.js';
import Waitlist from '../models/Waitlist.js';
import { createNotification } from '../utils/notifications.js';

// GET /api/activities
export const getActivities = async (req, res, next) => {
  try {
    const {
      search = '',
      category,
      activityType,
      status,
      date,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};


    if (category) query.category = category;
    if (activityType) query.activityType = activityType;
    if (status) query.status = status;
    else query.status = { $nin: ['Cancelled', 'Completed'] };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Build the visibility filter
    // - Logged-in host sees their own Private activities too
    // - Everyone else only sees Public activities
    const visibilityFilter = req.user
      ? { $or: [{ visibility: { $ne: 'Private' } }, { host: req.user._id, visibility: 'Private' }] }
      : { visibility: { $ne: 'Private' } };

    // Combine search $or with visibility using $and (to avoid overwriting $or)
    if (search) {
      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
        ],
      };
      query.$and = [searchFilter, visibilityFilter];
    } else {
      if (visibilityFilter.$or) {
        query.$or = visibilityFilter.$or;
      } else {
        query.visibility = visibilityFilter.visibility;
      }
    }

    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate('host', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper to generate a random 6-character code
const generateCrewCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `CU-${code}`;
};

// POST /api/activities
export const createActivity = async (req, res, next) => {
  try {
    console.log("DEBUG createActivity body:", req.body);
    const { title, category, activityType, visibility, description, date, time, venue, maxPlayers, minRank, hostInGameId, hostRank } = req.body;

    if (activityType === 'Gaming' && !hostInGameId) {
      return res.status(400).json({ success: false, message: 'Host In-Game ID is required for Gaming activities' });
    }

    // Generate unique crew code
    let crewCode = generateCrewCode();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Activity.findOne({ crewCode });
      if (existing) {
        crewCode = generateCrewCode();
      } else {
        isUnique = true;
      }
    }

    const activity = await Activity.create({
      title,
      category,
      activityType,
      visibility: visibility || 'Public',
      description,
      crewCode,
      date,
      time,
      venue,
      maxPlayers,
      minRank,
      host: req.user._id,
      currentPlayers: 1,
    });

    // Host is automatically a participant
    await Participant.create({ 
      activity: activity._id, 
      user: req.user._id,
      inGameId: hostInGameId,
      rank: hostRank
    });

    const populated = await activity.populate('host', 'name profileImage');
    res.status(201).json({ success: true, activity: populated });
  } catch (error) {
    next(error);
  }
};

// GET /api/activities/code/:code
export const getActivityByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const activity = await Activity.findOne({ crewCode: code.toUpperCase() });
    
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Invalid Crew Code' });
    }
    
    res.json({ success: true, activityId: activity._id });
  } catch (error) {
    next(error);
  }
};

// GET /api/activities/:id
export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('host', 'name profileImage email');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const participants = await Participant.find({ activity: activity._id }).populate(
      'user',
      'name profileImage branch year'
    );

    const waitlist = await Waitlist.find({ activity: activity._id })
      .populate('user', 'name profileImage')
      .sort('position');

    console.log("DEBUG Participants:", JSON.stringify(participants, null, 2));

    res.json({ success: true, activity, participants, waitlist });
  } catch (error) {
    next(error);
  }
};

// PUT /api/activities/:id
export const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the host can edit this activity' });
    }

    const allowedUpdates = ['title', 'description', 'date', 'time', 'venue', 'maxPlayers', 'registrationOpen'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) activity[field] = req.body[field];
    });

    // Recalculate status
    if (activity.currentPlayers >= activity.maxPlayers) {
      activity.status = 'Full';
    } else if (activity.status === 'Full') {
      activity.status = 'Open';
    }

    await activity.save();
    const populated = await activity.populate('host', 'name profileImage');
    res.json({ success: true, activity: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/activities/:id  — cancel activity
export const cancelActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const isHost = activity.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only host or admin can cancel this activity' });
    }

    activity.status = 'Cancelled';
    await activity.save();

    // Notify all participants
    const participants = await Participant.find({ activity: activity._id });
    const io = req.app.get('io');

    for (const p of participants) {
      if (p.user.toString() !== req.user._id.toString()) {
        await createNotification({
          recipientId: p.user,
          type: 'ACTIVITY_CANCELLED',
          message: `"${activity.title}" has been cancelled.`,
          relatedActivityId: activity._id,
          io,
        });
      }
    }

    res.json({ success: true, message: 'Activity cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/activities/:id/join
export const joinActivity = async (req, res, next) => {
  try {
    const { inGameId, inGameCode, rank } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (activity.activityType === 'Gaming' && !inGameId) {
      return res.status(400).json({ success: false, message: 'In-Game ID is required for Gaming activities' });
    }

    if (activity.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Activity is cancelled' });
    }
    if (activity.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Activity is already completed' });
    }
    if (!activity.registrationOpen) {
      return res.status(400).json({ success: false, message: 'Registrations are closed' });
    }

    // Check if already a participant
    const existing = await Participant.findOne({ activity: activity._id, user: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: 'You are already in this activity' });

    // Check if already on waitlist
    const onWaitlist = await Waitlist.findOne({ activity: activity._id, user: req.user._id });
    if (onWaitlist) return res.status(409).json({ success: false, message: 'You are already on the waitlist' });

    const io = req.app.get('io');

    // Activity is full — add to waitlist
    if (activity.currentPlayers >= activity.maxPlayers) {
      const lastInWaitlist = await Waitlist.findOne({ activity: activity._id }).sort({ position: -1 });
      const position = lastInWaitlist ? lastInWaitlist.position + 1 : 1;

      await Waitlist.create({ activity: activity._id, user: req.user._id, position, inGameId, inGameCode, rank });

      // Notify host
      await createNotification({
        recipientId: activity.host,
        type: 'PLAYER_JOINED',
        message: `${req.user.name} joined the waitlist for "${activity.title}"`,
        relatedActivityId: activity._id,
        io,
      });

      return res.json({ success: true, message: 'Added to waitlist', waitlisted: true, position });
    }

    // Join activity
    await Participant.create({ activity: activity._id, user: req.user._id, inGameId, inGameCode, rank });
    activity.currentPlayers += 1;

    if (activity.currentPlayers >= activity.maxPlayers) {
      activity.status = 'Full';
    }

    await activity.save();

    // Notify host
    await createNotification({
      recipientId: activity.host,
      type: 'PLAYER_JOINED',
      message: `${req.user.name} joined "${activity.title}"`,
      relatedActivityId: activity._id,
      io,
    });

    // Notify if full
    if (activity.status === 'Full') {
      await createNotification({
        recipientId: activity.host,
        type: 'ACTIVITY_FULL',
        message: `"${activity.title}" is now full!`,
        relatedActivityId: activity._id,
        io,
      });
    }

    // Emit real-time update to activity room
    if (io) {
      io.to(`activity:${activity._id}`).emit('playerCountUpdate', {
        activityId: activity._id,
        currentPlayers: activity.currentPlayers,
        status: activity.status,
      });
    }

    res.json({ success: true, message: 'Joined successfully', waitlisted: false });
  } catch (error) {
    next(error);
  }
};

// POST /api/activities/:id/leave
export const leaveActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    // Host cannot leave
    if (activity.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Host cannot leave. Cancel the activity instead.' });
    }

    const participant = await Participant.findOneAndDelete({ activity: activity._id, user: req.user._id });

    if (!participant) {
      // Try removing from waitlist
      const waitlistEntry = await Waitlist.findOneAndDelete({ activity: activity._id, user: req.user._id });
      if (!waitlistEntry) {
        return res.status(404).json({ success: false, message: 'You are not in this activity' });
      }
      // Re-number waitlist
      await Waitlist.updateMany(
        { activity: activity._id, position: { $gt: waitlistEntry.position } },
        { $inc: { position: -1 } }
      );
      return res.json({ success: true, message: 'Removed from waitlist' });
    }

    activity.currentPlayers = Math.max(1, activity.currentPlayers - 1);

    const io = req.app.get('io');

    // Promote first in waitlist
    const firstInWaitlist = await Waitlist.findOne({ activity: activity._id }).sort({ position: 1 });
    if (firstInWaitlist) {
      await Participant.create({ activity: activity._id, user: firstInWaitlist.user });
      await Waitlist.deleteOne({ _id: firstInWaitlist._id });
      // Re-number remaining waitlist
      await Waitlist.updateMany({ activity: activity._id }, { $inc: { position: -1 } });

      activity.currentPlayers += 1; // restore back since someone promoted

      // Notify promoted user
      await createNotification({
        recipientId: firstInWaitlist.user,
        type: 'WAITLIST_PROMOTED',
        message: `You've been promoted from the waitlist to "${activity.title}"!`,
        relatedActivityId: activity._id,
        io,
      });
    }

    if (activity.currentPlayers < activity.maxPlayers) {
      activity.status = 'Open';
    }

    await activity.save();

    // Notify host
    await createNotification({
      recipientId: activity.host,
      type: 'PLAYER_LEFT',
      message: `${req.user.name} left "${activity.title}"`,
      relatedActivityId: activity._id,
      io,
    });

    if (io) {
      io.to(`activity:${activity._id}`).emit('playerCountUpdate', {
        activityId: activity._id,
        currentPlayers: activity.currentPlayers,
        status: activity.status,
      });
    }

    res.json({ success: true, message: 'Left activity successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/activities/:id/participants/:userId — host removes a participant
export const removeParticipant = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the host can remove participants' });
    }

    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Host cannot remove themselves' });
    }

    const participant = await Participant.findOneAndDelete({
      activity: activity._id,
      user: req.params.userId,
    });

    if (!participant) return res.status(404).json({ success: false, message: 'Participant not found' });

    activity.currentPlayers = Math.max(1, activity.currentPlayers - 1);

    // Promote first waitlisted user
    const io = req.app.get('io');
    const firstInWaitlist = await Waitlist.findOne({ activity: activity._id }).sort({ position: 1 });
    if (firstInWaitlist) {
      await Participant.create({ activity: activity._id, user: firstInWaitlist.user });
      await Waitlist.deleteOne({ _id: firstInWaitlist._id });
      await Waitlist.updateMany({ activity: activity._id }, { $inc: { position: -1 } });
      activity.currentPlayers += 1;

      await createNotification({
        recipientId: firstInWaitlist.user,
        type: 'WAITLIST_PROMOTED',
        message: `You've been promoted from the waitlist to "${activity.title}"!`,
        relatedActivityId: activity._id,
        io,
      });
    }

    if (activity.currentPlayers < activity.maxPlayers) activity.status = 'Open';
    await activity.save();

    // Notify removed user
    await createNotification({
      recipientId: req.params.userId,
      type: 'REMOVED_FROM_ACTIVITY',
      message: `You were removed from "${activity.title}" by the host.`,
      relatedActivityId: activity._id,
      io,
    });

    res.json({ success: true, message: 'Participant removed' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/activities/:id/status
export const updateActivityStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Ongoing', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const isHost = activity.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only host or admin can update status' });
    }

    activity.status = status;
    await activity.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`activity:${activity._id}`).emit('playerCountUpdate', {
        activityId: activity._id,
        currentPlayers: activity.currentPlayers,
        status: activity.status,
      });
    }

    res.json({ success: true, message: `Activity marked as ${status}`, activity });
  } catch (error) {
    next(error);
  }
};
