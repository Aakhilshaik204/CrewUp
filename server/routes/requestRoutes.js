import express from 'express';
import { 
  createRequest, 
  getRequests, 
  getRequestById, 
  acceptRequest, 
  updateRequestStatus 
} from '../controllers/requestController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.route('/')
  .post(requireAuth, createRequest)
  .get(requireAuth, getRequests);

router.route('/:id')
  .get(requireAuth, getRequestById);

router.route('/:id/accept')
  .put(requireAuth, acceptRequest);

router.route('/:id/status')
  .put(requireAuth, updateRequestStatus);

export default router;
