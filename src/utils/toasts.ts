import { standaloneToast } from 'index';

export const toastForFreeUser = (
  id: string,
  title: string,
  description?: string,
) => {
  if (!standaloneToast.isActive(id)) {
    standaloneToast({
      id,
      title,
      description,
      status: 'warning',
    });
  }
};
