import axios from 'axios';
import { format, lastDayOfMonth } from 'date-fns';

const openaiAPI = axios.create({
  baseURL: 'https://api.openai.com',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('OPENAI_KEY') || ''}`,
  },
});

const getNextMonthFirstDate = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1);
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
};

export const getUsages = () => {
  return openaiAPI.get<{
    total_usage: number;
    daily_costs: {
      line_items: { name: string; cost: number }[];
      timestamp: number;
    }[];
  }>('/dashboard/billing/usage', {
    params: {
      start_date: format(new Date(), 'yyyy-MM-01'),
      end_date: format(getNextMonthFirstDate(), 'yyyy-MM-dd'),
    },
  });
};

export const getUserInfo = () => {
  return openaiAPI.get('/dashboard/billing/subscription');
};
