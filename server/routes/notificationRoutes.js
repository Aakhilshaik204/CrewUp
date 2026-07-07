import express from 'express';
import { getNotifications, markAllRead, markOneRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getNotifications);
router.put('/read', requireAuth, markAllRead);
router.put('/:id/read', requireAuth, markOneRead);

export default router;
