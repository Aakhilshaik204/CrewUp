import { clerkClient, createClerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

// Middleware to verify Clerk JWT and attach user to req
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify with Clerk
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const payload = await clerk.verifyToken(token);

    if (!payload || !payload.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    // Find user in MongoDB
    const user = await User.findOne({ clerkId: payload.sub });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please sync your profile.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been banned.' });
    }

    req.user = user;
    req.clerkId = payload.sub;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Token verification failed' });
  }
};

// Middleware to optionally attach user to req if token exists
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const payload = await clerk.verifyToken(token);

    if (payload && payload.sub) {
      const user = await User.findOne({ clerkId: payload.sub });
      if (user && !user.isBanned) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
