import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MoreVertical, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useDeleteFamilyMember } from '../../hooks/useFamily';
import { getInitials, formatDate } from '../../utils/formatters';

const RELATION_COLORS = {
  Self: 'from-primary-500 to-violet-600',
  Spouse: 'from-pink-500 to-rose-600',
  Father: 'from-blue-500 to-cyan-600',
  Mother: 'from-purple-500 to-violet-600',
  Son: 'from-green-500 to-emerald-600',
  Daughter: 'from-orange-500 to-amber-600',
  Brother: 'from-teal-500 to-cyan-600',
  Sister: 'from-fuchsia-500 to-pink-600',
  default: 'from-slate-500 to-gray-600',
};

export default function FamilyMemberCard({ member, onEdit }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { mutateAsync: deleteMember } = useDeleteFamilyMember();
  const gradient = RELATION_COLORS[member.relation] || RELATION_COLORS.default;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Remove ${member.name} and all their documents?`)) return;
    await deleteMember(member._id);
    setMenuOpen(false);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className="glass-card p-5 cursor-pointer relative group"
      onClick={() => navigate(`/family/${member._id}`)}
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark-900 dark:text-white truncate">{member.name}</h3>
          <p className="text-sm text-dark-500 dark:text-dark-400">{member.relation}</p>
          {member.dob && (
            <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5">
              Born {formatDate(member.dob)}
            </p>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="p-1.5 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-700 transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-100 dark:border-dark-700">
        <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400">
          <FileText className="w-4 h-4" />
          <span>{member.documentCount || 0} document{member.documentCount !== 1 ? 's' : ''}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Context menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-14 right-4 z-20 w-40 glass-card border border-dark-100 dark:border-dark-700 shadow-float overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(member); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />Remove
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
