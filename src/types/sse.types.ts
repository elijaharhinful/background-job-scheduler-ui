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
  retryCount: number;
}

export type SsePayloadMap = {
  'job.created':       Job;
  'job.status_changed':JobStatusChangedPayload;
  'dlq.new_entry':     DlqEntry;
  'metrics.updated':   Metrics;
};
