import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { syncUser } from '../api/users';
import toast from 'react-hot-toast';

/**
 * Syncs the authenticated Clerk user to MongoDB on every sign-in.
 * Should be called once at the App level.
 */
export const useSyncUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const sync = async () => {
      let toastId = null;
      
      // Render free tier cold-start UX
      const timeoutId = setTimeout(() => {
        toastId = toast.loading('Waking up the server... This might take a minute! ☕', {
          duration: 60000, // keep it around while it loads
        });
      }, 2500);

      try {
        await syncUser({
          clerkId: user.id,
          name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
          profileImage: user.imageUrl,
        });
      } catch (error) {
        console.error('User sync failed:', error);
      } finally {
        clearTimeout(timeoutId);
        if (toastId) {
          toast.success('Server is awake! 🚀', { id: toastId });
        }
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user]);
};
