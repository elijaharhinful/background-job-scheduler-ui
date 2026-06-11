export const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      console.info(...args);
    }
  },
};
