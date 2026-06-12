export const SseEventNames = {
  JOB_UPDATE:        'job_update',
  METRICS_UPDATE:    'metrics_update',
} as const;

export type SseEventName = typeof SseEventNames[keyof typeof SseEventNames];
