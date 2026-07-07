import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Zap, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserActivities } from '../api/users';
import { getMe } from '../api/users';
import ActivityCard from '../components/activity/ActivityCard';
import Spinner from '../components/common/Spinner';
import BackButton from '../components/common/BackButton';

const TABS = ['created', 'joined', 'completed', 'cancelled'];

const MyActivitiesPage = () => {
  const { user } = useUser();
  const [mongoUser, setMongoUser] = useState(null);
  const [activeTab, setActiveTab] = useState('created');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((res) => setMongoUser(res.data.user)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mongoUser) return;
    setLoading(true);
    // For 'completed' and 'cancelled', we filter from created + joined
    const fetchType = activeTab === 'completed' || activeTab === 'cancelled' ? 'created' : activeTab;
    getUserActivities(mongoUser._id, fetchType)
      .then((res) => {
        let data = res.data.activities;
        if (activeTab === 'completed') data = data.filter((a) => a.status === 'Completed');
        if (activeTab === 'cancelled') data = data.filter((a) => a.status === 'Cancelled');
        setActivities(data);
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [mongoUser, activeTab]);

  return (
    <div className="page-container max-w-6xl mx-auto">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            My Activities
          </h1>
          <p className="text-slate-500 text-base mt-1">Track all your created and joined activities.</p>
        </div>
        <Link to="/activities/create" className="btn-primary flex items-center justify-center gap-2 py-3 px-6 shadow-glow hover:scale-105 hover:-translate-y-1 transition-all duration-300">
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            id={`my-activities-tab-${tab}`}
            className={`py-3 px-8 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-slate-100 text-primary-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">No {activeTab} activities</h3>
          {activeTab === 'created' && (
            <Link to="/activities/create" className="text-primary-600 font-bold hover:underline inline-flex items-center gap-2 mt-2">
              <Plus className="w-4 h-4" />
              Create your first activity
            </Link>
          )}
          {activeTab === 'joined' && (
            <Link to="/feed" className="text-primary-600 font-bold hover:underline inline-flex items-center gap-2 mt-2">
              Browse Activities
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {activities.map((activity, i) => (
            <ActivityCard key={activity._id} activity={activity} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyActivitiesPage;
