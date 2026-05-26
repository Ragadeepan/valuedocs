import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStorageStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'storage'],
    queryFn: dashboardService.getStorageStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoryStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: dashboardService.getCategoryStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUploadTrend = (period = '7d') => {
  return useQuery({
    queryKey: ['dashboard', 'uploads', period],
    queryFn: () => dashboardService.getUploadTrend({ period }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useActivityLogs = ({ page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ['activity', page],
    queryFn: () => dashboardService.getActivityLogs({ page, limit }),
  });
};
