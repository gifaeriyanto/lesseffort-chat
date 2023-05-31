import axios from 'axios';
import { format } from 'date-fns';

const openaiAPI = axios.create({
  baseURL: 'https://api.openai.com',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('OPENAI_KEY') || ''}`,
  },
});

const getUTCTime = () => {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // add the timezone offset in milliseconds
  const utcDate = new Date(utcTime);
  return utcDate;
};

const getNextMonthFirstDate = () => {
  const today = getUTCTime();
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
      start_date: format(getUTCTime(), 'yyyy-MM-01'),
      end_date: format(getNextMonthFirstDate(), 'yyyy-MM-dd'),
    },
  });
};

export const getUserInfo = () => {
  return openaiAPI.get('/dashboard/billing/subscription');
};
