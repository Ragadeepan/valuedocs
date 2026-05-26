import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const downloadFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const sortDocuments = (docs, sortBy) => {
  const sorted = [...docs];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'size-asc':
      return sorted.sort((a, b) => (a.size || 0) - (b.size || 0));
    case 'size-desc':
      return sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
    default:
      return sorted;
  }
};

export const filterDocuments = (docs, { search, category }) => {
  return docs.filter((doc) => {
    const matchesSearch = !search || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || category === 'all' || doc.category === category;
    return matchesSearch && matchesCategory;
  });
};
