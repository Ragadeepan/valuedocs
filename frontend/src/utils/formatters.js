import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy • hh:mm a');
};

export const formatRelative = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const isExpiringSoon = (expiryDate, days = 30) => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const threshold = addDays(new Date(), days);
  return isAfter(expiry, new Date()) && isBefore(expiry, threshold);
};

export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return isBefore(new Date(expiryDate), new Date());
};

export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (mimeType) => {
  return mimeType?.startsWith('image/') || false;
};

export const isPDFFile = (mimeType) => {
  return mimeType === 'application/pdf';
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateWhatsAppLink = (url, documentName) => {
  const message = encodeURIComponent(`Here is the document "${documentName}": ${url}`);
  return `https://wa.me/?text=${message}`;
};

export const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

export const getStoragePercentage = (usedBytes, limitMB = 1024) => {
  const usedMB = usedBytes / (1024 * 1024);
  return Math.min((usedMB / limitMB) * 100, 100);
};
