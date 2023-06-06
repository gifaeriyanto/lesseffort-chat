import { captureException } from '@sentry/react';
import { supabase } from 'api/supabase/prompts';
import { Plan } from 'components/pricingPlans';
import { standaloneToast } from 'index';

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
        full_name: name,
        avatar_url: '',
      },
      emailRedirectTo: window.location.origin,
    },
  });

  if (res.data.user?.id) {
    window.location.href = `/email-confirmation?email=${email}`;
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
  localStorage.removeItem('profilePhoto');
  localStorage.removeItem('lastOpenChatId');
  localStorage.removeItem('accentColor');
  await supabase.auth.signOut();
  window.location.reload();
};

export const resendEmailConfirmation = async (email: string) => {
  const res = await supabase.auth.resend({ email, type: 'signup' });
  if (!res.error) {
    standaloneToast({
      title: 'Resend email confirmation',
      description:
        'A confirmation letter has been sent to your email. Please check your inbox again.',
      position: 'top',
      status: 'success',
    });
  } else {
    standaloneToast({
      title: 'Error to resend email confirmation',
      description: res.error.message,
      position: 'top',
      status: 'error',
    });
  }
};

export const forgotPassword = async (email: string) => {
  const res = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  if (!res.error) {
    standaloneToast({
      title: 'Forgot Password',
      description: `We've already sent you a reset link to your email. Please check your inbox.`,
      position: 'top',
      status: 'success',
    });
  } else {
    standaloneToast({
      title: 'Error to send email for reset password',
      description: res.error.message,
      position: 'top',
      status: 'error',
    });
  }

  return res;
};

export const updatePassword = async (newPassword: string) => {
  const res = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (!res.error) {
    window.location.href = '/';
  } else {
    standaloneToast({
      title: 'Error to reset your password',
      description: res.error.message,
      position: 'top',
      status: 'error',
    });
  }

  return res;
};

export interface UserData {
  cancelled: boolean;
  confirmed_at: string;
  created_at: string;
  email_confirmed_at: string;
  email: string;
  expired_plan: string | null;
  id: string;
  last_sign_in_at: string;
  name: string;
  plan: Plan;
  provider: string;
  renews_at: string | null;
  status_formatted: 'Active' | 'Nonactive' | 'On Trial' | null;
  subscription_id: string;
  updated_at: string;
}

export const getUser = async () => {
  const res = await supabase.from('profiles').select();

  if (!res.data?.[0]) {
    return;
  }

  return res.data[0] as UserData;
};

export const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    captureException(error);
    return '';
  }
  return data.session?.access_token || '';
};
