import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const illustrations = {
  documents: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
      <rect x="40" y="20" width="80" height="100" rx="8" fill="url(#docGrad)" opacity="0.3" />
      <rect x="55" y="10" width="80" height="100" rx="8" fill="url(#docGrad)" opacity="0.5" />
      <rect x="70" y="0" width="80" height="100" rx="8" fill="url(#docGrad)" />
      <rect x="82" y="20" width="44" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="82" y="32" width="36" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="82" y="44" width="40" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="82" y="56" width="28" height="4" rx="2" fill="white" opacity="0.3" />
      <circle cx="150" cy="120" r="30" fill="url(#circGrad)" opacity="0.8" />
      <path d="M140 120 L148 128 L162 112" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="docGrad" x1="70" y1="0" x2="150" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="circGrad" x1="120" y1="90" x2="180" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  ),
  family: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
      <circle cx="100" cy="50" r="25" fill="url(#famGrad1)" />
      <circle cx="55" cy="90" r="20" fill="url(#famGrad2)" />
      <circle cx="145" cy="90" r="20" fill="url(#famGrad3)" />
      <path d="M80 90 Q100 70 120 90" stroke="#6366f1" strokeWidth="2" fill="none" strokeDasharray="4 2" />
      <path d="M62 90 Q78 75 100 75" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="4 2" />
      <path d="M138 90 Q122 75 100 75" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="4 2" />
      <defs>
        <linearGradient id="famGrad1" x1="75" y1="25" x2="125" y2="75" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="famGrad2" x1="35" y1="70" x2="75" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" /><stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="famGrad3" x1="125" y1="70" x2="165" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" /><stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32">
      <circle cx="85" cy="75" r="45" stroke="url(#searchGrad)" strokeWidth="4" fill="none" opacity="0.5" />
      <circle cx="85" cy="75" r="30" fill="url(#searchGrad)" opacity="0.15" />
      <line x1="120" y1="110" x2="155" y2="145" stroke="url(#searchGrad)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <path d="M73 62 Q85 55 97 62" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="73" cy="68" r="3" fill="#6366f1" />
      <circle cx="97" cy="68" r="3" fill="#6366f1" />
      <path d="M73 85 Q85 92 97 85" stroke="#6366f1" strokeWidth="2" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="searchGrad" x1="40" y1="30" x2="130" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

export default function EmptyState({ type = 'documents', title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        {illustrations[type] || illustrations.documents}
      </motion.div>

      <h3 className="text-xl font-bold text-dark-800 dark:text-white mb-2">{title}</h3>
      <p className="text-dark-500 dark:text-dark-400 mb-6 max-w-xs">{description}</p>

      {action && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
