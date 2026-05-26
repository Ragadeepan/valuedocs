import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';
import { useFamilyMembers } from '../hooks/useFamily';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import AddMemberModal from '../components/family/AddMemberModal';
import EmptyState from '../components/ui/EmptyState';
import { FamilyCardSkeleton } from '../components/ui/Skeleton';
import { ANIMATION_VARIANTS } from '../utils/constants';

export default function FamilyDocuments() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { data: members = [], isLoading } = useFamilyMembers();

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Family Documents</h1>
          <p className="page-subtitle">Manage documents for all family members</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Stats */}
      {!isLoading && members.length > 0 && (
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-dark-900 dark:text-white">{members.length} family member{members.length !== 1 ? 's' : ''}</p>
            <p className="text-sm text-dark-500">
              {members.reduce((acc, m) => acc + (m.documentCount || 0), 0)} total documents
            </p>
          </div>
        </div>
      )}

      {/* Members grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <FamilyCardSkeleton key={i} />)}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          type="family"
          title="No family members yet"
          description="Add family members to organize and manage their documents separately"
          action={
            <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm px-4 py-2">
              <UserPlus className="w-4 h-4" />
              Add First Member
            </button>
          }
        />
      ) : (
        <motion.div
          variants={ANIMATION_VARIANTS.stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {members.map((member) => (
              <motion.div key={member._id} variants={ANIMATION_VARIANTS.scaleIn}>
                <FamilyMemberCard member={member} onEdit={handleEdit} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit modal */}
      {showAddModal && (
        <AddMemberModal
          member={editingMember}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
