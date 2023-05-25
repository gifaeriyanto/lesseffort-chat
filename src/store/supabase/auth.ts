import { supabase } from 'store/supabase';

export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

export const signOut = () => {
  return supabase.auth.signOut();
};
