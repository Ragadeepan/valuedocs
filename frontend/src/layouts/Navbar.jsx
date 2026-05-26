import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useExpiringDocuments } from '../hooks/useDocuments';
import { getInitials, getDaysUntilExpiry } from '../utils/formatters';
import { debounce } from '../utils/helpers';
import { CATEGORY_MAP } from '../utils/constants';

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { setSearchQuery } = useUIStore();
  const { data: expiringDocs = [] } = useExpiringDocuments();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef(null);

  const debouncedSearch = debounce((val) => {
    if (val.length > 1) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    }
  }, 400);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debouncedSearch(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="relative h-16 flex items-center px-4 lg:px-6 gap-4 bg-white/60 dark:bg-dark-900/60 backdrop-blur-md border-b border-dark-100 dark:border-dark-800 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 active:bg-dark-200 dark:active:bg-dark-700 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop search bar */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:block flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchValue}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
          />
        </div>
      </form>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.form
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            exit={{ opacity: 0, width: 0 }}
            onSubmit={handleSearchSubmit}
            className="sm:hidden absolute left-0 right-0 top-0 h-16 flex items-center px-4 gap-3 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md z-50"
          >
            <Search className="w-4 h-4 text-dark-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search documents..."
              value={searchValue}
              onChange={handleSearch}
              className="flex-1 text-sm bg-transparent border-none outline-none text-dark-900 dark:text-dark-100 placeholder:text-dark-400"
            />
            <button type="button" onClick={() => { setShowSearch(false); setSearchValue(''); }} className="p-1.5">
              <X className="w-4 h-4 text-dark-400" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        {/* Mobile search button */}
        <button
          onClick={() => setShowSearch(true)}
          className="sm:hidden p-2.5 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
        >
          <Search className="w-5 h-5" />
        </button>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
          >
            <Bell className="w-5 h-5" />
            {expiringDocs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-900" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 glass-card border border-dark-100 dark:border-dark-700 shadow-float overflow-hidden z-50"
              >
                <div className="p-4 border-b border-dark-100 dark:border-dark-700">
                  <h3 className="font-semibold text-dark-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {expiringDocs.length === 0 ? (
                    <p className="p-4 text-sm text-dark-400 text-center">No alerts</p>
                  ) : (
                    expiringDocs.map((doc) => {
                      const days = getDaysUntilExpiry(doc.expiryDate);
                      return (
                        <div
                          key={doc._id}
                          onClick={() => { navigate(`/documents/${doc._id}`); setShowNotifications(false); }}
                          className="p-4 flex gap-3 hover:bg-dark-50 dark:hover:bg-dark-800 cursor-pointer transition-colors border-b border-dark-50 dark:border-dark-800"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-sm">{CATEGORY_MAP[doc.category]?.icon || '📄'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{doc.name}</p>
                            <p className="text-xs text-red-500 mt-0.5">
                              {days <= 0 ? 'Expired!' : `Expires in ${days} day${days !== 1 ? 's' : ''}`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-glow transition-all overflow-hidden"
          onClick={() => navigate('/settings')}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            getInitials(user?.displayName || user?.email)
          )}
        </div>
      </div>
    </header>
  );
}
