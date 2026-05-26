import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Image, MoreVertical, Download, Trash2, Edit2, Share2, Clock, Lock,
} from 'lucide-react';
import { CategoryBadge, ExpiryBadge } from '../ui/Badge';
import { formatDate, formatFileSize, getDaysUntilExpiry, isImageFile } from '../../utils/formatters';
import { downloadFile } from '../../utils/helpers';
import { useDeleteDocument } from '../../hooks/useDocuments';
import toast from 'react-hot-toast';

export default function DocumentCard({ doc, onRename, onShare, basePath = '/documents' }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mutateAsync: deleteDoc } = useDeleteDocument();
  const daysLeft = getDaysUntilExpiry(doc.expiryDate);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteDoc(doc._id);
    } finally {
      setDeleting(false);
    }
    setMenuOpen(false);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadFile(doc.fileUrl, doc.name);
    setMenuOpen(false);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare?.(doc);
    setMenuOpen(false);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    onRename?.(doc);
    setMenuOpen(false);
  };

  const isImage = isImageFile(doc.mimeType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="doc-card relative overflow-hidden"
      onClick={() => navigate(`${basePath}/${doc._id}`)}
    >
      {/* Pin lock indicator */}
      {doc.pinLocked && (
        <div className="absolute top-3 left-3 z-10">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Lock className="w-3 h-3 text-amber-500" />
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gradient-to-br from-dark-100 to-dark-200 dark:from-dark-800 dark:to-dark-700 mb-3">
        {isImage ? (
          <img
            src={doc.thumbnailUrl || doc.fileUrl}
            alt={doc.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
            <span className="text-xs font-medium text-dark-500 dark:text-dark-400 uppercase">PDF</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-dark-900 dark:text-white line-clamp-1 flex-1">
            {doc.name}
          </h3>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all flex-shrink-0"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={doc.category} />
          {daysLeft !== null && daysLeft <= 30 && <ExpiryBadge daysLeft={daysLeft} />}
        </div>

        <div className="flex items-center justify-between text-xs text-dark-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(doc.createdAt)}
          </span>
          {doc.size && <span>{formatFileSize(doc.size)}</span>}
        </div>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-12 right-3 z-20 w-44 glass-card border border-dark-100 dark:border-dark-700 shadow-float overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { icon: Download, label: 'Download', action: handleDownload },
              { icon: Share2, label: 'Share', action: handleShare },
              { icon: Edit2, label: 'Rename', action: handleRename },
              { icon: Trash2, label: 'Delete', action: handleDelete, danger: true },
            ].map(({ icon: Icon, label, action, danger }) => (
              <button
                key={label}
                onClick={action}
                disabled={deleting}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                  ${danger
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
