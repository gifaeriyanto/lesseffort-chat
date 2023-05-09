import { standaloneToast } from 'index';

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
