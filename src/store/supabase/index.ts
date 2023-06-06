import { createClient } from '@supabase/supabase-js';
import { env } from 'utils/env';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export interface Prompt {
  AuthorName: string;
  AuthorURL: string;
  Category: string;
  Community: string;
  CreationTime: string;
  Help: string;
  ID: number;
  OwnPrompt: boolean;
  Prompt: string;
  PromptHint: string;
  PromptPackageID: string;
  PromptTypeNo: number;
  RevisionTime: string;
  Teaser: string;
  Title: string;
  Usages: number;
  Views: number;
  Votes: number;
}

export interface PromptFilters {
  page?: number;
  pageSize?: number;
  keyword?: string;
  order?: string;
  community?: string;
}

export const defaultOrder = 'Votes';

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
  community = '',
}: PromptFilters) => {
  const { from, to } = getPage(page, pageSize);

  return supabase
    .from('chat_prompt_v3')
    .select()
    .ilike('Title', `%${keyword}%`)
    .ilike('Community', `%${community}%`)
    .order(order, { ascending: false })
    .range(from, to);
};

export const getPromptsCount = ({
  keyword = '',
  community = '',
}: Omit<PromptFilters, 'page' | 'pageSize'>) => {
  return supabase
    .from('chat_prompt_v3')
    .select('*', { count: 'exact', head: true })
    .ilike('Title', `%${keyword}%`)
    .ilike('Community', `%${community}%`);
};
