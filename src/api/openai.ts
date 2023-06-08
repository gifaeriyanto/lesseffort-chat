import { API } from 'api/api';
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

export const getUsages = async () => {
  const fetcher = await API();
  const res = await fetcher.post<{
    total_usage: number;
    daily_costs: {
      line_items: { name: string; cost: number }[];
      timestamp: number;
    }[];
  }>(
    '/billing-usage',
    {
      start_date: format(getUTCTime(), 'yyyy-MM-01'),
      end_date: format(getNextMonthFirstDate(), 'yyyy-MM-dd'),
      token_api: localStorage.getItem('OPENAI_KEY'),
    },
    {
      headers: {
        'Cache-Control': 'max-age=300', // 5 min
      },
    },
  );

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
