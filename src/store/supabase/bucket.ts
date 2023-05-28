import { standaloneToast } from 'index';
import { supabase } from 'store/supabase';

export const uploadFile = async (filename: string, file: File) => {
  const { error } = await supabase.storage
    .from('user_profile_photos')
    .upload(filename, file, {
      upsert: true,
    });
  if (error) {
    standaloneToast({
      title: 'Oops! Something went wrong. 😕',
      description: error.message,
      status: 'error',
    });
  }
};

export const getFileUrl = async (filename: string) => {
  const { data } = supabase.storage
    .from('user_profile_photos')
    .getPublicUrl(filename);
  return data.publicUrl;
};
