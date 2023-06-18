import ReactGA from 'react-ga4';
import { toastForCopy } from 'utils/toasts';

export const copyToClipboard = (text: string, toastId?: string) => {
  ReactGA.event({
    action: 'Copy message',
    category: 'Action',
  });
  navigator.clipboard.writeText(text);
  toastForCopy(toastId || 'copy');
};
