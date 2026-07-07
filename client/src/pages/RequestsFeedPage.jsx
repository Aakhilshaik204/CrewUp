import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, HandHeart, Calendar, Gamepad2, Dumbbell, AlertCircle, RefreshCw } from 'lucide-react';
import { getRequests } from '../api/requests';
import SkeletonCard from '../components/common/SkeletonCard';
import { getInitials } from '../utils/helpers';
import { format } from 'date-fns';

const RequestCard = ({ request, index }) => {
  const getCategoryIcon = () => {
    if (request.category === 'Sports') return <Dumbbell className="w-4 h-4 text-orange-500" />;
    if (request.category === 'Gaming') return <Gamepad2 className="w-4 h-4 text-indigo-500" />;
    return <AlertCircle className="w-4 h-4 text-slate-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        to={`/requests/${request._id}`}
        className="block bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-orange-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {request.status === 'Open' ? (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Needs Help</span>
          ) : request.status === 'Accepted' ? (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Accepted</span>
          ) : (
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{request.status}</span>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div className="shrink-0 relative">
            {request.requester?.profileImage ? (
              <img src={request.requester.profileImage} alt={request.requester.name} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shadow-sm border-2 border-white">
                {getInitials(request.requester?.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
              <div className="bg-slate-50 rounded-full p-1 border border-slate-100">
                {getCategoryIcon()}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-20">
            <h3 className="font-display font-bold text-lg text-slate-900 truncate mb-1">{request.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{request.description}</p>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-orange-500" /> Needed By {format(new Date(request.neededBy), 'MMM d, h:mm a')}</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      </Link>
    </motion.div>
  );
};

const RequestsFeedPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Open');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getRequests({ status: filter });
      setRequests(res.data.requests);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display font-black text-4xl text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            <HandHeart className="w-8 h-8 text-orange-500" /> Borrow & Lend
          </h1>
          <p className="text-slate-500 font-medium">Borrow gear, find teammates with the right equipment, and help others out.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchRequests} 
            disabled={loading}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center"
            title="Refresh Requests"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          </button>
          
          <Link to="/requests/create" className="btn-primary flex-1 md:flex-none flex items-center gap-2 px-8 py-3.5 text-sm uppercase tracking-wider shadow-glow whitespace-nowrap justify-center">
            <Plus className="w-5 h-5" /> Ask for Equipment
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-max">
        {['Open', 'Accepted', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
              filter === f 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HandHeart className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tighter mb-2">No Requests Found</h3>
          <p className="text-slate-500 font-medium">There are currently no {filter.toLowerCase()} equipment requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, i) => (
            <RequestCard key={req._id} request={req} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsFeedPage;
