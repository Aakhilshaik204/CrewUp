import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Plus, Users, Zap, TrendingUp, Calendar, ArrowRight, Trophy, Gamepad2, Flame } from 'lucide-react';
import { getActivities } from '../api/activities';
import { getMe } from '../api/users';
import ActivityCard from '../components/activity/ActivityCard';
import Spinner from '../components/common/Spinner';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES } from '../utils/constants';
import { SPORT_IMAGES } from '../utils/sportImages';

const StatCard = ({ icon: Icon, value, label, color, bg }) => (
  <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex items-center gap-5 shadow-[0_6px_0_0_#e2e8f0] hover:translate-y-1 hover:shadow-[0_2px_0_0_#e2e8f0] transition-all duration-300 cursor-default">
    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-7 h-7 ${color}`} />
    </div>
    <div>
      <div className="text-4xl font-black text-slate-900 font-display uppercase tracking-tight">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
  </div>
);

const QuickCategory = ({ name, image, href }) => (
  <Link to={href} className="group flex flex-col bg-white rounded-3xl border-2 border-slate-200 shadow-[0_6px_0_0_#e2e8f0] overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_0_0_#cbd5e1] transition-all duration-300 w-48 flex-shrink-0">
    <div className="bg-gradient-to-t from-primary-100 to-white h-40 flex items-center justify-center p-0 pt-4 overflow-hidden border-b-2 border-slate-100">
      <img src={image} alt={name} className="w-[120%] h-[120%] object-contain scale-110 group-hover:scale-125 group-hover:-rotate-3 transition-transform duration-500 ease-out drop-shadow-xl" />
    </div>
    <div className="px-4 py-3 flex items-center justify-between bg-white">
      <span className="font-bold text-slate-900 uppercase tracking-tight text-sm">{name}</span>
      <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">View all</span>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user, isLoaded } = useUser();
  const [mongoUser, setMongoUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((res) => setMongoUser(res.data.user)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    getActivities({ page: 1, limit: 8 })
      .then((res) => setActivities(res.data.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded]);

  const firstName = user?.firstName || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-container space-y-8">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 25 } }}
        className="relative overflow-hidden rounded-[2rem] bg-white border-2 border-slate-200 shadow-[0_6px_0_0_#e2e8f0] flex items-center min-h-[360px]"
      >
        <div className="relative z-10 p-8 md:p-12 max-w-xl w-full md:w-3/5">
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tighter mb-4 text-slate-900">
            Welcome back,<br />{firstName}!
          </h1>
          <p className="text-slate-500 text-base max-w-sm leading-relaxed">
            Ready to find your crew? Browse live activities or create a new squad for your campus.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/activities/create" className="btn-primary py-3.5 px-6 shadow-glow">
              Create Activity
            </Link>
            <Link to="/feed" className="py-3.5 px-6 border-2 border-slate-200 text-slate-600 font-bold uppercase tracking-wider rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors bg-white">
              Browse All <ArrowRight className="w-4 h-4 inline-block ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="hidden md:block absolute top-0 right-0 w-2/5 h-full">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <motion.img
            src="/3d/dashboard_hero.png"
            alt="Sports 3D Hero"
            className="w-full h-full object-cover origin-right"
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {[
          { icon: Zap, value: activities.length || 0, label: 'Live Activities', color: 'text-primary-500', bg: 'bg-primary-500/20' },
          { icon: Trophy, value: '12+', label: 'Categories', color: 'text-primary-500', bg: 'bg-primary-500/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 25, delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Featured Categories with Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Browse by Sport</h2>
            <p className="section-subtitle">Jump into what you love</p>
          </div>
          <Link to="/feed" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
          {[
            { name: 'Cricket', img: '/3d/icon_cricket.png' },
            { name: 'Football', img: '/3d/icon_football.png' },
            { name: 'Badminton', img: '/3d/icon_badminton.png' },
            { name: 'BGMI', img: '/3d/icon_bgmi.png' },
            { name: 'All Gaming', img: '/3d/icon_gaming.png', type: 'Gaming' },
          ].map((cat) => (
            <QuickCategory 
              key={cat.name} 
              name={cat.name} 
              image={cat.img} 
              href={cat.type ? `/feed?activityType=${cat.type}` : `/feed?category=${cat.name}`} 
            />
          ))}
        </div>
      </div>

      {/* Open Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Open Activities</h2>
            <p className="section-subtitle">Join before they fill up</p>
          </div>
          <Link to="/feed" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-5 h-48 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-[0_6px_0_0_#e2e8f0] p-12 text-center max-w-xl mx-auto my-8">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-medium mb-6">No open activities yet. Be the first to create one!</p>
            <Link to="/activities/create" className="btn-primary py-3 px-8 shadow-glow">
              CREATE ACTIVITY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.slice(0, 8).map((activity, i) => (
              <ActivityCard key={activity._id} activity={activity} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Interest-based quick actions */}
      {mongoUser?.interests && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sports interests */}
          {mongoUser.interests.sports?.length > 0 && (
            <div className="card p-6">
              <h3 className="font-display font-bold text-slate-900 text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-500" />
                Your Sports
              </h3>
              <div className="flex flex-wrap gap-2">
                {mongoUser.interests.sports.map((s) => (
                  <Link
                    key={s}
                    to={`/feed?category=${s}`}
                    className="border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors shadow-sm"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Gaming interests */}
          {mongoUser.interests.gaming?.length > 0 && (
            <div className="card p-6">
              <h3 className="font-display font-bold text-slate-900 text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary-500" />
                Your Games
              </h3>
              <div className="flex flex-wrap gap-2">
                {mongoUser.interests.gaming.map((g) => (
                  <Link
                    key={g}
                    to={`/feed?category=${g}`}
                    className="border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors shadow-sm"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
