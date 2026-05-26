import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Loader, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signUpWithEmail } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { setUser, setFirebaseUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { firebaseUser, user } = await signInWithGoogle();
      setFirebaseUser(firebaseUser);
      setUser(user);
      toast.success(`Welcome to ValueDocs, ${user.displayName || 'there'}!`);
    } catch (err) {
      setError(err.message || 'Google signup failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true);
    setError('');
    try {
      const { firebaseUser, user } = await signUpWithEmail(email, password, name);
      setFirebaseUser(firebaseUser);
      setUser(user);
      toast.success('Account created! Welcome to ValueDocs!');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-display text-white">Create your vault</h2>
        <p className="text-dark-400 mt-1">Join ValueDocs and secure your documents</p>
      </div>

      <motion.button
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dark-600 bg-dark-800/50 text-white font-medium hover:bg-dark-700/50 transition-all mb-6 disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </motion.button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-dark-700" />
        <span className="text-xs text-dark-500 font-medium">or create with email</span>
        <div className="flex-1 h-px bg-dark-700" />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              {...register('name', { required: 'Name is required' })}
              className="input-field pl-10 bg-dark-800/50 border-dark-600 text-white placeholder:text-dark-500 focus:border-primary-500"
              placeholder="Your full name"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
              type="email"
              className="input-field pl-10 bg-dark-800/50 border-dark-600 text-white placeholder:text-dark-500 focus:border-primary-500"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
              })}
              type={showPassword ? 'text' : 'password'}
              className="input-field pl-10 pr-10 bg-dark-800/50 border-dark-600 text-white placeholder:text-dark-500 focus:border-primary-500"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={loading || googleLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-primary w-full mt-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-dark-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
