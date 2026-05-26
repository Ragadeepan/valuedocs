import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Edit2, FileText } from 'lucide-react';
import { useFamilyMember } from '../hooks/useFamily';
import { useDocuments } from '../hooks/useDocuments';
import DocumentCard from '../components/documents/DocumentCard';
import FilterBar from '../components/documents/FilterBar';
import ShareModal from '../components/documents/ShareModal';
import RenameModal from '../components/documents/RenameModal';
import UploadModal from '../components/documents/UploadModal';
import AddMemberModal from '../components/family/AddMemberModal';
import EmptyState from '../components/ui/EmptyState';
import { DocumentCardSkeleton } from '../components/ui/Skeleton';
import { getInitials, formatDate } from '../utils/formatters';
import { sortDocuments, filterDocuments } from '../utils/helpers';
import { useUIStore } from '../store/uiStore';
import { ANIMATION_VARIANTS } from '../utils/constants';

const RELATION_GRADIENTS = {
  Self: 'from-primary-500 to-violet-600',
  Spouse: 'from-pink-500 to-rose-600',
  Father: 'from-blue-500 to-cyan-600',
  Mother: 'from-purple-500 to-violet-600',
  Son: 'from-green-500 to-emerald-600',
  Daughter: 'from-orange-500 to-amber-600',
  default: 'from-slate-500 to-gray-600',
};

export default function FamilyMemberPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { selectedCategory, searchQuery, viewMode } = useUIStore();
  const [sortBy, setSortBy] = useState('newest');
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [shareDoc, setShareDoc] = useState(null);
  const [renameDoc, setRenameDoc] = useState(null);

  const { data: member, isLoading: memberLoading } = useFamilyMember(memberId);
  const { data: allDocs = [], isLoading: docsLoading } = useDocuments({ familyMemberId: memberId });

  const filtered = sortDocuments(
    filterDocuments(allDocs, { search: searchQuery, category: selectedCategory }),
    sortBy
  );

  const gradient = RELATION_GRADIENTS[member?.relation] || RELATION_GRADIENTS.default;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/family')}
        className="flex items-center gap-2 text-dark-500 hover:text-dark-800 dark:hover:text-white transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        All Family Members
      </button>

      {/* Member header */}
      {member && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0`}>
              {getInitials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-dark-900 dark:text-white">
                  {member.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                  {member.relation}
                </span>
              </div>
              {member.dob && (
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                  Born {formatDate(member.dob)}
                </p>
              )}
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                {allDocs.length} document{allDocs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button onClick={() => setShowEdit(true)} className="btn-secondary text-sm py-2 px-3">
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button onClick={() => setShowUpload(true)} className="btn-primary text-sm py-2 px-3">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
          {member.notes && (
            <p className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-700 text-sm text-dark-500 dark:text-dark-400">
              {member.notes}
            </p>
          )}
        </motion.div>
      )}

      {/* Filter bar */}
      <FilterBar sortBy={sortBy} onSortChange={setSortBy} totalCount={filtered.length} />

      {/* Documents */}
      {docsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <DocumentCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          type="documents"
          title="No documents yet"
          description={`Upload documents for ${member?.name || 'this member'}`}
          action={
            <button onClick={() => setShowUpload(true)} className="btn-primary text-sm px-4 py-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          }
        />
      ) : (
        <motion.div
          variants={ANIMATION_VARIANTS.stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filtered.map((doc) => (
            <motion.div key={doc._id} variants={ANIMATION_VARIANTS.scaleIn}>
              <DocumentCard
                doc={doc}
                onShare={setShareDoc}
                onRename={setRenameDoc}
                basePath={`/family/${memberId}/documents`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      {showUpload && (
        <UploadModal familyMemberId={memberId} onClose={() => setShowUpload(false)} />
      )}
      {showEdit && member && (
        <AddMemberModal member={member} onClose={() => setShowEdit(false)} />
      )}
      {shareDoc && <ShareModal document={shareDoc} onClose={() => setShareDoc(null)} />}
      {renameDoc && <RenameModal document={renameDoc} onClose={() => setRenameDoc(null)} />}
    </div>
  );
}
