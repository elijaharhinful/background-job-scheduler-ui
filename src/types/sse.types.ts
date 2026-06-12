import type { Job, JobStatus } from './job.types';
import type { DlqEntry } from './dlq.types';
import type { Metrics } from './metrics.types';

export interface SseEvent<T = unknown> {
  event: string;
  data:  T;
  id?:   string;
}

export interface JobStatusChangedPayload {
  id:         string;
  status:     JobStatus;
  retry_count: number;
}

export type SsePayloadMap = {
  'job_update':      Job;
  'metrics_update':  Metrics;
};
