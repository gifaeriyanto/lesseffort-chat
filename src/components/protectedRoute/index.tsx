import { getUser } from 'api/supabase/auth';
import { supabase } from 'api/supabase/prompts';
import { Plan } from 'components/pricingPlans';
import { redirect } from 'react-router-dom';

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

export const premiumUser = async () => {
  const res = await getUser();
  if (res?.plan !== Plan.premium) {
    return redirect('/');
  }
  return null;
};
