import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Image, ArrowRight, Clock } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { CategoryBadge } from '../ui/Badge';
import { formatRelative, formatFileSize, isImageFile } from '../../utils/formatters';
import { ListSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { useUIStore } from '../../store/uiStore';

export default function RecentDocuments() {
  const navigate = useNavigate();
  const { openUploadModal } = useUIStore();
  const { data: documents = [], isLoading } = useDocuments({ sort: 'newest' });
  const recent = documents.slice(0, 5);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">Recent Documents</h3>
        <button
          onClick={() => navigate('/documents')}
          className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : recent.length === 0 ? (
        <EmptyState
          type="documents"
          title="No documents yet"
          description="Upload your first document to get started"
          action={
            <button onClick={openUploadModal} className="btn-primary text-sm px-4 py-2">
              Upload Document
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {recent.map((doc, i) => {
            const isImg = isImageFile(doc.mimeType);
            return (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/documents/${doc._id}`)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-100 dark:bg-dark-700 flex-shrink-0">
                  {isImg ? (
                    <img src={doc.thumbnailUrl || doc.fileUrl} alt={doc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-dark-900 dark:text-white truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CategoryBadge category={doc.category} />
                    <span className="text-xs text-dark-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(doc.createdAt)}
                    </span>
                  </div>
                </div>

                {doc.size && (
                  <span className="text-xs text-dark-400 flex-shrink-0 hidden sm:block">
                    {formatFileSize(doc.size)}
                  </span>
                )}

                <ArrowRight className="w-4 h-4 text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
