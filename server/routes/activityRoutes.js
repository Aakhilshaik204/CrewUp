import express from 'express';
import {
  getActivities,
  createActivity,
  getActivityById,
  getActivityByCode,
  updateActivity,
  cancelActivity,
  joinActivity,
  leaveActivity,
  removeParticipant,
  updateActivityStatus,
} from '../controllers/activityController.js';
import { getMessages } from '../controllers/messageController.js';
import { requireAuth, optionalAuth } from '../middleware/requireAuth.js';
import Participant from '../models/Participant.js';

const router = express.Router();

router.get('/testdb', async (req, res) => {
  const p = await Participant.find().sort({_id:-1}).limit(5).lean();
  res.json(p);
});

router.get('/', optionalAuth, getActivities);
router.post('/', requireAuth, createActivity);
router.get('/code/:code', getActivityByCode);
router.get('/:id', getActivityById);
router.put('/:id', requireAuth, updateActivity);
router.put('/:id/status', requireAuth, updateActivityStatus);
router.delete('/:id', requireAuth, cancelActivity);

router.post('/:id/join', requireAuth, joinActivity);
router.post('/:id/leave', requireAuth, leaveActivity);
router.delete('/:id/participants/:userId', requireAuth, removeParticipant);

router.get('/:id/messages', requireAuth, getMessages);

export default router;
