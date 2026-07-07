import express from 'express';
import { syncUser, getUserById, getMe, updateMe, getUserActivities } from '../controllers/userController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public sync endpoint (called from frontend on every login via Clerk webhook / useEffect)
router.post('/sync', syncUser);

// Protected routes
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.get('/:id', requireAuth, getUserById);
router.get('/:id/activities', requireAuth, getUserActivities);

export default router;
