import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-dark flex overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/40 via-bg-dark to-bg-dark" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Left panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-white">ValueDocs</span>
        </Link>

        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl font-bold font-display text-white leading-tight mb-6">
              Secure Your{' '}
              <span className="gradient-text">Important</span>
              {' '}Documents
            </h1>
            <p className="text-dark-400 text-lg leading-relaxed mb-10">
              Store, organize, and share your family's vital documents with bank-grade security. Access anytime, from anywhere.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {[
              { emoji: '🔒', text: 'End-to-end encrypted storage' },
              { emoji: '👨‍👩‍👧‍👦', text: 'Family document management' },
              { emoji: '📱', text: 'Access from any device' },
              { emoji: '⏰', text: 'Smart expiry reminders' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 text-dark-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating document cards */}
          <motion.div
            className="mt-12 grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {['🪪 Aadhaar', '🏦 Bank', '🎓 Degree', '🚗 RC Book', '🛡️ Insurance', '🏠 Property'].map((doc, i) => (
              <div
                key={i}
                className="glass rounded-xl p-3 text-center text-xs text-dark-400 border border-white/5"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {doc}
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-dark-500 text-sm">© 2025 ValueDocs. All rights reserved.</p>
      </div>

      {/* Right panel - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-white">ValueDocs</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 border border-white/10"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
