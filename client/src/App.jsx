import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Spinner from './components/common/Spinner';

// Pages
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import FeedPage from './pages/FeedPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import CreateActivityPage from './pages/CreateActivityPage';
import EditActivityPage from './pages/EditActivityPage';
import MyActivitiesPage from './pages/MyActivitiesPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import RequestsFeedPage from './pages/RequestsFeedPage';
import CreateRequestPage from './pages/CreateRequestPage';
import RequestDetailPage from './pages/RequestDetailPage';
import NotFoundPage from './pages/NotFoundPage';

import { useLocation } from 'react-router-dom';
import { useSyncUser } from './hooks/useSyncUser';

const AppContent = () => {
  useSyncUser();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/activities/:id" element={<ActivityDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activities/create" element={<CreateActivityPage />} />
            <Route path="/activities/:id/edit" element={<EditActivityPage />} />
            <Route path="/my-activities" element={<MyActivitiesPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Requests */}
            <Route path="/requests" element={<RequestsFeedPage />} />
            <Route path="/requests/create" element={<CreateRequestPage />} />
            <Route path="/requests/:id" element={<RequestDetailPage />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {isLandingPage && <Footer />}
    </div>
  );
};

const App = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.jpeg" alt="CrewUp" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </SocketProvider>
  );
};

export default App;
