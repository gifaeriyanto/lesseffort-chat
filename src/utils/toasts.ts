import { standaloneToast } from 'index';
import ReactGA from 'react-ga4';

export const toastForFreeUser = (
  id: string,
  title: string,
  description?: string,
) => {
  if (!standaloneToast.isActive(id)) {
    ReactGA.event({
      action: `Limit ${id}`,
      category: 'Action',
    });
    standaloneToast({
      id,
      title,
      description,
      status: 'warning',
    });
  }
};
