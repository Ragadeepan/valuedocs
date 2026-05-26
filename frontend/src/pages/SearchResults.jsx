import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText } from 'lucide-react';
import { useSearchDocuments } from '../hooks/useDocuments';
import DocumentCard from '../components/documents/DocumentCard';
import EmptyState from '../components/ui/EmptyState';
import { DocumentCardSkeleton } from '../components/ui/Skeleton';
import { ANIMATION_VARIANTS } from '../utils/constants';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: results = [], isLoading } = useSearchDocuments(query);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">
          {query ? `Results for "${query}"` : 'Search Documents'}
        </h1>
        {results.length > 0 && (
          <p className="page-subtitle">{results.length} document{results.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {!query ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-dark-600 dark:text-dark-400">Use the search bar above to find documents</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <DocumentCardSkeleton key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          type="search"
          title={`No results for "${query}"`}
          description="Try different keywords or check the spelling"
        />
      ) : (
        <motion.div
          variants={ANIMATION_VARIANTS.stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {results.map((doc) => (
              <motion.div key={doc._id} variants={ANIMATION_VARIANTS.scaleIn}>
                <DocumentCard doc={doc} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
