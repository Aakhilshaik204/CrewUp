import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Search, SlidersHorizontal, X, Plus, Flame, Hash, RefreshCw } from 'lucide-react';
import { getActivities } from '../api/activities';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ActivityCard from '../components/activity/ActivityCard';
import Spinner from '../components/common/Spinner';
import { FeedSkeleton } from '../components/common/Skeleton';
import LoginGate from '../components/common/LoginGate';
import { SPORTS_CATEGORIES, GAMING_CATEGORIES } from '../utils/constants';
import { debounce } from '../utils/helpers';
import BackButton from '../components/common/BackButton';

const FeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [crewCode, setCrewCode] = useState('');
  const [joiningCode, setJoiningCode] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [activityType, setActivityType] = useState(searchParams.get('activityType') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const { ref: loaderRef, inView } = useInView({ threshold: 0.1 });

  const fetchActivities = useCallback(async (pg = 1, reset = false) => {
    try {
      if (pg === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pg, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (activityType) params.activityType = activityType;
      if (status) params.status = status;

      const res = await getActivities(params);
      const { activities: newActivities, pagination } = res.data;
      setActivities((prev) => (reset || pg === 1 ? newActivities : [...prev, ...newActivities]));
      setHasMore(pg < pagination.pages);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, category, activityType, status]);

  // Initial fetch
  useEffect(() => {
    if (!isLoaded) return;
    setPage(1);
    fetchActivities(1, true);
  }, [fetchActivities, isLoaded]);

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage);
    }
  }, [inView, hasMore, loadingMore, loading]);

  const debouncedSetSearch = useCallback(debounce((val) => setSearch(val), 400), []);
  const clearFilters = () => { setSearch(''); setCategory(''); setActivityType(''); setStatus(''); setSearchParams({}); };
  const hasActiveFilters = search || category || activityType || status;

  const handleCreateClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();
      setShowLoginGate(true);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!crewCode.trim()) return;
    
    let code = crewCode.trim().toUpperCase();
    if (!code.startsWith('CU-')) {
      code = `CU-${code}`;
    }

    try {
      setJoiningCode(true);
      const res = await api.get(`/api/activities/code/${code}`);
      if (res.data.success && res.data.activityId) {
        navigate(`/activities/${res.data.activityId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Crew Code');
    } finally {
      setJoiningCode(false);
    }
  };

  return (
    <div className="page-container">
      <BackButton />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-primary-500 rounded-full shadow-glow-sm" />
            <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 uppercase tracking-tighter">Explore</h1>
          </div>
          <p className="text-slate-500 font-medium ml-5">Find live sports and gaming activities on your campus.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-center">
          <form onSubmit={handleJoinByCode} className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={crewCode}
              onChange={(e) => setCrewCode(e.target.value)}
              placeholder="Code (e.g. CU-123)"
              maxLength={9}
              className="w-full sm:w-48 bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold uppercase tracking-widest rounded-xl pl-9 pr-24 py-3 focus:outline-none focus:border-primary-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={joiningCode || !crewCode.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {joiningCode ? '...' : 'Join'}
            </button>
          </form>
          <button
            onClick={() => fetchActivities(1, true)}
            disabled={loading}
            className="p-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-500 hover:text-primary-500 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm disabled:opacity-50 hidden sm:flex items-center justify-center"
            title="Refresh Activities"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-primary-500' : ''}`} />
          </button>
          
          <Link to="/activities/create" onClick={handleCreateClick} className="btn-primary hidden sm:flex shrink-0 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Create
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center max-w-3xl mx-auto">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            id="feed-search"
            type="text"
            placeholder="Search activities, sports, venues..."
            defaultValue={search}
            onChange={(e) => debouncedSetSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-base rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-primary-500 focus:bg-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          />
        </div>
        <button
          id="feed-filter-toggle"
          onClick={() => setShowFilters((v) => !v)}
          className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.04)] border-2 ${showFilters ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse ml-1" />}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 mb-8 border-2 border-slate-800 shadow-glow-lg text-white overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Type */}
            <div>
              <label className="text-xs font-bold text-primary-500 uppercase tracking-widest block mb-3">Activity Type</label>
              <div className="flex gap-2">
                {['', 'Sports', 'Gaming'].map((t) => (
                  <button key={t} onClick={() => setActivityType(t)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all border-2 ${activityType === t ? 'bg-primary-500 border-primary-500 text-white shadow-glow-sm' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}>
                    {t || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-primary-500 uppercase tracking-widest block mb-3">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-primary-500 uppercase tracking-widest block mb-3">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-800 border-2 border-slate-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer">
                <option value="">All Categories</option>
                <optgroup label="Sports" className="bg-slate-900">{SPORTS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</optgroup>
                <optgroup label="Gaming" className="bg-slate-900">{GAMING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</optgroup>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Grid */}
      {loading ? (
        <FeedSkeleton count={8} />
      ) : activities.length === 0 ? (
        <div className="bg-[#fdfaf7] rounded-[2rem] p-12 sm:p-16 text-center shadow-sm border border-orange-50 my-8 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(249,115,22,0.15)] mb-6 overflow-hidden border-4 border-white">
            <img src="/crewup_logo.png" alt="CrewUp Logo" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 mb-2 tracking-tight">No Activities Found</h3>
          <p className="text-slate-500 text-base mb-8 max-w-md mx-auto leading-relaxed">It's quiet out there. Adjust your filters or be the first to start a new squad.</p>
          <Link to="/activities/create" onClick={handleCreateClick} className="btn-primary flex items-center gap-2 py-3.5 px-8 shadow-glow hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-[15px]">
            <Plus className="w-5 h-5" />
            Create Activity
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activities.map((activity, i) => (
            <ActivityCard key={activity._id} activity={activity} index={i} />
          ))}
        </div>
      )}

      {/* Infinite scroll */}
      {!loading && (
        <div ref={loaderRef} className="flex justify-center py-8">
          {loadingMore && <Spinner size="md" />}
          {!hasMore && activities.length > 0 && (
            <p className="text-slate-400 text-sm">You've seen all activities ✓</p>
          )}
        </div>
      )}

      {/* Login Gate Modal */}
      <LoginGate
        isOpen={showLoginGate}
        onClose={() => setShowLoginGate(false)}
        action="create an activity"
      />
    </div>
  );
};

export default FeedPage;
