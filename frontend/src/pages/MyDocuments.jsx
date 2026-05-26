import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useUIStore } from '../store/uiStore';
import DocumentCard from '../components/documents/DocumentCard';
import FilterBar from '../components/documents/FilterBar';
import ShareModal from '../components/documents/ShareModal';
import RenameModal from '../components/documents/RenameModal';
import EmptyState from '../components/ui/EmptyState';
import { DocumentCardSkeleton, ListSkeleton } from '../components/ui/Skeleton';
import { sortDocuments, filterDocuments } from '../utils/helpers';
import { ANIMATION_VARIANTS } from '../utils/constants';

export default function MyDocuments() {
  const { selectedCategory, searchQuery, viewMode, openUploadModal } = useUIStore();
  const [sortBy, setSortBy] = useState('newest');
  const [shareDoc, setShareDoc] = useState(null);
  const [renameDoc, setRenameDoc] = useState(null);

  const { data: allDocs = [], isLoading } = useDocuments();

  const filtered = sortDocuments(
    filterDocuments(allDocs.filter((d) => !d.familyMemberId), { search: searchQuery, category: selectedCategory }),
    sortBy
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">My Documents</h1>
          <p className="page-subtitle">Manage and organize your personal documents</p>
        </div>
        <button onClick={openUploadModal} className="btn-primary hidden sm:flex">
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Filter bar */}
      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={filtered.length}
      />

      {/* Documents grid/list */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-3'}>
          {Array.from({ length: 8 }).map((_, i) =>
            viewMode === 'grid' ? <DocumentCardSkeleton key={i} /> : <ListSkeleton key={i} rows={1} />
          )}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          type="documents"
          title={searchQuery || selectedCategory !== 'all' ? 'No documents found' : 'No documents yet'}
          description={
            searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first document to get started'
          }
          action={
            !searchQuery && selectedCategory === 'all' && (
              <button onClick={openUploadModal} className="btn-primary text-sm px-4 py-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            )
          }
        />
      ) : viewMode === 'grid' ? (
        <motion.div
          variants={ANIMATION_VARIANTS.stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((doc) => (
              <motion.div key={doc._id} variants={ANIMATION_VARIANTS.scaleIn}>
                <DocumentCard
                  doc={doc}
                  onShare={setShareDoc}
                  onRename={setRenameDoc}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="glass-card overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filtered.map((doc, i) => {
              const isImg = doc.mimeType?.startsWith('image/');
              return (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => window.location.href = `/documents/${doc._id}`}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors
                    ${i < filtered.length - 1 ? 'border-b border-dark-100 dark:border-dark-700' : ''}
                  `}
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
                    <p className="font-medium text-dark-900 dark:text-white truncate">{doc.name}</p>
                    <p className="text-xs text-dark-500 mt-0.5">{doc.category} • {doc.size ? (doc.size / 1024).toFixed(0) + ' KB' : ''}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); setShareDoc(doc); }} className="btn-ghost text-xs py-1 px-2">Share</button>
                    <button onClick={(e) => { e.stopPropagation(); setRenameDoc(doc); }} className="btn-ghost text-xs py-1 px-2">Rename</button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {shareDoc && <ShareModal document={shareDoc} onClose={() => setShareDoc(null)} />}
      {renameDoc && <RenameModal document={renameDoc} onClose={() => setRenameDoc(null)} />}
    </div>
  );
}
