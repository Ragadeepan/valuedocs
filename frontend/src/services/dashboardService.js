import api from '../lib/axios';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

export const getActivityLogs = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get(`/activity?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getStorageStats = async () => {
  const response = await api.get('/dashboard/storage');
  return response.data.data;
};

export const getCategoryStats = async () => {
  const response = await api.get('/dashboard/categories');
  return response.data.data;
};

export const getUploadTrend = async ({ period = '7d' } = {}) => {
  const response = await api.get(`/dashboard/uploads?period=${period}`);
  return response.data.data;
};
