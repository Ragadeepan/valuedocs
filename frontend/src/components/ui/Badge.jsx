import React from 'react';
import { cn } from '../../utils/helpers';
import { CATEGORY_MAP } from '../../utils/constants';

export const CategoryBadge = ({ category, className }) => {
  const cat = CATEGORY_MAP[category] || CATEGORY_MAP.others;
  return (
    <span className={cn('category-badge', cat.bg, cat.text, className)}>
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </span>
  );
};

export const ExpiryBadge = ({ daysLeft }) => {
  if (daysLeft === null || daysLeft === undefined) return null;

  if (daysLeft < 0) {
    return (
      <span className="category-badge bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
        Expired
      </span>
    );
  }

  if (daysLeft <= 7) {
    return (
      <span className="category-badge bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
        {daysLeft}d left
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="category-badge bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
        {daysLeft}d left
      </span>
    );
  }

  return null;
};

export const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    expired: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    expiring: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  };
  return (
    <span className={cn('category-badge', styles[status] || styles.active)}>
      {status}
    </span>
  );
};
