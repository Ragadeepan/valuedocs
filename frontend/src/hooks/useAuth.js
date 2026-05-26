import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { getCurrentUserProfile } from '../services/authService';

export const useAuth = () => {
  const { user, firebaseUser, loading, setUser, setFirebaseUser, setLoading, setInitialized, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userProfile = await getCurrentUserProfile();
          setUser(userProfile);
        } catch {
          setUser(null);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  return { user, firebaseUser, loading, isAuthenticated: !!user };
};
