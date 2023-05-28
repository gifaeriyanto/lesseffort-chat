import { Plan } from 'components/pricingPlans';
import { redirect } from 'react-router-dom';
import { supabase } from 'store/supabase';
import { getUser } from 'store/supabase/auth';

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

export const freeUser = async () => {
  const res = await getUser();
  if (res?.plan !== Plan.free) {
    return redirect('/');
  }
  return null;
};
