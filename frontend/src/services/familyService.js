import api from '../lib/axios';

export const getFamilyMembers = async () => {
  const response = await api.get('/family');
  return response.data.data;
};

export const getFamilyMember = async (id) => {
  const response = await api.get(`/family/${id}`);
  return response.data.data;
};

export const addFamilyMember = async (data) => {
  const response = await api.post('/family', data);
  return response.data.data;
};

export const updateFamilyMember = async (id, data) => {
  const response = await api.put(`/family/${id}`, data);
  return response.data.data;
};

export const deleteFamilyMember = async (id) => {
  const response = await api.delete(`/family/${id}`);
  return response.data;
};

export const getFamilyMemberDocuments = async (id, { category, search, sort } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  const response = await api.get(`/family/${id}/documents?${params}`);
  return response.data.data;
};
