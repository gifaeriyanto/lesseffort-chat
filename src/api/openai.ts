import axios from 'axios';
import { format, lastDayOfMonth } from 'date-fns';

const getOpenaiKey = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('OPENAI_KEY') || '';
  }
  return '';
};

const openaiAPI = axios.create({
  baseURL: 'https://api.openai.com',
  headers: {
    Authorization: `Bearer ${getOpenaiKey()}`,
  },
});

export const getUsages = () => {
  return openaiAPI.get<{ total_usage: number }>('/dashboard/billing/usage', {
    params: {
      start_date: format(new Date(), 'yyyy-MM-01'),
      end_date: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'),
    },
  });
};
