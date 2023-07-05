import axios from 'axios';
import { format } from 'date-fns';

export const openaiAPI = axios.create({
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

export const getUsages = async () => {
  const res = await openaiAPI.get<{
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

  const todayItemIndex = res.data.daily_costs.findIndex((item) => {
    return (
      new Date(item.timestamp * 1000).getDate() === new Date().getUTCDate()
    );
  });

  const todayUsageItems = res.data.daily_costs[
    todayItemIndex
  ].line_items.reduce((prev, curr) => {
    return prev + curr.cost;
  }, 0);

  return {
    total: res.data.total_usage * 0.01,
    today: todayUsageItems * 0.01,
  };
};

export const getOpenaiUserInfo = () => {
  return openaiAPI.get('/dashboard/billing/subscription');
};
