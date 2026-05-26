import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as familyService from '../services/familyService';

export const useFamilyMembers = () => {
  return useQuery({
    queryKey: ['family'],
    queryFn: familyService.getFamilyMembers,
  });
};

export const useFamilyMember = (id) => {
  return useQuery({
    queryKey: ['family', id],
    queryFn: () => familyService.getFamilyMember(id),
    enabled: !!id,
  });
};

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: familyService.addFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Family member added!');
    },
    onError: (err) => toast.error(err.message || 'Failed to add member'),
  });
};

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => familyService.updateFamilyMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.invalidateQueries({ queryKey: ['family', id] });
      toast.success('Family member updated!');
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });
};

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: familyService.deleteFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Family member removed!');
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });
};

export const useFamilyMemberDocuments = (id, filters = {}) => {
  return useQuery({
    queryKey: ['family', id, 'documents', filters],
    queryFn: () => familyService.getFamilyMemberDocuments(id, filters),
    enabled: !!id,
  });
};
