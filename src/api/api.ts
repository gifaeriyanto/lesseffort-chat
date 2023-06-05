import { captureException } from '@sentry/react';
import axios from 'axios';
import { standaloneToast } from 'index';
import { supabase } from 'store/supabase';

export const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    captureException(error);
    return '';
  }
  return data.session?.access_token || '';
};

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
