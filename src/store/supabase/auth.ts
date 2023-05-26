import { supabase } from 'store/supabase';

export interface SignWithEmailParams {
  email: string;
  password: string;
}

export interface SignUpParams extends SignWithEmailParams {
  name: string;
}

export const signUp = async ({ email, password, name }: SignUpParams) => {
  const res = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (res.data.user?.id) {
    window.location.reload();
  }

  return res;
};

export const signInWithEmail = async ({
  email,
  password,
}: SignWithEmailParams) => {
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (res.data.session?.access_token) {
    window.location.reload();
  }

  return res;
};

export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

export const signOut = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};
