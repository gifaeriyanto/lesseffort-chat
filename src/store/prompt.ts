import { create } from 'zustand';

export const usePrompts = create<{
  isManagingPrompt: boolean;
  setIsManagingPrompt: (value: boolean) => void;
}>((set) => ({
  isManagingPrompt: false,
  setIsManagingPrompt: (value) => {
    set({ isManagingPrompt: value });
  },
}));
