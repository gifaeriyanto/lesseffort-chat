import { API } from 'api/api';
import axios from 'axios';
import { getUser } from 'store/supabase/auth';

export enum PlanAction {
  cancel = 'cancel',
  create = 'create',
  resume = 'resume',
}

const baseAction = async (
  url: string,
  action: PlanAction,
  additionalData: Record<string, any> = {},
) => {
  const userData = await getUser();
  if (!userData) {
    return;
  }

  let data: Record<string, any> = {
    data: {
      uuid: userData?.id,
      subscription_id: userData?.subscription_id,
      action,
      ...additionalData,
    },
  };

  if (action === PlanAction.create) {
    data = {
      user_id: userData?.id,
      variant_id: '80248',
      store_id: '27875',
      return_url: `${window.location.origin}/purchased`,
    };
  }

  const fetcher = await API();
  return fetcher.post(url, data);
};

export const createPlan = () => {
  return baseAction('create-subscription', PlanAction.create);
};

export const cancelPlan = () => {
  return baseAction('cancel-subscription', PlanAction.cancel);
};

export const resumePlan = () => {
  // we are using same API url with cancel
  return baseAction('cancel-subscription', PlanAction.resume);
};
