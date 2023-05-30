import axios from 'axios';

export const buyPremium = (userId: string) => {
  return axios.post(
    'https://api-subs.lesseffort.io/create-subscription',
    {
      user_id: userId,
      variant_id: '80248',
      store_id: '27875',
      return_url: `${window.location.origin}/purchased`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
