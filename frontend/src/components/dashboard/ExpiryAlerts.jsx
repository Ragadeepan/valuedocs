import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';
import { useExpiringDocuments } from '../../hooks/useDocuments';
import { getDaysUntilExpiry, formatDate } from '../../utils/formatters';
import { CATEGORY_MAP } from '../../utils/constants';

export default function ExpiryAlerts() {
  const navigate = useNavigate();
  const { data: docs = [], isLoading } = useExpiringDocuments();

  if (docs.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-orange-200/50 dark:border-orange-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-dark-900 dark:text-white">Expiry Alerts</h3>
          <p className="text-xs text-dark-500">{docs.length} document{docs.length !== 1 ? 's' : ''} expiring soon</p>
        </div>
      </div>

      <div className="space-y-2">
        {docs.map((doc, i) => {
          const days = getDaysUntilExpiry(doc.expiryDate);
          const cat = CATEGORY_MAP[doc.category] || CATEGORY_MAP.others;
          const isUrgent = days !== null && days <= 7;

          return (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                ${isUrgent
                  ? 'bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-900/20'
                  : 'bg-orange-50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-900/20'
                }
              `}
            >
              <span className="text-xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{doc.name}</p>
                <p className="text-xs text-dark-500">{formatDate(doc.expiryDate)}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                <Clock className="w-3 h-3" />
                {days !== null && days < 0 ? 'Expired' : `${days}d`}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
