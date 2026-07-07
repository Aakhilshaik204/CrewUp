import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from './models/Activity.js';

dotenv.config();

const generateCrewCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `CU-${code}`;
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const activities = await Activity.find({ crewCode: { $exists: false } });
    for (const act of activities) {
      let code = generateCrewCode();
      let unique = false;
      while (!unique) {
        const existing = await Activity.findOne({ crewCode: code });
        if (existing) code = generateCrewCode();
        else unique = true;
      }
      act.crewCode = code;
      await act.save();
    }
    console.log(`Updated ${activities.length} activities with crew codes.`);
    process.exit(0);
  });
