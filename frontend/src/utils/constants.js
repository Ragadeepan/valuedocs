export const CATEGORIES = [
  { id: 'id-proof', label: 'ID Proof', icon: '🪪', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
  { id: 'banking', label: 'Banking', icon: '🏦', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  { id: 'medical', label: 'Medical', icon: '🏥', color: 'from-red-500 to-rose-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
  { id: 'education', label: 'Education', icon: '🎓', color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300' },
  { id: 'property', label: 'Property', icon: '🏠', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300' },
  { id: 'vehicle', label: 'Vehicle', icon: '🚗', color: 'from-slate-500 to-gray-500', bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-300' },
  { id: 'others', label: 'Others', icon: '📁', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const RELATIONS = [
  'Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter',
  'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other',
];

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'],
  PDF: ['application/pdf'],
  ALL: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'size-asc', label: 'Size (Small)' },
  { value: 'size-desc', label: 'Size (Large)' },
];

export const EXPIRY_ALERT_DAYS = 30;

export const STORAGE_LIMIT_MB = 1024; // 1GB

export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.08 } },
  },
  staggerFast: {
    visible: { transition: { staggerChildren: 0.05 } },
  },
};
