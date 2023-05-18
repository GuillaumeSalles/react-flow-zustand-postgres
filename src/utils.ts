export const debounce = (callback: () => void, wait: number) => {
  let timeoutId: number = 0;
  return () => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback();
    }, wait);
  };
};
