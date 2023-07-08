import { API } from 'api/api';
import { getUser } from 'api/supabase/auth';

export enum PlanAction {
  cancel = 'cancel',
  create = 'create',
  resume = 'resume',
}

const baseAction = async (
  url: string,
  action: PlanAction,
  isYearly?: boolean,
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
    },
  };

  if (action === PlanAction.create) {
    data = {
      user_id: userData?.id,
      variant_id: isYearly ? '96072' : '91493',
      store_id: '27875',
      return_url: `${window.location.origin}/purchased`,
    };
  }

  const fetcher = await API();
  return fetcher.post(url, data);
};

export const createPlan = (isYearly = false) => {
  return baseAction('create-subscription', PlanAction.create, isYearly);
};

export const cancelPlan = () => {
  return baseAction('cancel-subscription', PlanAction.cancel);
};

export const resumePlan = () => {
  // we are using same API url with cancel
  return baseAction('cancel-subscription', PlanAction.resume);
};

export const getPlans = async () => {
  const userData = await getUser();
  if (!userData) {
    return;
  }

  const fetcher = await API();
  return fetcher.get('/order-details', {
    params: {
      subscription_id: userData.subscription_id,
      user_id: userData.id,
    },
  });
};
