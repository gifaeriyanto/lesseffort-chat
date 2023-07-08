import { getUsages } from 'api/openai';
import { UserData } from 'api/supabase/auth';
import { getFileUrl } from 'api/supabase/bucket';
import { Plan } from 'components/pricingPlans';
import { create } from 'zustand';

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
    if (!user) {
      window.location.reload();
      return;
    }
    set({
      user,
      isFreeUser: ![Plan.premium, Plan.premiumAnnually].includes(user.plan),
    });
  },
}));
