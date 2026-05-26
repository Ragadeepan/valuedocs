import React from 'react';
import { useForm } from 'react-hook-form';
import { Users, Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useAddFamilyMember, useUpdateFamilyMember } from '../../hooks/useFamily';
import { RELATIONS } from '../../utils/constants';

export default function AddMemberModal({ member, onClose }) {
  const isEditing = !!member;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: member || { name: '', relation: 'Spouse', dob: '' },
  });

  const { mutateAsync: addMember, isPending: adding } = useAddFamilyMember();
  const { mutateAsync: updateMember, isPending: updating } = useUpdateFamilyMember();
  const isPending = adding || updating;

  const onSubmit = async (data) => {
    if (isEditing) {
      await updateMember({ id: member._id, data });
    } else {
      await addMember(data);
    }
    onClose();
  };

  return (
    <Modal isOpen title={isEditing ? 'Edit Family Member' : 'Add Family Member'} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="input-field"
            placeholder="e.g., Priya Sharma"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
            Relation <span className="text-red-500">*</span>
          </label>
          <select {...register('relation', { required: true })} className="input-field">
            {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('dob')}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Optional notes..."
            className="input-field resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isPending} className="btn-primary flex-1">
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
