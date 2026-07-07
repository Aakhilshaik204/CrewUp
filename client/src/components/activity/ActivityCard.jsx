import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Calendar, Lock } from 'lucide-react';
import { CATEGORY_ICONS } from '../../utils/constants';
import { SPORT_IMAGES } from '../../utils/sportImages';
import { formatDate, getInitials } from '../../utils/helpers';
import CountdownTimer from '../common/CountdownTimer';

const STATUS_STYLES = {
  Open: 'badge-open',
  Full: 'badge-full',
  Ongoing: 'badge-ongoing',
  Cancelled: 'badge-cancelled',
  Completed: 'badge-completed',
};

const TYPE_ACCENT = {
  Sports: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Gaming: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
};

const ActivityCard = ({ activity, index = 0 }) => {
  const accent = TYPE_ACCENT[activity.activityType] || TYPE_ACCENT.Sports;
  const coverImage = SPORT_IMAGES[activity.category] || SPORT_IMAGES.default;
  const filled = activity.currentPlayers / activity.maxPlayers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.04 }}
      className="h-full"
    >
      <Link to={`/activities/${activity._id}`} className="block h-full group bg-white border border-slate-200 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col">
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={coverImage}
            alt={activity.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status badge top-right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest rounded backdrop-blur-sm shadow-sm ${
              activity.status === 'Cancelled' ? 'bg-red-500/90 text-white' : 
              activity.status === 'Completed' ? 'bg-slate-800/90 text-white' : 
              'bg-white/95 text-slate-700'
            }`}>
              {activity.status}
            </span>
            {activity.status !== 'Completed' && activity.status !== 'Cancelled' && (
              <div className="scale-90 origin-right">
                <CountdownTimer date={activity.date} time={activity.time} status={activity.status} />
              </div>
            )}
          </div>

          {/* Category Pill bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-sm">
              <span className="text-sm">{CATEGORY_ICONS[activity.category]}</span>
              <span className="text-xs font-bold text-slate-800">
                {activity.category}
              </span>
            </div>
            {activity.visibility === 'Private' && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 text-white backdrop-blur-md rounded-full shadow-sm">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-bold tracking-wider">PRIVATE</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-display font-bold text-slate-900 text-lg leading-snug mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
            {activity.title}
          </h3>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {formatDate(activity.date)} · {activity.time}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{activity.venue}</span>
            </div>
          </div>

          {/* Player progress bar */}
          <div className="mt-auto mb-4">
            <div className="flex items-center justify-between text-[11px] font-bold mb-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {activity.currentPlayers}/{activity.maxPlayers} players
              </span>
              <span className={filled >= 1 ? 'text-amber-600' : 'text-emerald-600'}>
                {activity.maxPlayers - activity.currentPlayers > 0
                  ? `${activity.maxPlayers - activity.currentPlayers} spots left`
                  : 'Full'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${filled >= 1 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(filled * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            {activity.host?.profileImage ? (
              <img src={activity.host.profileImage} alt={activity.host.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                {getInitials(activity.host?.name)}
              </div>
            )}
            <span className="text-xs font-medium text-slate-500 truncate flex-1 flex gap-1 items-center">
              <span className="text-slate-900">{activity.host?.name}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ActivityCard;
