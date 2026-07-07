import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Trophy, Gamepad2, Edit, Calendar, User, Mail, Sparkles, Activity } from 'lucide-react';
import { getUserById, getUserActivities } from '../api/users';
import { getMe } from '../api/users';
import { useUser } from '@clerk/clerk-react';
import ActivityCard from '../components/activity/ActivityCard';
import { ProfileSkeleton } from '../components/common/Skeleton';
import { getInitials } from '../utils/helpers';
import BackButton from '../components/common/BackButton';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: clerkUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [mongoMe, setMongoMe] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('created');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((res) => setMongoMe(res.data.user)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then((res) => setProfile(res.data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getUserActivities(id, activeTab)
      .then((res) => setActivities(res.data.activities))
      .catch(() => setActivities([]));
  }, [id, activeTab]);

  const isOwnProfile = mongoMe?._id === profile?._id || mongoMe?._id === id;

  if (loading) return <ProfileSkeleton />;
  if (!profile) return <div className="text-center py-20 text-slate-500 font-bold">User not found.</div>;

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <BackButton />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 relative z-10">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left relative mb-8"
        >
          {/* Avatar */}
          <div className="shrink-0 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-white shadow-lg overflow-hidden bg-white">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="font-display font-black text-3xl md:text-4xl text-slate-900 uppercase tracking-tight">
                {profile.name}
              </h1>
              {isOwnProfile && (
                <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1">You</span>
              )}
            </div>
            
            <p className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-medium text-sm mb-6">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {profile.branch && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold">
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                  {profile.branch}
                </div>
              )}
              {profile.year && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  {profile.year}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isOwnProfile && (
            <div className="shrink-0 pt-2 md:pt-4">
              <Link 
                to="/profile/edit" 
                className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-slate-900/20"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
          )}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interests & Gaming */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interests Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="font-display font-black text-lg text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-orange-500" /> Interests
              </h3>

              {(!profile.interests?.sports?.length && !profile.interests?.gaming?.length) && (
                <div className="text-slate-400 text-sm font-medium bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
                  No interests added yet.
                </div>
              )}

              {profile.interests?.sports?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sports</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.sports.map((s) => (
                      <span key={s} className="bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold px-3 py-1.5 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.interests?.gaming?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Gaming</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.gaming.map((g) => (
                      <span key={g} className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold px-3 py-1.5 rounded-lg">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Gaming Roster Card */}
            {profile.gamingProfiles && profile.gamingProfiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-900/20 text-white"
              >
                <h3 className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2 mb-6">
                  <Gamepad2 className="w-5 h-5 text-orange-500" /> Gaming Roster
                </h3>
                <div className="space-y-3">
                  {profile.gamingProfiles.map((gp, i) => (
                    <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{gp.game}</div>
                      <div className="font-display font-black text-xl tracking-tight truncate">{gp.inGameId}</div>
                      {gp.rank && (
                        <div className="inline-block bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 uppercase tracking-wider border border-orange-500/20">
                          {gp.rank}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Activities */}
          <div className="lg:col-span-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px]"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <h3 className="font-display font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" /> User Activities
                </h3>
                
                {/* Tabs */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                  {['created', 'joined'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                        activeTab === tab 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                    <Trophy className="w-6 h-6 text-slate-300" />
                  </div>
                  <h4 className="font-display font-black text-lg text-slate-900 uppercase tracking-tight mb-1">No activities found</h4>
                  <p className="text-slate-500 text-sm font-medium">This user hasn't {activeTab} any activities yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activities.map((a, i) => (
                    <ActivityCard key={a._id} activity={a} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
