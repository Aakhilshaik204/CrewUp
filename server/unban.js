import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: './server/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const result = await User.updateMany({}, { isBanned: false });
    console.log(`Unbanned ${result.modifiedCount} users`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
