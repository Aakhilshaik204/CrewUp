import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from './models/Activity.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ name: 'AAKHIL SHAIK' });
    const query = {
      status: 'Open',
      $or: [
        { visibility: { $ne: 'Private' } },
        { host: user._id, visibility: 'Private' }
      ]
    };
    const activities = await Activity.find(query).sort({ createdAt: -1 }).limit(5);
    console.log("Activities matching query:", activities.map(a => ({ title: a.title, visibility: a.visibility, host: a.host })));
    process.exit(0);
  });
