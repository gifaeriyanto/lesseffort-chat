import { standaloneToast } from 'index';
import { redirect } from 'react-router-dom';
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
      emailRedirectTo: `${window.location.origin}/confirmed`,
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
    redirectTo: '/reset-password',
  });
  if (!res.error) {
    standaloneToast({
      title: 'Forgot Password',
      description: `We've sent you a message with instructions on how to reset your password. Please check your email and follow the steps provided. If you don't see the email in your inbox, make sure to check your spam folder. If you still can't find it, please contact our support team for assistance.`,
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
};
