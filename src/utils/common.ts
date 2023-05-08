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
