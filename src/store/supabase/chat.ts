import { captureException } from '@sentry/react';
import { Message } from 'api/chat';
import { standaloneToast } from 'index';
import { supabase } from 'store/supabase';
import { getUser } from 'store/supabase/auth';

export interface SavedMessage {
  id: number;
  user_id: string;
  content: string;
  role: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export const getSavedMessages = async () => {
  const { data } = await supabase
    .from('saved_messages')
    .select<'*', SavedMessage>();
  return data || [];
};

export const saveMessage = async (message: Message) => {
  const userData = await getUser();
  if (!userData) {
    return;
  }
  const { error } = await supabase
    .from('saved_messages')
    .insert<Omit<SavedMessage, 'id'>>({
      content: message.content,
      user_id: userData.id,
      role: message.role,
      tags: [],
    });

  if (error) {
    captureException(error);
  } else {
    standaloneToast({
      title: 'Successfully saved the message',
      status: 'success',
    });
  }
};

export const deleteSavedMessage = async (messageId: number) => {
  const { error } = await supabase
    .from('saved_messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    captureException(error);
  }
};
