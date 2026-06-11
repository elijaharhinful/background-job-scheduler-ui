export const SseEventNames = {
  JOB_CREATED:        'job.created',
  JOB_STATUS_CHANGED: 'job.status_changed',
  DLQ_NEW_ENTRY:      'dlq.new_entry',
  METRICS_UPDATED:    'metrics.updated',
} as const;

export type SseEventName = typeof SseEventNames[keyof typeof SseEventNames];
