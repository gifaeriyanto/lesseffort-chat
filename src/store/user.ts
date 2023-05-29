import { captureException } from '@sentry/react';
import { getUsages } from 'api/openai';
import { Plan } from 'components/pricingPlans';
import { UserData } from 'store/supabase/auth';
import { getFileUrl } from 'store/supabase/bucket';
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
  setPhoto: (image: string | null) => void;
  getPhoto: (userId: string) => Promise<void>;
}>((set) => ({
  photo: null,
  setPhoto: (image) => {
    if (image === 'null' || image === null) {
      return;
    }
    set({ photo: image });
  },
  getPhoto: async (userId) => {
    const res = await getFileUrl(userId);
    set({ photo: res });
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
