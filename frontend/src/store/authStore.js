import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => set({ user: null, firebaseUser: null }),

      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'valuedocs-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
