import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { getMe } from '../../api/users';
import Spinner from './Spinner';

const AdminRoute = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (!isSignedIn) return;
    getMe()
      .then((res) => setIsAdmin(res.data.user.role === 'admin'))
      .catch(() => setIsAdmin(false));
  }, [isSignedIn]);

  if (!isLoaded || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-200">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!isAdmin) return <Navigate to="/feed" replace />;

  return <Outlet />;
};

export default AdminRoute;
