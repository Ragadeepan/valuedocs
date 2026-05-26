import api from '../lib/axios';

export const getDocuments = async ({ category, search, sort, familyMemberId } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  if (familyMemberId) params.append('familyMemberId', familyMemberId);
  const response = await api.get(`/documents?${params}`);
  return response.data.data;
};

export const getDocument = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data.data;
};

export const uploadDocument = async (formData, onProgress) => {
  const response = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data.data;
};

export const updateDocument = async (id, data) => {
  const response = await api.put(`/documents/${id}`, data);
  return response.data.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const renameDocument = async (id, name) => {
  const response = await api.patch(`/documents/${id}/rename`, { name });
  return response.data.data;
};

export const getShareLink = async (id) => {
  const response = await api.post(`/documents/${id}/share`);
  return response.data.data;
};

export const searchDocuments = async (query) => {
  const response = await api.get(`/documents/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

export const getExpiringDocuments = async () => {
  const response = await api.get('/documents/expiring');
  return response.data.data;
};
