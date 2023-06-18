import { captureException } from '@sentry/react';
import { Message } from 'api/chat';
import { getUser } from 'api/supabase/auth';
import { getLongLifeFileUrl } from 'api/supabase/bucket';
import { supabase } from 'api/supabase/prompts';
import { standaloneToast } from 'index';
import { accentColor } from 'theme/foundations/colors';

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
  color_scheme: string;
  content: Message[];
  id: number;
  status: 'pending' | 'published';
  title: string;
  uid: string;
  user_avatar: string | null;
  user_id: string;
  user_name: string;
  created_at?: string;
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
  messages: Message[],
  status: SharedConversation['status'] = 'pending',
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
      content: messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      })),
      user_name: userData.name,
      user_avatar: avatar,
      color_scheme: accentColor(),
      status,
    })
    .select()
    .single();

  if (error) {
    captureException(error);
  }

  return data as SharedConversation;
};

export const getSharedConversation = async (conversationUid: string) => {
  const { data, error } = await supabase
    .from('shared_conversations')
    .select()
    .eq('uid', conversationUid)
    .single();

  if (error) {
    captureException(error);
  }

  return data as SharedConversation;
};

export const getSharedConversationList = async () => {
  const userData = await getUser();
  if (!userData?.id) {
    return [];
  }
  const { data, error } = await supabase
    .from('shared_conversations')
    .select()
    .eq('user_id', userData.id)
    .order('id', { ascending: false });

  if (error) {
    captureException(error);
  }

  return data as SharedConversation[];
};

export const deleteSharedConversation = async (conversationId: number) => {
  const { error } = await supabase
    .from('shared_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    captureException(error);
  }
};

export const updateSharedConversation = async (
  editedData: Partial<SharedConversation>,
) => {
  const { error } = await supabase
    .from('shared_conversations')
    .update(editedData)
    .eq('id', editedData.id);

  if (error) {
    captureException(error);
  }
};

export const unpublishSharedConversation = (conversationId: number) => {
  return updateSharedConversation({ id: conversationId, status: 'pending' });
};

export const publishSharedConversation = (conversationId: number) => {
  return updateSharedConversation({ id: conversationId, status: 'published' });
};

export const renameSharedConversation = (
  conversationId: number,
  newTitle: string,
) => {
  return updateSharedConversation({ id: conversationId, title: newTitle });
};
