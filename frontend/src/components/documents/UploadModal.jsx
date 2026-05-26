import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, FileText, Image, CheckCircle, AlertCircle, Loader,
} from 'lucide-react';
import Modal from '../ui/Modal';
import { CATEGORIES, RELATIONS, FILE_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import { useUploadDocument } from '../../hooks/useDocuments';
import { useFamilyMembers } from '../../hooks/useFamily';
import { formatFileSize } from '../../utils/formatters';

export default function UploadModal({ onClose, familyMemberId: defaultFamilyMemberId }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { category: 'id-proof', familyMemberId: defaultFamilyMemberId || '' },
  });

  const { mutateAsync: uploadDoc, isPending } = useUploadDocument();
  const { data: familyMembers = [] } = useFamilyMembers();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDropRejected: (rejected) => {
      if (rejected[0]?.errors[0]?.code === 'file-too-large') {
        alert('File too large. Max 10MB allowed.');
      }
    },
  });

  const onSubmit = async (data) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', data.name || file.name.replace(/\.[^/.]+$/, ''));
    formData.append('category', data.category);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.familyMemberId) formData.append('familyMemberId', data.familyMemberId);
    if (data.notes) formData.append('notes', data.notes);

    await uploadDoc({ formData, onProgress: setUploadProgress });
    onClose();
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <Modal isOpen title="Upload Document" onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : ''}
            ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
            ${file ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-dark-200 dark:border-dark-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/5'}
          `}
        >
          <input {...getInputProps()} />

          {file ? (
            <div className="flex items-center gap-4">
              {isImage ? (
                <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded-xl" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-dark-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-dark-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-auto p-2 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7 text-primary-600" />
              </div>
              <p className="font-semibold text-dark-800 dark:text-white mb-1">
                {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-sm text-dark-400">Images and PDFs up to 10MB</p>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
              Document Name
            </label>
            <input
              {...register('name')}
              placeholder={file?.name?.replace(/\.[^/.]+$/, '') || 'Enter document name'}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select {...register('category', { required: true })} className="input-field">
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              {...register('expiryDate')}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          {familyMembers.length > 0 && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                For Family Member (optional)
              </label>
              <select {...register('familyMemberId')} className="input-field">
                <option value="">My Documents</option>
                {familyMembers.map((m) => (
                  <option key={m._id} value={m._id}>{m.name} ({m.relation})</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Optional notes about this document..."
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Upload progress */}
        {isPending && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-600 dark:text-dark-400">Uploading...</span>
              <span className="font-medium text-primary-600">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || isPending}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Document
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
