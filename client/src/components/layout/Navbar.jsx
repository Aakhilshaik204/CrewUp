import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, User, LogOut, Settings, Shield, Menu, X,
  Zap, LayoutDashboard, Compass, ListChecks, ChevronDown, HandHeart
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { timeAgo, getInitials } from '../../utils/helpers';
import { getMe } from '../../api/users';

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const [mongoUser, setMongoUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      getMe().then((res) => setMongoUser(res.data.user)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore', href: '/feed', icon: Compass },
    { label: 'Borrow', href: '/requests', icon: HandHeart },
    { label: 'My Activities', href: '/my-activities', icon: ListChecks },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="w-[95%] max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center group hover:opacity-80 transition-opacity">
            <img src="/logo.jpeg" alt="CrewUp Logo" className="h-16 w-auto object-contain scale-[1.8] origin-left mix-blend-multiply" />
            <span className="hidden sm:inline-block ml-24 bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-orange-200 shadow-sm relative -top-0.5">SRM AP</span>
          </Link>

          {/* Desktop Nav Links */}
          <SignedIn>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </SignedIn>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <SignedIn>
              {/* Create Button */}
              <Link
                to="/activities/create"
                id="nav-create-btn"
                className="hidden sm:flex btn-primary py-2 px-4 text-sm shadow-glow"
              >
                <Plus className="w-4 h-4" />
                Create
              </Link>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  id="nav-notifications-btn"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                    if (!notifOpen && unreadCount > 0) markAllAsRead();
                  }}
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 card shadow-card-xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        <Link to="/notifications" className="text-primary-600 text-xs font-medium hover:underline">
                          View all
                        </Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-400 text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n._id}
                              className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-primary-50/50' : ''}`}
                              onClick={() => {
                                if (n.relatedActivity) navigate(`/activities/${n.relatedActivity._id || n.relatedActivity}`);
                                setNotifOpen(false);
                              }}
                            >
                              {!n.read && <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 align-middle" />}
                              <p className="text-sm text-slate-700 inline">{n.message}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div ref={profileRef} className="relative">
                <button
                  id="nav-profile-btn"
                  onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-all"
                >
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                      {getInitials(user?.fullName)}
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 card shadow-card-xl overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="font-semibold text-sm text-slate-800 truncate">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                        {mongoUser?.role === 'admin' && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                            <Shield className="w-2.5 h-2.5" /> Admin
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {[
                          { to: `/profile/${mongoUser?._id || user?.id}`, icon: User, label: 'My Profile' },
                          { to: '/my-activities', icon: ListChecks, label: 'My Activities' },
                          { to: '/profile/edit', icon: Settings, label: 'Edit Profile' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-slate-400" />
                            {label}
                          </Link>
                        ))}

                        {mongoUser?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => signOut(() => navigate('/'))}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SignedIn>

            <SignedOut>
              <Link to="/sign-in" className="btn-ghost text-sm">Sign In</Link>
              <Link to="/sign-up" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </SignedOut>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-100 py-2"
            >
              <SignedIn>
                {navLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium mx-1 ${isActive(href) ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
                <Link to="/activities/create" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl mx-1">
                  <Plus className="w-4 h-4" />
                  Create Activity
                </Link>
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" className="block px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl mx-1">Sign In</Link>
                <Link to="/sign-up" className="block px-3 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-xl mx-1">Get Started</Link>
              </SignedOut>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
