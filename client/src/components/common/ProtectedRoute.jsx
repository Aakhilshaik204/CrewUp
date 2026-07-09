import { Outlet } from 'react-router-dom';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import Spinner from './Spinner';

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-200">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn signInUrl="/sign-in" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
