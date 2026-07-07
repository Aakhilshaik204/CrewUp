import express from 'express';
import { createReport } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, createReport);

export default router;
