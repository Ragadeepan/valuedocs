import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, FileText, Users, Search, Activity,
  Settings, LogOut, ChevronLeft, ChevronRight, Plus, Bell, X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { logout } from '../services/authService';
import { getInitials } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useExpiringDocuments } from '../hooks/useDocuments';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/documents', icon: FileText, label: 'My Documents' },
  { path: '/family', icon: Users, label: 'Family Docs' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/activity', icon: Activity, label: 'Activity' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ mobile = false, onClose }) {
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse, openUploadModal } = useUIStore();
  const { data: expiringDocs } = useExpiringDocuments();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      useAuthStore.getState().logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const collapsed = !mobile && sidebarCollapsed;

  return (
    <motion.aside
      initial={mobile ? { x: -280 } : false}
      animate={mobile ? { x: 0 } : {}}
      exit={mobile ? { x: -280 } : {}}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        flex flex-col h-full bg-gradient-to-b from-dark-950 via-[#0d0d1a] to-dark-950
        border-r border-white/5 relative overflow-hidden
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary-600/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className={`flex items-center gap-3 p-4 pt-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <NavLink to="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow flex-shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold font-display text-white truncate"
            >
              ValueDocs
            </motion.span>
          )}
        </NavLink>

        {!mobile && (
          <button
            onClick={toggleSidebarCollapse}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {mobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload button */}
      <div className={`px-3 mb-4 ${collapsed ? 'px-2' : ''}`}>
        <button
          onClick={openUploadModal}
          className={`
            w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-primary-600 to-violet-600
            hover:from-primary-500 hover:to-violet-500
            shadow-lg hover:shadow-glow transition-all duration-200
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Upload Document</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-white/20">
            Navigation
          </p>
        )}
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) => `
              sidebar-link ${isActive ? 'active' : ''} relative
              ${collapsed ? 'justify-center px-2' : ''}
            `}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/15"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                {!collapsed && (
                  <span className="relative z-10 flex items-center gap-auto justify-between w-full">
                    {label}
                    {label === 'Activity' && expiringDocs?.length > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/20">
                        {expiringDocs.length}
                      </span>
                    )}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className={`p-3 border-t border-white/5 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="glass rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  getInitials(user?.displayName || user?.email)
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
