import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Users, Search, Activity } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const actions = [
  {
    icon: Upload,
    label: 'Upload Document',
    description: 'Add a new document',
    gradient: 'from-primary-500 to-violet-600',
    action: 'upload',
  },
  {
    icon: Users,
    label: 'Add Family Member',
    description: 'Manage family docs',
    gradient: 'from-pink-500 to-rose-600',
    action: 'family',
  },
  {
    icon: Search,
    label: 'Search Documents',
    description: 'Find any document',
    gradient: 'from-cyan-500 to-blue-600',
    action: 'search',
  },
  {
    icon: Activity,
    label: 'View Activity',
    description: 'Recent actions',
    gradient: 'from-green-500 to-emerald-600',
    action: 'activity',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { openUploadModal } = useUIStore();

  const handleAction = (action) => {
    if (action === 'upload') openUploadModal();
    else navigate(`/${action}`);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="section-title mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, description, gradient, action }, i) => (
          <motion.button
            key={action}
            onClick={() => handleAction(action)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 border border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600/40 transition-all text-left"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark-900 dark:text-white leading-tight">{label}</p>
              <p className="text-xs text-dark-500 dark:text-dark-400">{description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
