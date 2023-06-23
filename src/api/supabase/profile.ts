import { captureException } from '@sentry/react';
import { supabase } from 'api/supabase';
import { getUser } from 'api/supabase/auth';

export const saveProfile = async (editedData: { link: string }) => {
  const userData = await getUser();
  if (!userData?.id) {
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update(editedData)
    .eq('id', userData.id);

  if (error) {
    captureException(error);
  }
};
