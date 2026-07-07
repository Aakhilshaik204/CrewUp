import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { timeAgo } from '../utils/helpers';
import { NotificationSkeleton } from '../components/common/Skeleton';
import BackButton from '../components/common/BackButton';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="page-container max-w-2xl">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            <span className="gradient-text">Notifications</span>
          </h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 text-sm mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-ghost flex items-center gap-2 text-sm text-primary-400"
            id="mark-all-read-btn"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <NotificationSkeleton count={5} />
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl text-white mb-2">All caught up!</h3>
          <p className="text-gray-500">No notifications yet. Join an activity to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => {
                if (n.relatedActivity) {
                  navigate(`/activities/${n.relatedActivity._id || n.relatedActivity}`);
                }
              }}
              className={`glass-card p-4 cursor-pointer hover:border-primary-500/20 transition-all ${
                !n.read ? 'border-primary-500/20 bg-primary-500/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {!n.read && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                )}
                <div className={`flex-1 ${n.read ? 'pl-5' : ''}`}>
                  <p className="text-sm text-gray-300">{n.message}</p>
                  {n.relatedActivity?.title && (
                    <p className="text-xs text-primary-400 mt-1">{n.relatedActivity.title}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
