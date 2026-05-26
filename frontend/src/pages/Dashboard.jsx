import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, HardDrive, Clock } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import UploadChart from '../components/dashboard/UploadChart';
import StorageChart from '../components/dashboard/StorageChart';
import QuickActions from '../components/dashboard/QuickActions';
import ExpiryAlerts from '../components/dashboard/ExpiryAlerts';
import RecentDocuments from '../components/dashboard/RecentDocuments';
import { useDashboardStats, useCategoryStats } from '../hooks/useDashboard';
import { useAuthStore } from '../store/authStore';
import { formatFileSize } from '../utils/formatters';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { ANIMATION_VARIANTS } from '../utils/constants';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: categoryData } = useCategoryStats();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statsCards = [
    {
      icon: FileText,
      label: 'Total Documents',
      value: stats?.totalDocuments ?? '—',
      trend: stats?.documentsTrend,
      trendLabel: 'vs last month',
      gradient: 'from-primary-500 to-violet-600',
    },
    {
      icon: Users,
      label: 'Family Members',
      value: stats?.familyMembers ?? '—',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: stats?.storageUsed ? formatFileSize(stats.storageUsed) : '—',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Clock,
      label: 'Expiring Soon',
      value: stats?.expiringSoon ?? '—',
      gradient: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-dark-900 dark:text-white">
            {greeting()}, {user?.displayName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mt-1">
            Here's what's happening with your documents today.
          </p>
        </motion.div>
      </div>

      {/* Stats grid */}
      <motion.div
        variants={ANIMATION_VARIANTS.stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statsCards.map((card, i) => (
            <StatsCard key={i} {...card} delay={i * 0.08} />
          ))
        }
      </motion.div>

      {/* Expiry alerts */}
      <ExpiryAlerts />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UploadChart />
        </div>
        <StorageChart data={categoryData} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDocuments />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
