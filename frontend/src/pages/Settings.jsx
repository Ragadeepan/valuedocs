import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User, Shield, Bell, Palette, Lock, Save, LogOut, Loader,
  Sun, Moon, Monitor, Trash2, Download,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { updateUserProfile, logout } from '../services/authService';
import { getInitials } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Section = ({ icon: Icon, title, children }) => (
  <div className="glass-card p-6">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-100 dark:border-dark-700">
      <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
      <h2 className="font-bold text-dark-900 dark:text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default function Settings() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updated = await updateUserProfile(data);
      setUser(updated);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    useAuthStore.getState().logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.displayName || user?.email)
            )}
          </div>
          <div>
            <p className="font-bold text-dark-900 dark:text-white">{user?.displayName || 'User'}</p>
            <p className="text-sm text-dark-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Full Name</label>
            <input {...register('displayName')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Email</label>
            <input {...register('email')} type="email" disabled className="input-field opacity-60 cursor-not-allowed" />
            <p className="mt-1 text-xs text-dark-400">Email cannot be changed here</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance">
        <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">Choose your preferred color scheme</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${theme === value ? 'text-primary-600' : 'text-dark-500'}`} />
              <span className={`text-sm font-medium ${theme === value ? 'text-primary-600' : 'text-dark-600 dark:text-dark-400'}`}>
                {label}
              </span>
              {theme === value && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
            </button>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-700">
            <div>
              <p className="font-medium text-dark-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-dark-500">Add extra security to your account</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              Firebase Auth
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-dark-900 dark:text-white">Login Provider</p>
              <p className="text-sm text-dark-500">
                {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email & Password'}
              </p>
            </div>
            <Shield className="w-5 h-5 text-primary-500" />
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="glass-card p-6 border border-red-200/50 dark:border-red-500/20">
        <h2 className="font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-500" />
          Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-dark-900 dark:text-white">Sign Out</p>
            <p className="text-sm text-dark-500">Sign out from all devices</p>
          </div>
          <button onClick={handleLogout} className="btn-danger text-sm py-2 px-4">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
