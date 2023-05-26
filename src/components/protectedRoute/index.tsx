import { redirect } from 'react-router-dom';
import { supabase } from 'store/supabase';

export const withAuth = async () => {
  const res = await supabase.auth.getSession();
  if (!res.data.session?.access_token) {
    return redirect('/login');
  }
  return null;
};

export const noAuth = async () => {
  const res = await supabase.auth.getSession();
  if (res.data.session?.access_token) {
    return redirect('/');
  }
  return null;
};
