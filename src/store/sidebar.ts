import { create } from 'zustand';

export const useSidebar = create<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}>((set, get) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
  },
  onClose: () => {
    set({ isOpen: false });
  },
  onToggle: () => {
    set({ isOpen: !get().isOpen });
  },
}));
