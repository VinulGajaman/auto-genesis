import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * App Store — global UI state
 * Replaces the old React Context (AppContext.js)
 *
 * State:
 *  compareList: string[]    — up to 2 vehicle IDs for comparison
 *  toast: object | null     — active toast notification (managed by Mantine Notifications)
 */
export const useAppStore = create(
    immer((set, get) => ({
        // ── Compare list ───────────────────────────────────────────
        compareList: [],

        addToCompare: (id) => {
            set((state) => {
                if (state.compareList.includes(id)) return;
                if (state.compareList.length >= 2) return;
                state.compareList.push(id);
            });
        },

        removeFromCompare: (id) => {
            set((state) => {
                state.compareList = state.compareList.filter((v) => v !== id);
            });
        },

        clearCompare: () => {
            set((state) => {
                state.compareList = [];
            });
        },

        isInCompare: (id) => get().compareList.includes(id),

        // ── Toast helper (delegates to Mantine Notifications) ──────
        // Import `notifications` from @mantine/notifications in consuming code
        // This store exposes a semantic wrapper so call sites stay clean.
        _notifyFn: null, // injected at app root

        injectNotify: (fn) => set({ _notifyFn: fn }),

        showToast: (message, type = 'success') => {
            const fn = get()._notifyFn;
            if (fn) fn({ message, type });
        },
    }))
);
