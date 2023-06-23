import { supabase } from 'api/supabase';
import { standaloneToast } from 'index';
import FileResizer from 'react-image-file-resizer';

const resizeFile = (file: File) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'file',
    );
  });

export const uploadFile = async (filename: string, file: File) => {
  const resizedFile = (await resizeFile(file)) as File;
  const { error } = await supabase.storage
    .from('user_profile_photos')
    .upload(filename, resizedFile, {
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
  const { data } = await supabase.storage
    .from('user_profile_photos')
    .createSignedUrl(filename, 60000, {
      transform: {
        width: 50,
        height: 50,
        resize: 'cover',
        quality: 50,
      },
    });

  return data?.signedUrl || null;
};

export const getLongLifeFileUrl = async (filename: string) => {
  const { data } = await supabase.storage
    .from('user_profile_photos')
    .createSignedUrl(filename, 63113904, {
      transform: {
        width: 50,
        height: 50,
        resize: 'cover',
        quality: 50,
      },
    });

  return data?.signedUrl || null;
};
