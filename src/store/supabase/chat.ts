import { captureException } from '@sentry/react';
import { Message } from 'api/chat';
import { standaloneToast } from 'index';
import { supabase } from 'store/supabase';
import { getUser } from 'store/supabase/auth';
import { getLongLifeFileUrl } from 'store/supabase/bucket';

export interface SavedMessage {
  id: number;
  user_id: string;
  content: string;
  role: string;
  tags?: string[];
  created_at?: number;
  updated_at?: number;
}

export interface SharedConversation {
  id: number;
  uid: string;
  user_id: string;
  title: string;
  content: Message[];
  user_name: string;
  user_avatar: string | null;
  created_at?: number;
}

export const getSavedMessages = async () => {
  const { data } = await supabase
    .from('saved_messages')
    .select<'*', SavedMessage>();
  return data || [];
};

export const saveMessage = async (message: Message) => {
  const { error } = await supabase
    .from('saved_messages')
    .insert<Omit<SavedMessage, 'id' | 'user_id'>>({
      content: message.content,
      role: message.role,
      tags: [],
    });

  if (error) {
    captureException(error);
    return;
  }

  if (message?.id) {
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

export const shareConversation = async (
  title: string,
  conversation: Message[],
) => {
  const userData = await getUser();
  if (!userData?.id) {
    return;
  }
  const avatar = await getLongLifeFileUrl(userData.id);
  const { data, error } = await supabase
    .from('shared_conversations')
    .insert<Omit<SharedConversation, 'id' | 'uid' | 'user_id'>>({
      title,
      content: conversation,
      user_name: userData.name,
      user_avatar: avatar,
    })
    .select()
    .single();

  if (error) {
    captureException(error);
  }

  return data as SharedConversation;
};

export const getSharedConversation = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('shared_conversations')
    .select()
    .eq('uid', conversationId)
    .single();

  if (error) {
    captureException(error);
  }

  return data as SharedConversation;
};
