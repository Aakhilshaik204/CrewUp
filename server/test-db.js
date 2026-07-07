import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from './models/Activity.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const activity = await Activity.findOne().sort({ createdAt: -1 });
    console.log(JSON.stringify(activity, null, 2));
    process.exit(0);
  });
