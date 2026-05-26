import React from 'react';
import { motion } from 'framer-motion';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import { useUIStore } from '../../store/uiStore';

export default function FilterBar({ sortBy, onSortChange, totalCount }) {
  const { selectedCategory, setSelectedCategory, viewMode, setViewMode } = useUIStore();

  const allCategories = [{ id: 'all', label: 'All', icon: '📂' }, ...CATEGORIES];

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {allCategories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            whileTap={{ scale: 0.97 }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 border border-dark-200 dark:border-dark-700 hover:border-primary-300 hover:text-primary-600'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Sort & view toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-dark-500 dark:text-dark-400">
          {totalCount > 0 ? `${totalCount} document${totalCount !== 1 ? 's' : ''}` : 'No documents'}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl p-1">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm bg-transparent border-none outline-none text-dark-600 dark:text-dark-400 pr-2 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-dark-400 hover:text-dark-600 dark:hover:text-dark-200'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-dark-400 hover:text-dark-600 dark:hover:text-dark-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
