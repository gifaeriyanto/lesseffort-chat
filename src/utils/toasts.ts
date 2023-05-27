import { standaloneToast } from 'index';

export const toastForFreeUser = (
  id: string,
  title: string,
  description?: string,
) => {
  if (!standaloneToast.isActive('search_history_limit')) {
    standaloneToast({
      id,
      title,
      description,
      status: 'warning',
    });
  }
};
