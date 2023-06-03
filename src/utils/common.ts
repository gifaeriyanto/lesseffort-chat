import { format } from 'date-fns';
import { pipe } from 'framer-motion';
import { standaloneToast } from 'index';
import { join, map, replace, split, toLower } from 'ramda';

type Func<T extends any[], R> = (...a: T) => R;

export const debounce = <T extends any[], R>(
  func: Func<T, R>,
  delay: number,
): Func<T, void> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const comingSoon = () => {
  standaloneToast({
    title: 'Coming soon',
    duration: 5000,
    status: 'info',
  });
};

export const uppercaseFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const capitalizeWords = pipe(
  toLower,
  split(' '),
  map(uppercaseFirstLetter),
  join(' '),
);

export const formatNumber = (number: number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
};

export const formatLocaleNumber = (number: number) => {
  return number.toLocaleString('de-DE', { minimumFractionDigits: 0 });
};

export const createIncrementArray = (length: number) =>
  Array.from({ length }, (_, i) => i + 1);

export const sanitizeString = pipe(
  replace(/[^a-zA-Z0-9 ]/g, ''),
  toLower,
  uppercaseFirstLetter,
);

export const formatDate = (date: Date, noTime = false) => {
  let template = 'MMMM dd, yyyy p';
  if (noTime) {
    template = 'MMMM dd, yyyy';
  }
  const formattedDate = format(date, template);
  return formattedDate;
};

export const formatDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const formattedDate = format(date, 'MMMM dd, yyyy p');
  return formattedDate;
};
