import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as documentService from '../services/documentService';

export const useDocuments = (filters = {}) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => documentService.getDocuments(filters),
    placeholderData: (prev) => prev,
  });
};

export const useDocument = (id) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocument(id),
    enabled: !!id,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, onProgress }) => documentService.uploadDocument(formData, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Document uploaded successfully!');
    },
    onError: (err) => toast.error(err.message || 'Upload failed'),
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => documentService.updateDocument(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      toast.success('Document updated!');
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Document deleted!');
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });
};

export const useRenameDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) => documentService.renameDocument(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document renamed!');
    },
    onError: (err) => toast.error(err.message || 'Rename failed'),
  });
};

export const useExpiringDocuments = () => {
  return useQuery({
    queryKey: ['documents', 'expiring'],
    queryFn: documentService.getExpiringDocuments,
    staleTime: 1000 * 60 * 10,
  });
};

export const useSearchDocuments = (query) => {
  return useQuery({
    queryKey: ['documents', 'search', query],
    queryFn: () => documentService.searchDocuments(query),
    enabled: !!query && query.length > 1,
    staleTime: 1000 * 30,
  });
};
