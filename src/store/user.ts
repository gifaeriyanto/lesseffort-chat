import { captureException } from '@sentry/react';
import { getUsages } from 'api/openai';
import { Plan } from 'components/pricingPlans';
import { UserData } from 'store/supabase/auth';
import { create } from 'zustand';

export const useUsage = create<{
  usage: number;
  getUsages: () => Promise<number | void>;
}>((set) => ({
  usage: 0,
  getUsages: async () => {
    try {
      const res = await getUsages();
      if (!res) {
        return;
      }
      const { total_usage } = res.data;
      set({ usage: total_usage });
      return total_usage;
    } catch (error) {
      captureException(error);
    }
  },
}));

export const useProfilePhoto = create<{
  photo: string | null;
  setPhoto: (image: string) => void;
  getPhoto: () => string | null;
}>((set, get) => ({
  photo: null,
  setPhoto: (image: string) => {
    if (image === 'null' || image === null) {
      return;
    }
    localStorage.setItem('photoProfile', image);
    set({ photo: image });
  },
  getPhoto: () => {
    const { photo } = get();

    const localImage = localStorage.getItem('photoProfile');
    if (localImage && !photo) {
      set({ photo: localImage });
    }

    return photo;
  },
}));

export const useUserData = create<{
  user: UserData | undefined;
  isFreeUser: boolean | undefined;
  setUser: (user: UserData | undefined) => void;
}>((set) => ({
  user: undefined,
  isFreeUser: undefined,
  setUser: (user) => {
    set({ user, isFreeUser: user?.plan === Plan.free });
  },
}));
