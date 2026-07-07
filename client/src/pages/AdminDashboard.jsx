import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Flag, LayoutDashboard, Settings, PieChart, Ban, Trash2, CheckCircle, XCircle, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';
import { AdminTableSkeleton } from '../components/common/Skeleton';
import { timeAgo } from '../utils/helpers';

// Helper for generic stat cards
const StatCard = ({ icon: Icon, value, label, trend, trendUp, iconColor, iconBg }) => (
  <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-slate-100 flex flex-col">
    <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-4 shadow-sm`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="font-display font-black text-3xl text-slate-900 mb-3">{value}</div>
    <div className={`text-xs font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
      {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {trend} <span className="text-slate-400 font-medium ml-1">vs. last week</span>
    </div>
  </div>
);

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'reports', label: 'Reports', icon: Flag },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
      fetchActivities(); // Fetch activities for the live feed
    }
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'activities') fetchActivities();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data.stats);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/users', { params: { search: userSearch } });
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/activities');
      setActivities(res.data.activities);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/reports');
      setReports(res.data.reports);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/ban`);
      toast.success('User ban status toggled');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to ban/unban user');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('Delete this activity permanently?')) return;
    try {
      await api.delete(`/api/admin/activities/${activityId}`);
      toast.success('Activity deleted');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await api.put(`/api/admin/reports/${reportId}`, { status });
      toast.success(`Report marked as ${status}`);
      fetchReports();
    } catch (error) {
      toast.error('Failed to update report');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#fdfaf7] text-slate-900 overflow-hidden font-sans">
      {/* Mobile Nav */}
      <div className="md:hidden flex flex-col bg-white border-b border-slate-100 p-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-black text-xl tracking-tight text-slate-900">
            CrewUp Admin
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
          {NAV_ITEMS.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`snap-start shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                 activeTab === item.id 
                   ? 'bg-[#fff5ee] text-orange-600 shadow-sm border border-orange-100' 
                   : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
               }`}
             >
               {item.label}
             </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="font-display font-black text-2xl tracking-tight text-slate-900">
            CrewUp
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex flex-col items-center justify-center py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-[#fff5ee] text-orange-600 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-2 ${activeTab === item.id ? 'text-orange-500' : ''}`} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-slate-900">
              Admin Command Center
            </h1>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">System Health: Optimal (99.9%)</span>
            </div>
          </div>

          {/* Overview Content */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                  icon={Users} 
                  label="Total Users" 
                  value={(stats?.totalUsers || 125400).toLocaleString()} 
                  trend="↑ 8%" 
                  trendUp={true}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                />
                <StatCard 
                  icon={Activity} 
                  label="Active Matches" 
                  value={(stats?.openActivities || 0).toLocaleString()} 
                  trend="↑ 12%" 
                  trendUp={true}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                />
                <StatCard 
                  icon={Activity} 
                  label="Total Activities" 
                  value={(stats?.totalActivities || 0).toLocaleString()} 
                  trend="↑ 5%" 
                  trendUp={true}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                />
                <StatCard 
                  icon={Flag} 
                  label="Reports" 
                  value={(stats?.pendingReports || 0).toLocaleString()} 
                  trend="↓ 2%" 
                  trendUp={false}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                />
              </div>

              {/* Live Activity Feed */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Live Activity Feed</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activities.slice(0, 5).map((a) => (
                        <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{timeAgo(a.createdAt)}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{a.host?.name || 'Unknown User'}</td>
                          <td className="px-6 py-4 text-slate-700">Created {a.category} Match</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                              a.status === 'Open' ? 'bg-emerald-100 text-emerald-600' : 
                              a.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                              'bg-orange-100 text-orange-600'
                            }`}>{a.status}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{a.title}</td>
                        </tr>
                      ))}
                      {activities.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">No recent activities found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Table */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="flex-1 bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button onClick={fetchUsers} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Search</button>
              </div>
              
              {loading ? <AdminTableSkeleton rows={6} /> : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {u.profileImage ? (
                                  <img src={u.profileImage} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{u.name?.[0]}</div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900">{u.name}</div>
                                  <div className="text-slate-500 text-xs">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${u.isBanned ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {u.isBanned ? 'BANNED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleBanUser(u._id)}
                                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                    u.isBanned
                                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                                  }`}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  {u.isBanned ? 'UNBAN' : 'BAN'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Activities Table */}
          {activeTab === 'activities' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loading ? <AdminTableSkeleton rows={6} /> : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Activity</th>
                          <th className="px-6 py-4">Host</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Players</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activities.map((a) => (
                          <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{a.title}</div>
                              <div className="text-slate-500 text-xs">{a.category}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-700 font-medium">{a.host?.name}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                a.status === 'Open' ? 'bg-emerald-100 text-emerald-600' :
                                a.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>{a.status}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{a.currentPlayers}/{a.maxPlayers}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteActivity(a._id)}
                                className="flex items-center gap-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                DELETE
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loading ? <AdminTableSkeleton rows={4} /> : (
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100">No reports found</div>
                  ) : (
                    reports.map((r) => (
                      <div key={r._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-black text-slate-900 text-lg">{r.reason}</span>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                r.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                r.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>{r.status}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-1">
                              Reported by: <span className="font-bold text-slate-700">{r.reporter?.name}</span>
                            </p>
                            {r.targetActivity && (
                              <p className="text-sm text-slate-500 mb-3">
                                Activity: <span className="font-bold text-orange-600">{r.targetActivity?.title}</span>
                              </p>
                            )}
                            {r.description && <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{r.description}</p>}
                            <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-widest">{timeAgo(r.createdAt)}</p>
                          </div>
                          {r.status === 'Pending' && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleUpdateReport(r._id, 'Resolved')}
                                className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                                title="Resolve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleUpdateReport(r._id, 'Dismissed')}
                                className="p-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                                title="Dismiss"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {['analytics', 'settings'].includes(activeTab) && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
              <p className="text-slate-400 font-bold uppercase tracking-widest">Module under construction</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar (Insights) */}
      <aside className="w-80 bg-white border-l border-slate-100 flex flex-col hidden xl:flex overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Platform Insights</h3>
          
          {/* Donut Chart */}
          <div className="flex justify-center mb-8">
            <div 
              className="w-48 h-48 rounded-full relative shadow-sm flex items-center justify-center"
              style={{ background: 'conic-gradient(#ea580c 0% 45%, #f97316 45% 75%, #fdba74 75% 90%, #f1f5f9 90% 100%)' }}
            >
              <div className="w-32 h-32 bg-white rounded-full shadow-inner absolute inset-0 m-auto flex items-center justify-center flex-col">
                <span className="font-display font-black text-2xl text-slate-900">{stats?.totalUsers || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</span>
              </div>
            </div>
          </div>

          {/* Sport Distribution */}
          <div className="mb-10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Sport Distribution</h4>
            <div className="space-y-3">
              {(stats?.distribution || [
                { name: 'Soccer', percentage: 45 },
                { name: 'Basketball', percentage: 30 },
                { name: 'Tennis', percentage: 15 },
                { name: 'Others', percentage: 10 }
              ]).map((sport, index) => (
                <div key={sport.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${['bg-[#ea580c]', 'bg-[#f97316]', 'bg-[#fdba74]', 'bg-[#f1f5f9]'][index] || 'bg-slate-200'}`} />
                    <span className="font-medium text-slate-700">{sport.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{sport.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Server Load */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Server Load</h4>
            <div className="mb-2 flex justify-between text-xs font-bold text-slate-700">
              <span>LOAD: 42%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" style={{ width: '42%' }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>CPU: 30%</span>
              <span>RAM: 55%</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminDashboard;
