import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (theme) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'auto' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'auto',

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      initTheme: () => {
        const { theme } = get();
        applyTheme(theme);

        // Watch system preference changes when in auto mode
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
          if (get().theme === 'auto') applyTheme('auto');
        };
        mq.addEventListener('change', handler);
      },
    }),
    { name: 'valuedocs-theme' }
  )
);
