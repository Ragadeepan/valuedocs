import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="text-9xl font-black font-display gradient-text">404</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-dark-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link to="/dashboard" className="btn-primary inline-flex">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
