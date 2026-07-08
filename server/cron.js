import cron from 'node-cron';
import Activity from './models/Activity.js';
import Message from './models/Message.js';

// Run every hour at minute 0
export const initCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running message cleanup cron job...');
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

      // Find activities that were completed or cancelled more than 12 hours ago
      // Since we don't track the exact time status changed to Completed/Cancelled,
      // we use updatedAt (which updates when status changes).
      const oldActivities = await Activity.find({
        status: { $in: ['Completed', 'Cancelled'] },
        updatedAt: { $lt: twelveHoursAgo }
      }).select('_id');

      if (oldActivities.length > 0) {
        const activityIds = oldActivities.map(a => a._id);
        const result = await Message.deleteMany({ activity: { $in: activityIds } });
        console.log(`Cleaned up ${result.deletedCount} messages from ${oldActivities.length} old activities.`);
      }
    } catch (error) {
      console.error('Error in message cleanup cron job:', error);
    }
  });

  // Run every minute to auto-start activities that have reached their start time
  cron.schedule('* * * * *', async () => {
    try {
      const openActivities = await Activity.find({ status: 'Open' });
      const now = new Date();
      
      let updatedCount = 0;
      for (const act of openActivities) {
        if (!act.date || !act.time) continue;
        
        const targetDate = new Date(act.date);
        const [hours, minutes] = act.time.split(':');
        targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        if (targetDate <= now) {
          act.status = 'Ongoing';
          await act.save();
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        console.log(`Auto-started ${updatedCount} activities`);
      }
    } catch (error) {
      console.error('Error auto-starting activities:', error);
    }
  });

  // Run every 30 minutes to auto-complete activities that started more than 2 hours ago
  cron.schedule('*/30 * * * *', async () => {
    try {
      const ongoingActivities = await Activity.find({ status: 'Ongoing' });
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      let completedCount = 0;
      for (const act of ongoingActivities) {
        if (!act.date || !act.time) continue;
        
        const targetDate = new Date(act.date);
        const [hours, minutes] = act.time.split(':');
        targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        if (targetDate <= twoHoursAgo) {
          act.status = 'Completed';
          await act.save();
          completedCount++;
        }
      }
      if (completedCount > 0) {
        console.log(`Auto-completed ${completedCount} old activities`);
      }
    } catch (error) {
      console.error('Error auto-completing activities:', error);
    }
  });
};
