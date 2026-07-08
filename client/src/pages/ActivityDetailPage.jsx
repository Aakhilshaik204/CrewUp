import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MapPin, Clock, Calendar, Users, Crown, Pencil, Trash2,
  MessageCircle, Send, AlertTriangle, UserMinus, ChevronLeft, Flag, Copy, Lock, Share2
} from 'lucide-react';
import {
  getActivityById,
  joinActivity,
  leaveActivity,
  cancelActivity,
  removeParticipant,
  getMessages,
  updateActivityStatus,
} from '../api/activities';
import api from '../api/axios';
import { useSocket } from '../contexts/SocketContext';
import { CATEGORY_ICONS } from '../utils/constants';
import { SPORT_IMAGES } from '../utils/sportImages';
import { formatDate, timeAgo, getInitials } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import { ActivityDetailSkeleton } from '../components/common/Skeleton';
import LoginGate from '../components/common/LoginGate';
import CountdownTimer from '../components/common/CountdownTimer';

const STATUS_BADGE = {
  Open: 'badge-open',
  Full: 'badge-full',
  Ongoing: 'badge-ongoing',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled',
};

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { socket } = useSocket();

  const [activity, setActivity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const chatEndRef = useRef(null);

  const [mongoUser, setMongoUser] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({ inGameId: '', rank: '' });

  useEffect(() => {
    if (isSignedIn) {
      api.get('/api/users/me').then(res => setMongoUser(res.data.user)).catch(() => {});
    }
  }, [isSignedIn]);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  useEffect(() => {
    if (activity) fetchMessages();
  }, [activity]);

  // Socket.io room join
  useEffect(() => {
    if (!socket || !id) return;
    socket.emit('joinActivityRoom', id);

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    socket.on('playerCountUpdate', ({ currentPlayers, status }) => {
      setActivity((prev) => prev ? { ...prev, currentPlayers, status } : prev);
    });

    return () => {
      socket.emit('leaveActivityRoom', id);
      socket.off('newMessage');
      socket.off('playerCountUpdate');
    };
  }, [socket, id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await getActivityById(id);
      setActivity(res.data.activity);
      setParticipants(res.data.participants);
      setWaitlist(res.data.waitlist);
    } catch (error) {
      toast.error('Activity not found');
      navigate('/feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!isSignedIn) return;
    try {
      const res = await getMessages(id);
      setMessages(res.data.messages);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (error) {}
  };

  const handleJoin = async () => {
    if (!isSignedIn) { setShowLoginGate(true); return; }
    
    if (activity.activityType === 'Gaming') {
      if (mongoUser?.gamingProfiles) {
        const profile = mongoUser.gamingProfiles.find(p => p.game === activity.category);
        if (profile) {
          setJoinForm({ inGameId: profile.inGameId, rank: profile.rank || '' });
          toast.success(`Autofilled IGN for ${activity.category}!`, { icon: '🎮' });
        }
      }
      setShowJoinModal(true);
      return;
    }

    try {
      setJoining(true);
      const res = await joinActivity(id);
      if (res.data.waitlisted) {
        toast.success(`Added to waitlist at position ${res.data.position}`);
      } else {
        toast.success('Joined successfully! 🎉');
      }
      fetchActivity();
    } catch (error) {
      toast.error(error.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const submitJoin = async (e) => {
    e.preventDefault();
    if (!joinForm.inGameId.trim()) {
      toast.error('In-Game ID is required');
      return;
    }
    
    try {
      setJoining(true);
      const res = await joinActivity(id, joinForm);
      if (res.data.waitlisted) {
        toast.success(`Added to waitlist at position ${res.data.position}`);
      } else {
        toast.success('Joined successfully! 🎉');
      }
      setShowJoinModal(false);
      fetchActivity();
    } catch (error) {
      toast.error(error.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      setLeaving(true);
      await leaveActivity(id);
      toast.success('Left activity');
      fetchActivity();
    } catch (error) {
      toast.error(error.message || 'Failed to leave');
    } finally {
      setLeaving(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this activity?')) return;
    try {
      await cancelActivity(id);
      toast.success('Activity cancelled');
      navigate('/my-activities');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateActivityStatus(id, newStatus);
      toast.success(`Activity marked as ${newStatus}`);
      fetchActivity();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      await removeParticipant(id, userId);
      toast.success('Participant removed');
      fetchActivity();
    } catch (error) {
      toast.error(error.message || 'Failed to remove participant');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !mongoUser) return;
    socket.emit('sendMessage', {
      activityId: id,
      senderId: mongoUser._id,
      senderName: mongoUser.name,
      senderImage: mongoUser.profileImage,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  const handleReport = async () => {
    if (!reportReason) { toast.error('Please select a reason'); return; }
    try {
      await api.post('/api/reports', { targetType: 'Activity', targetActivity: id, reason: reportReason });
      toast.success('Report submitted');
      setShowReport(false);
    } catch (error) {
      toast.error('Failed to submit report');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activity.crewCode);
    toast.success('Crew Code copied!');
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    // Using *asterisks* for bold text (WhatsApp/Telegram style)
    let text = `🔥 *${activity.title}*\n\n`;
    text += `Hey! I'm hosting a ${activity.category} session and I'd love for you to join my crew. 🚀\n\n`;
    text += `📍 *Venue:* ${activity.venue}\n`;
    text += `📅 *Date:* ${formatDate(activity.date)} at ${activity.time}\n`;
    text += `👥 *Players:* ${activity.currentPlayers}/${activity.maxPlayers}\n\n`;
    
    if (activity.visibility === 'Private') {
      text += `🔒 *This is a Private Crew!*\n`;
      text += `Use the Invite Code: *${activity.crewCode}* to join.\n\n`;
    }
    
    text += `👇 Click the link below to view details and join:\n`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my ${activity.category} crew!`,
          text: text,
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${text}${url}`);
      toast.success('Activity info copied to clipboard!');
    }
  };

  if (loading) return <ActivityDetailSkeleton />;

  if (!activity) return null;

  const isHost = mongoUser && activity.host?._id?.toString() === mongoUser._id?.toString();
  const isParticipant = participants.some((p) => p.user?._id?.toString() === mongoUser?._id?.toString());
  const isOnWaitlist = waitlist.some((w) => w.user?._id?.toString() === mongoUser?._id?.toString());
  const isCancelled = activity.status === 'Cancelled';
  const isCompleted = activity.status === 'Completed';
  const isOngoing = activity.status === 'Ongoing';
  const canChat = (isParticipant || isHost) && isSignedIn;
  const coverImage = SPORT_IMAGES[activity.category] || SPORT_IMAGES.default;

  const STATUS_BADGE = {
    Open: 'badge-open',
    Full: 'badge-full',
    Ongoing: 'badge-ongoing',
    Cancelled: 'badge-cancelled',
    Completed: 'badge-completed',
  };

  return (
    <div className="page-container max-w-5xl">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-200 px-3 py-1.5 rounded-lg shadow-sm transition-all text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          Share Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Activity Hero with Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            {/* Cover Image */}
            <div className="relative h-48">
              <img src={coverImage} alt={activity.category} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                <span className={`badge ${STATUS_BADGE[activity.status] || 'badge-open'} shadow-sm`}>
                  {activity.status}
                </span>
                {activity.status !== 'Completed' && activity.status !== 'Cancelled' && (
                  <CountdownTimer
                    date={activity.date}
                    time={activity.time}
                    status={activity.status}
                    onExpire={fetchActivity}
                  />
                )}
              </div>
              <div className="absolute bottom-4 left-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{CATEGORY_ICONS[activity.category]}</span>
                  <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                    {activity.category} · {activity.activityType}
                    {activity.visibility === 'Private' && (
                      <span className="inline-flex items-center gap-1 bg-black/40 text-white/90 px-2 py-0.5 rounded text-xs shadow-sm">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </span>
                </div>
                <h1 className="font-display font-bold text-2xl text-white drop-shadow">{activity.title}</h1>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-5">
              {activity.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-4 pb-4 border-b border-slate-100">{activity.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                  {formatDate(activity.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                  {activity.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                  {activity.venue}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                  <span className={activity.currentPlayers >= activity.maxPlayers ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                    {activity.currentPlayers}/{activity.maxPlayers} Players
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full h-1.5 bg-slate-100 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${activity.currentPlayers >= activity.maxPlayers ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min((activity.currentPlayers / activity.maxPlayers) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {activity.maxPlayers - activity.currentPlayers > 0
                    ? `${activity.maxPlayers - activity.currentPlayers} spots remaining`
                    : 'Activity is full'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="pill-tabs">
            {['participants', 'chat', 'waitlist'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'pill-tab-active' : 'pill-tab'}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'waitlist' && waitlist.length > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {waitlist.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Participants ({participants.length})</h2>
              <div className="space-y-3">
                {participants.map((p) => (
                  <div key={p._id} className="flex items-center justify-between">
                    <Link to={`/profile/${p.user?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      {p.user?.profileImage ? (
                        <img src={p.user.profileImage} alt={p.user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                          {getInitials(p.user?.name)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-slate-800">{p.user?.name}</span>
                          {p.user?._id === activity.host?._id && (
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                        {p.user?.branch && (
                          <span className="text-xs text-slate-400">{p.user.branch} · {p.user.year}</span>
                        )}
                        {p.inGameId && (
                          <div className="text-xs text-primary-600 font-medium mt-0.5">
                            IGN: {p.inGameId} {p.rank && <span className="text-slate-400 font-normal">| {p.rank}</span>}
                          </div>
                        )}
                      </div>
                    </Link>
                    {isHost && p.user?._id !== mongoUser?._id && (
                      <button
                        onClick={() => handleRemoveParticipant(p.user?._id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        title="Remove participant"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Activity Chat</h2>
              {!isSignedIn ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-3">Sign in to join the chat</p>
                  <Link to="/sign-in" className="btn-primary text-sm">Sign In</Link>
                </div>
              ) : !isParticipant ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Join this activity to access the chat</p>
                </div>
              ) : (
                <div>
                  <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-1">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-400 text-sm py-8">No messages yet. Say hi! 👋</p>
                    ) : (
                      messages.map((msg) => {
                        const isMine = msg.sender?._id === mongoUser?._id;
                        return (
                          <div key={msg._id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                            {msg.sender?.profileImage ? (
                              <img src={msg.sender.profileImage} alt={msg.sender.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                {getInitials(msg.sender?.name)}
                              </div>
                            )}
                            <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                              {!isMine && <span className="text-xs text-slate-400 mb-1">{msg.sender?.name}</span>}
                              <div className={`px-3 py-2 rounded-xl text-sm ${isMine ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-0.5">{timeAgo(msg.createdAt)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="input-field flex-1 py-2.5 text-sm"
                      id="chat-input"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn-primary px-4 py-2.5"
                      id="chat-send-btn"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Waitlist Tab */}
          {activeTab === 'waitlist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
              <h2 className="font-semibold text-white mb-4">Waitlist ({waitlist.length})</h2>
              {waitlist.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No one on the waitlist</p>
              ) : (
                <div className="space-y-3">
                  {waitlist.map((w, i) => (
                    <div key={w._id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 w-5 text-center">#{w.position}</span>
                      {w.user?.profileImage ? (
                        <img src={w.user.profileImage} alt={w.user.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center font-bold text-sm">
                          {getInitials(w.user?.name)}
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-300 block">{w.user?.name}</span>
                        {w.inGameId && (
                          <span className="text-[10px] text-primary-400 block">
                            IGN: {w.inGameId} {w.rank && <span className="text-slate-500">| {w.rank}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Crew Code Card */}
          {activity.crewCode && activity.visibility === 'Private' && (
            <div className="card p-5 bg-gradient-to-br from-primary-50 to-white border-primary-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Users className="w-16 h-16 text-primary-600" />
              </div>
              <h3 className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 relative z-10">Crew Code</h3>
              <div className="flex items-center justify-between bg-white border border-primary-200 rounded-xl p-3 relative z-10 shadow-sm">
                <span className="font-display font-black text-xl text-slate-800 tracking-widest">{activity.crewCode}</span>
                <button onClick={handleCopyCode} className="p-2 hover:bg-primary-50 text-primary-500 rounded-lg transition-colors" title="Copy Crew Code">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium relative z-10">Share this code with friends to let them join instantly!</p>
            </div>
          )}

          {/* Host Card */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Host</h3>
            <Link to={`/profile/${activity.host?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {activity.host?.profileImage ? (
                <img src={activity.host.profileImage} alt={activity.host.name} className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {getInitials(activity.host?.name)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">{activity.host?.name}</span>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="text-xs text-slate-400">Activity Host</span>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="card p-5 space-y-3">
            {!isCancelled && !isCompleted && (
              <>
                {isHost ? (
                  <>
                    <Link to={`/activities/${id}/edit`} className="btn-outline w-full justify-center">
                      <Pencil className="w-4 h-4" />
                      Edit Activity
                    </Link>
                    <button onClick={handleCancel} className="btn-danger w-full justify-center">
                      <Trash2 className="w-4 h-4" />
                      Cancel Activity
                    </button>
                    {isOngoing ? (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-bold text-sm">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Activity has started!
                        </div>
                        <button onClick={() => handleStatusChange('Completed')} className="btn-outline w-full justify-center text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                          Mark as Completed
                        </button>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <button onClick={() => handleStatusChange('Ongoing')} className="btn-primary w-full justify-center text-sm shadow-sm">
                          Start Activity
                        </button>
                        <button onClick={() => handleStatusChange('Completed')} className="btn-outline w-full justify-center text-xs text-slate-500 border-slate-200 hover:bg-slate-50">
                          End Activity
                        </button>
                      </div>
                    )}
                  </>
                ) : isParticipant ? (
                  <button
                    onClick={handleLeave}
                    disabled={leaving}
                    className="btn-danger w-full justify-center"
                    id="leave-activity-btn"
                  >
                    {leaving ? <Spinner size="sm" /> : <UserMinus className="w-4 h-4" />}
                    Leave Activity
                  </button>
                ) : isOnWaitlist ? (
                  <div className="text-center text-slate-500 text-sm py-2">
                    <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-500" />
                    You're on the waitlist
                    <button onClick={handleLeave} className="block w-full text-red-400 text-xs mt-2 hover:underline">
                      Leave waitlist
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="btn-primary w-full justify-center shadow-glow"
                    id="join-activity-btn"
                  >
                    {joining ? <Spinner size="sm" /> : <Users className="w-4 h-4" />}
                    {activity.status === 'Full' ? 'Join Waitlist' : 'Join Activity'}
                  </button>
                )}
              </>
            )}

            {isCancelled && (
              <div className="text-center text-orange-500 text-sm py-2 bg-orange-50 rounded-xl">
                This activity has been cancelled
              </div>
            )}

            {/* Report */}
            {!isHost && isSignedIn && (
              <button
                onClick={() => setShowReport((v) => !v)}
                className="btn-ghost w-full justify-center text-slate-400 hover:text-red-500 text-sm"
              >
                <Flag className="w-4 h-4" />
                Report Activity
              </button>
            )}

            {showReport && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Select reason</option>
                  <option value="Spam">Spam</option>
                  <option value="Fake Activity">Fake Activity</option>
                  <option value="Abuse">Abuse</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={handleReport} className="btn-danger w-full text-sm justify-center">
                  Submit Report
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Login Gate Modal */}
      <LoginGate
        isOpen={showLoginGate}
        onClose={() => setShowLoginGate(false)}
        action="join this activity"
      />

      {/* Gaming Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !joining && setShowJoinModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
            >
              <h2 className="text-xl font-display font-bold text-slate-800 mb-2">Join {activity.title}</h2>
              <p className="text-sm text-slate-500 mb-6">
                This is a gaming activity. The host requires your In-Game ID to add you.
                {activity.minRank && <span className="block mt-1 font-medium text-primary-600">Minimum Rank Required: {activity.minRank}</span>}
              </p>
              <form onSubmit={submitJoin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">In-Game ID / IGN *</label>
                  <input
                    type="text"
                    required
                    value={joinForm.inGameId}
                    onChange={(e) => setJoinForm(prev => ({ ...prev, inGameId: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. PlayerOne#1234"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Your Rank (Optional)</label>
                  <input
                    type="text"
                    value={joinForm.rank}
                    onChange={(e) => setJoinForm(prev => ({ ...prev, rank: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. Diamond 2"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    disabled={joining}
                    className="btn-ghost flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining || !joinForm.inGameId.trim()}
                    className="btn-primary flex-1 justify-center shadow-glow"
                  >
                    {joining ? <Spinner size="sm" /> : (activity.status === 'Full' ? 'Join Waitlist' : 'Join Game')}
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

export default ActivityDetailPage;
