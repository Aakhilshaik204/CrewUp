import express from 'express';
import {
  getAllUsers,
  banUser,
  getAllActivities,
  deleteActivity,
  getAllReports,
  updateReport,
  getStats,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.get('/activities', getAllActivities);
router.delete('/activities/:id', deleteActivity);
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReport);

export default router;
