import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { syncUser } from '../api/users';

/**
 * Syncs the authenticated Clerk user to MongoDB on every sign-in.
 * Should be called once at the App level.
 */
export const useSyncUser = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const sync = async () => {
      try {
        await syncUser({
          clerkId: user.id,
          name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
          profileImage: user.imageUrl,
        });
      } catch (error) {
        console.error('User sync failed:', error);
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user]);
};
