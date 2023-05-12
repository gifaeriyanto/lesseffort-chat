import { create } from 'zustand';

export const usePWA = create<{
  isPWA: boolean;
  getPWAStatus: () => void;
}>((set) => ({
  isPWA: false,
  getPWAStatus: () => {
    set({ isPWA: window.matchMedia('(display-mode: standalone)').matches });
  },
}));
