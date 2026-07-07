import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HandHeart, Calendar, MapPin, Gamepad2, Dumbbell, AlertCircle, MessageCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { getRequestById, acceptRequest, updateRequestStatus } from '../api/requests';
import { getMe } from '../api/users';
import { useUser } from '@clerk/clerk-react';
import Spinner from '../components/common/Spinner';
import BackButton from '../components/common/BackButton';
import { getInitials } from '../utils/helpers';
import { format } from 'date-fns';

const RequestDetailPage = () => {
  const { id } = useParams();
  const { user: clerkUser } = useUser();
  const [request, setRequest] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [lenderMessage, setLenderMessage] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (clerkUser) {
      getMe().then(res => setMongoUser(res.data.user)).catch(() => {});
    }
  }, [clerkUser]);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await getRequestById(id);
      setRequest(res.data.request);
    } catch (error) {
      toast.error('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!lenderMessage.trim()) return toast.error('Please provide pickup instructions');
    
    try {
      setAccepting(true);
      const res = await acceptRequest(id, lenderMessage);
      setRequest(res.data.request);
      setShowAcceptModal(false);
      toast.success('Awesome! You offered to help! 🎉');
    } catch (error) {
      toast.error(error.message || 'Failed to accept request');
    } finally {
      setAccepting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const res = await updateRequestStatus(id, status);
      setRequest(res.data.request);
      toast.success(`Request marked as ${status}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!request) return <div className="text-center py-32 text-slate-500 font-bold">Request not found</div>;

  const isRequester = mongoUser?._id === request.requester?._id;
  const isLender = mongoUser?._id === request.lender?._id;

  const getCategoryIcon = () => {
    if (request.category === 'Sports') return <Dumbbell className="w-5 h-5 text-orange-500" />;
    if (request.category === 'Gaming') return <Gamepad2 className="w-5 h-5 text-indigo-500" />;
    return <AlertCircle className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="page-container max-w-4xl">
      <Link 
        to="/requests" 
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all hover:-translate-x-1 w-max"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Feed
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mt-6">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100 relative">
          <div className="absolute top-8 right-8">
            {request.status === 'Open' ? (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">Needs Help</span>
            ) : request.status === 'Accepted' ? (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">Accepted</span>
            ) : (
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">{request.status}</span>
            )}
          </div>

          <div className="flex gap-3 items-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            <span className="flex items-center gap-1.5">{getCategoryIcon()} {request.category} Request</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mb-4 pr-32">{request.title}</h1>
          <p className="text-slate-600 font-medium text-lg max-w-2xl">{request.description}</p>
          
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-200/60">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Needed By: <span className="text-orange-600">{format(new Date(request.neededBy), 'MMMM do yyyy, h:mm a')}</span></span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Requester Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Requested By</h3>
            <Link to={`/profile/${request.requester?._id}`} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
              {request.requester?.profileImage ? (
                <img src={request.requester.profileImage} alt={request.requester.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shadow-sm">
                  {getInitials(request.requester?.name)}
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900">{request.requester?.name}</div>
                {request.requester?.branch && <div className="text-xs text-slate-500 font-medium">{request.requester.branch} · {request.requester.year}</div>}
              </div>
            </Link>
          </div>

          {/* Action / Lender Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Status & Action</h3>
            
            {request.status === 'Open' ? (
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                <HandHeart className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-orange-800 mb-4">Can you help {request.requester?.name.split(' ')[0]} out?</p>
                {!isRequester ? (
                  <button onClick={() => setShowAcceptModal(true)} className="btn-primary w-full justify-center shadow-glow-sm">
                    I can lend this!
                  </button>
                ) : (
                  <button onClick={() => handleStatusUpdate('Cancelled')} className="btn-ghost text-red-500 hover:text-red-600 w-full justify-center text-sm">
                    Cancel Request
                  </button>
                )}
              </div>
            ) : request.status === 'Accepted' ? (
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-900">Accepted by {request.lender?.name}</div>
                    <div className="text-xs text-amber-700/70 font-medium">Please coordinate pickup</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-amber-200 relative">
                  <MessageCircle className="w-4 h-4 text-amber-400 absolute top-4 right-4" />
                  <div className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mb-1">Pickup Instructions</div>
                  <p className="text-sm text-slate-700 font-medium">{request.lenderMessage}</p>
                </div>

                {isRequester && (
                  <button onClick={() => handleStatusUpdate('Completed')} className="btn-outline w-full justify-center text-emerald-600 border-emerald-200 hover:bg-emerald-50 mt-4 text-xs py-2.5">
                    Mark as Received / Completed
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">This request is {request.status}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Accept Modal */}
      <AnimatePresence>
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !accepting && setShowAcceptModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">Offer Equipment</h2>
              <p className="text-sm text-slate-500 mb-6 font-medium">Let {request.requester?.name.split(' ')[0]} know where they can pick up the equipment.</p>
              
              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Pickup Instructions *</label>
                  <textarea
                    required
                    value={lenderMessage}
                    onChange={(e) => setLenderMessage(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 font-medium resize-none"
                    placeholder="e.g. Come to Hostel Block B, Room 204 after 4 PM"
                    rows="3"
                  />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setShowAcceptModal(false)} disabled={accepting} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="submit" disabled={accepting || !lenderMessage.trim()} className="btn-primary flex-1 justify-center shadow-glow">
                    {accepting ? <Spinner size="sm" /> : 'Confirm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestDetailPage;
