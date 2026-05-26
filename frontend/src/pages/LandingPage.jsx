import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Shield, FileText, Users, Lock, Cloud, Bell, Search, Share2,
  ChevronRight, Star, CheckCircle, ArrowRight, Zap, Globe,
} from 'lucide-react';

const features = [
  { icon: Shield, title: 'Bank-Grade Security', description: 'Your documents are encrypted and protected with industry-leading security measures.', color: 'from-primary-500 to-violet-600' },
  { icon: Users, title: 'Family Management', description: 'Organize documents for all family members in one secure, unified vault.', color: 'from-pink-500 to-rose-600' },
  { icon: Bell, title: 'Expiry Reminders', description: 'Never miss a document expiry with smart automated reminders.', color: 'from-orange-500 to-amber-600' },
  { icon: Search, title: 'Smart Search', description: 'Find any document instantly with OCR-powered text extraction and search.', color: 'from-cyan-500 to-blue-600' },
  { icon: Share2, title: 'Easy Sharing', description: 'Share documents via WhatsApp or secure links in just one click.', color: 'from-green-500 to-emerald-600' },
  { icon: Cloud, title: 'Cloud Storage', description: 'Access your documents from any device, anywhere in the world.', color: 'from-slate-500 to-dark-600' },
];

const categories = [
  { emoji: '🪪', label: 'ID Proof' }, { emoji: '🏦', label: 'Banking' },
  { emoji: '🏥', label: 'Medical' }, { emoji: '🎓', label: 'Education' },
  { emoji: '🛡️', label: 'Insurance' }, { emoji: '🏠', label: 'Property' },
  { emoji: '🚗', label: 'Vehicle' }, { emoji: '📁', label: 'Others' },
];

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold font-display">ValueDocs</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Categories', 'Security'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-white/60 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary text-sm py-2 px-4">
            Get Started <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center py-24 lg:py-36 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Premium Document Management Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black font-display leading-tight mb-6 max-w-4xl mx-auto">
            Secure Your{' '}
            <span className="gradient-text">Important</span>
            {' '}Documents{' '}
            <span className="gradient-text">In One Place</span>
          </h1>

          <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The premium digital vault for you and your family. Store, organize, and access all vital documents with bank-grade security.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/signup" className="btn-primary text-base px-8 py-4">
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4 border-dark-600 bg-dark-800/50 text-white">
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap mt-10 text-sm text-dark-500">
            {['No credit card required', 'Free to start', 'Secure & private'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hero preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="glass-card border border-white/10 p-4 shadow-float">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 mx-4 h-7 rounded-lg bg-dark-800/80 border border-dark-700" />
            </div>
            {/* Mock dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: '28 Documents', icon: '📄', gradient: 'from-primary-500 to-violet-600' },
                { label: '5 Members', icon: '👨‍👩‍👧', gradient: 'from-pink-500 to-rose-600' },
                { label: '450 MB Used', icon: '💾', gradient: 'from-cyan-500 to-blue-600' },
                { label: '2 Expiring', icon: '⏰', gradient: 'from-orange-500 to-amber-600' },
              ].map(({ label, icon, gradient }, i) => (
                <div key={i} className="bg-dark-800/60 rounded-xl p-3 border border-dark-700/50">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm mb-2`}>
                    {icon}
                  </div>
                  <p className="text-xs text-dark-300 font-medium">{label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.slice(0, 6).map(({ emoji, label }) => (
                <div key={label} className="flex items-center gap-2 bg-dark-800/50 rounded-xl p-2.5 border border-dark-700/30">
                  <span className="text-base">{emoji}</span>
                  <span className="text-xs text-dark-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section id="categories" className="relative z-10 py-20 px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Organize Every Document Type</h2>
            <p className="text-dark-400 text-lg">8 smart categories for all your important documents</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {categories.map(({ emoji, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5 text-center border border-white/5 cursor-default"
              >
                <span className="text-3xl block mb-2">{emoji}</span>
                <span className="text-sm font-medium text-dark-300">{label}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Everything You Need</h2>
            <p className="text-dark-400 text-lg">Powerful features built for modern families</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map(({ icon: Icon, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 border border-white/5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Security section */}
      <section id="security" className="relative z-10 py-20 px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto glass-card p-10 lg:p-16 border border-primary-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-violet-600/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold font-display mb-4">Your Privacy is Our Priority</h2>
              <p className="text-dark-400 text-lg mb-8 max-w-2xl mx-auto">
                All documents are encrypted at rest and in transit. We use Firebase Authentication for secure access and Cloudinary for reliable, encrypted storage.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
                {[
                  { value: '256-bit', label: 'Encryption' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '0', label: 'Data Sold' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-black gradient-text">{value}</p>
                    <p className="text-dark-400 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-primary text-base px-8 py-4 inline-flex">
                Start Securing Your Documents
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">ValueDocs</span>
        </div>
        <p className="text-dark-500 text-sm">
          © 2025 ValueDocs. All rights reserved. Built with ❤️ for secure document management.
        </p>
      </footer>
    </div>
  );
}
