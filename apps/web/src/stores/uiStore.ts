// apps/web/src/stores/uiStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * UI Store for managing application UI state
 * - sidebarOpen: Controls navigation sidebar visibility
 * - toggleSidebar: Toggle sidebar open/close state
 * - setSidebarOpen: Explicitly set sidebar state
 *
 * Persisted to localStorage for consistent UX across sessions
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true, // Default open for desktop

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: 'cannapos-ui', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
