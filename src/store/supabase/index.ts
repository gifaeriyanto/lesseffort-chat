import { createClient } from '@supabase/supabase-js';
import { env } from 'utils/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export interface PromptData {
  category: string;
  created_at: number;
  description: string;
  id: number;
  prompt: string;
  status: 'public' | 'private';
  title: string;
  updated_at: number;
  usages: number;
  user_id: string;
  votes: number;
}

export interface PromptFilters {
  page?: number;
  pageSize?: number;
  keyword?: string;
  order?: string;
  category?: string;
}

export const defaultOrder = 'votes';

export const getPage = (page: number, size: number) => {
  const from = (page - 1) * size;
  const to = from + size - 1;
  return {
    from,
    to,
  };
};

export const getPrompts = ({
  page = 1,
  pageSize = 10,
  keyword = '',
  order = defaultOrder,
  category = '',
}: PromptFilters) => {
  const { from, to } = getPage(page, pageSize);

  return supabase
    .from('chat_prompt_v4')
    .select()
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`)
    .order(order, { ascending: false })
    .range(from, to);
};

export const getPromptsCount = ({
  keyword = '',
  category = '',
}: Omit<PromptFilters, 'page' | 'pageSize'>) => {
  return supabase
    .from('chat_prompt_v4')
    .select('*', { count: 'exact', head: true })
    .ilike('title', `%${keyword}%`)
    .ilike('category', `%${category}%`);
};
