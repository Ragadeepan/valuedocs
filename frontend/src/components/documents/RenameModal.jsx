import React from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useRenameDocument } from '../../hooks/useDocuments';

export default function RenameModal({ document, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: document?.name || '' },
  });
  const { mutateAsync: renameDoc, isPending } = useRenameDocument();

  const onSubmit = async ({ name }) => {
    await renameDoc({ id: document._id, name });
    onClose();
  };

  return (
    <Modal isOpen title="Rename Document" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
            New Name
          </label>
          <input
            {...register('name', { required: 'Name is required', minLength: { value: 1, message: 'Name cannot be empty' } })}
            className="input-field"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isPending} className="btn-primary flex-1">
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
            Rename
          </button>
        </div>
      </form>
    </Modal>
  );
}
