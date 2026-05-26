import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Upload, Trash2, Edit2, Share2, Eye, Clock } from 'lucide-react';
import { useActivityLogs } from '../hooks/useDashboard';
import { formatDateTime } from '../utils/formatters';
import { ListSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { ANIMATION_VARIANTS } from '../utils/constants';

const ACTION_CONFIG = {
  upload: { icon: Upload, label: 'Uploaded', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  delete: { icon: Trash2, label: 'Deleted', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  update: { icon: Edit2, label: 'Updated', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  share: { icon: Share2, label: 'Shared', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  view: { icon: Eye, label: 'Viewed', color: 'text-dark-400', bg: 'bg-dark-50 dark:bg-dark-800' },
  rename: { icon: Edit2, label: 'Renamed', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
};

export default function ActivityLogPage() {
  const { data: logs = [], isLoading } = useActivityLogs();

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Activity Log</h1>
        <p className="page-subtitle">Track all document actions and changes</p>
      </div>

      {isLoading ? (
        <ListSkeleton rows={10} />
      ) : logs.length === 0 ? (
        <EmptyState
          type="documents"
          title="No activity yet"
          description="Your document actions will appear here"
        />
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-dark-100 dark:bg-dark-700" />

            <motion.div
              variants={ANIMATION_VARIANTS.stagger}
              initial="hidden"
              animate="visible"
            >
              {logs.map((log, i) => {
                const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.view;
                const Icon = config.icon;

                return (
                  <motion.div
                    key={log._id || i}
                    variants={ANIMATION_VARIANTS.slideUp}
                    className="flex gap-4 p-4 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors relative"
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 z-10 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 dark:text-white">
                        <span className={`${config.color} font-semibold`}>{config.label}</span>
                        {' '}{log.entityName || 'document'}
                      </p>
                      {log.details && (
                        <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{log.details}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-dark-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:block">{formatDateTime(log.createdAt)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
