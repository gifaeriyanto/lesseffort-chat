import { captureException } from '@sentry/react';
import { PostgrestError } from '@supabase/postgrest-js';
import { supabase } from 'api/supabase';
import { getUser } from 'api/supabase/auth';
import { standaloneToast } from 'index';

export interface PromptData {
  author_name: string;
  category: string;
  created_at: number;
  description: string;
  hint: string;
  id: number;
  is_favorite: boolean;
  link: string;
  prompt: string;
  status: 'public' | 'private' | 'pending';
  title: string;
  updated_at: number;
  usages: number;
  user_id: string;
  type: 'dynamic' | 'direct';
}

export type PromptParams = Pick<
  PromptData,
  'title' | 'category' | 'prompt' | 'status' | 'description' | 'hint'
>;

export type PromptGroup = 'all' | 'yours' | 'favorites';

export interface PromptFilters {
  page?: number;
  pageSize?: number;
  keyword?: string;
  order?: string;
  category?: string;
  visibility?: string;
  type?: string;
  showOwnOnly?: boolean;
  group: PromptGroup;
}

export const defaultOrder = 'usages';

export const getPage = (page: number, size: number) => {
  const from = (page - 1) * size;
  const to = from + size - 1;
  return {
    from,
    to,
  };
};

export const getPrompts = async ({
  page = 1,
  pageSize = 10,
  keyword = '',
  order = defaultOrder,
  type = '',
  category = '',
  visibility = '',
  group = 'all',
}: PromptFilters) => {
  const userData = await getUser();
  if (!userData?.id) {
    return [];
  }

  const { from, to } = getPage(page, pageSize);

  const baseQuery = supabase
    .from('chat_prompts_view')
    .select()
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`)
    .ilike('status', `%${visibility}%`)
    .ilike('type', `%${type}%`);

  let data: any | null = null;
  let error: PostgrestError | null = null;

  const getData = async (query: any) => {
    const { data: _data, error: _error } = await query;
    data = _data;
    error = _error;
  };

  switch (group) {
    case 'all':
      await getData(
        baseQuery.order(order, { ascending: false }).range(from, to),
      );
      break;

    case 'yours':
      await getData(
        baseQuery
          .eq('user_id', userData.id)
          .order(order, { ascending: false })
          .range(from, to),
      );
      break;

    case 'favorites':
      await getData(
        baseQuery
          .eq('is_favorite', true)
          .order(order, { ascending: false })
          .range(from, to),
      );
      break;

    default:
      break;
  }

  if (error) {
    captureException(error);
  }

  return (data || []) as PromptData[];
};

export const getPromptsCount = async ({
  keyword = '',
  category = '',
  visibility = '',
  type = '',
  group = 'all',
}: Omit<PromptFilters, 'page' | 'pageSize'>) => {
  const userData = await getUser();
  if (!userData?.id) {
    return 0;
  }

  const baseQuery = supabase
    .from('chat_prompts_view')
    .select('*', { count: 'exact', head: true })
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`)
    .ilike('status', `%${visibility}%`)
    .ilike('type', `%${type}%`);

  let count: number | null = null;
  let error: PostgrestError | null = null;

  const getCount = async (query: any) => {
    const { count: _count, error: _error } = await query;
    count = _count;
    error = _error;
  };

  switch (group) {
    case 'all':
      await getCount(baseQuery);
      break;

    case 'yours':
      await getCount(baseQuery.eq('user_id', userData.id));
      break;

    case 'favorites':
      await getCount(baseQuery.eq('is_favorite', true));
      break;

    default:
      break;
  }

  if (error) {
    captureException(error);
  }

  return count || 0;
};

export const createPrompt = async (params: PromptParams) => {
  const { error } = await supabase.from('chat_prompt_v4').insert(params);

  if (error) {
    captureException(error);
  } else {
    standaloneToast({
      title: 'Successfully create a new prompt',
      status: 'success',
    });
  }
};

export const updatePrompt = async (
  params: PromptParams & Pick<PromptData, 'id'>,
) => {
  const { error } = await supabase
    .from('chat_prompt_v4')
    .update(params)
    .eq('id', params.id);

  if (error) {
    captureException(error);
  } else {
    standaloneToast({
      title: 'Successfully update the prompt data',
      status: 'success',
    });
  }
};

export const deletePrompt = async (promptId: number) => {
  const { error } = await supabase
    .from('chat_prompt_v4')
    .delete()
    .eq('id', promptId);

  if (error) {
    captureException(error);
  } else {
    standaloneToast({
      title: 'Successfully delete the prompt',
      status: 'success',
    });
  }
};

export const usePrompt = async (promptId: number) => {
  const { error } = await supabase.from('chat_prompt_usages').insert({
    prompt_id: promptId,
  });

  if (error) {
    captureException(error);
  }
};

export const favoritePrompt = async (
  promptId: number,
  isFavorited: boolean,
) => {
  if (isFavorited) {
    const { error } = await supabase
      .from('favorite_prompts')
      .delete()
      .eq('prompt_id', promptId);

    if (error) {
      captureException(error);
    }
  } else {
    const { error } = await supabase.from('favorite_prompts').insert({
      prompt_id: promptId,
    });

    if (error) {
      captureException(error);
    }
  }
};
