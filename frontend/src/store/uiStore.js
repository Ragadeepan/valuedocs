import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  searchQuery: '',
  selectedCategory: 'all',
  viewMode: 'grid',
  uploadModalOpen: false,
  pinLockEnabled: false,
  pinLocked: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setViewMode: (mode) => set({ viewMode: mode }),

  openUploadModal: () => set({ uploadModalOpen: true }),
  closeUploadModal: () => set({ uploadModalOpen: false }),

  setPinLock: (enabled) => set({ pinLockEnabled: enabled }),
  setLocked: (locked) => set({ pinLocked: locked }),
}));
