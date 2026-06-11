export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE     = 100;
export const METRICS_SSE_INTERVAL_MS = 5000;

export const PRIORITY_LABELS: Record<number, string> = {
  1: 'High',
  2: 'Medium',
  3: 'Low',
};

export const STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  processing: 'Processing',
  completed:  'Completed',
  failed:     'Failed',
  cancelled:  'Cancelled',
};

export const RECURRENCE_LABELS: Record<string, string> = {
  every_1_minute:  'Every 1 minute',
  every_5_minutes: 'Every 5 minutes',
  every_1_hour:    'Every 1 hour',
};
