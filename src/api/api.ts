import { getAccessToken } from 'api/supabase/auth';
import axios from 'axios';
import { standaloneToast } from 'index';

export const APIInstance = axios.create({
  baseURL: 'https://api-subs.lesseffort.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

APIInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    standaloneToast({
      title: 'Oops! Something went wrong. 😕',
      description: error.message || undefined,
    });
    return Promise.reject(error);
  },
);

export const API = async () => {
  const accessToken = await getAccessToken();
  APIInstance.defaults.headers['Authorization'] = accessToken;
  return APIInstance;
};
