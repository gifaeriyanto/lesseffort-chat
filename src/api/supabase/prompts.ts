import { captureException } from '@sentry/react';
import { createClient } from '@supabase/supabase-js';
import { standaloneToast } from 'index';
import { env } from 'utils/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export interface PromptData {
  author_name: string;
  category: string;
  created_at: number;
  description: string;
  hint: string;
  id: number;
  prompt: string;
  status: 'public' | 'private';
  title: string;
  updated_at: number;
  usages: number;
  user_id: string;
}

export type PromptParams = Pick<
  PromptData,
  'title' | 'category' | 'prompt' | 'status' | 'description' | 'hint'
>;

export interface PromptFilters {
  page?: number;
  pageSize?: number;
  keyword?: string;
  order?: string;
  category?: string;
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
  category = '',
}: PromptFilters) => {
  const { from, to } = getPage(page, pageSize);

  const { data, error } = await supabase
    .from('chat_prompts_view')
    .select()
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`)
    .order(order, { ascending: false })
    .range(from, to);

  if (error) {
    captureException(error);
  }

  return (data || []) as PromptData[];
};

export const getPromptsCount = async ({
  keyword = '',
  category = '',
}: Omit<PromptFilters, 'page' | 'pageSize'>) => {
  const { count, error } = await supabase
    .from('chat_prompts_view')
    .select('*', { count: 'exact', head: true })
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`);

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
  }
};

export const deletePrompt = async (promptId: number) => {
  const { error } = await supabase
    .from('chat_prompt_v4')
    .delete()
    .eq('id', promptId);

  if (error) {
    captureException(error);
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
