export const SseEventNames = {
  JOB_UPDATE:          'job_update',
  METRICS_UPDATE:      'metrics_update',
  WORKER_POOL_UPDATE:  'worker_pool_update',
} as const;

export type SseEventName = typeof SseEventNames[keyof typeof SseEventNames];
