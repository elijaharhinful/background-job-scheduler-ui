import type { JobStatus } from './job.types';
import type { Metrics, WorkerState } from './metrics.types';

export interface SseEvent<T = unknown> {
  event: string;
  data:  T;
  id?:   string;
}

// Exact shape broadcast by SseService.broadcastJobUpdate()
// All fields are snake_case matching the backend output.
export interface JobUpdatePayload {
  id:           string;
  status:       JobStatus;
  type:         string;
  priority:     number;
  retry_count:  number;
  max_retries:  number;
  scheduled_at: string | null;
  started_at:   string | null;
  completed_at: string | null;
  next_run_at:  string | null;
}

// Exact shape broadcast by SseService.broadcastMetrics()
export type MetricsUpdatePayload = Metrics;

// Exact shape broadcast by SseService.broadcastWorkerUpdate()
export interface WorkerPoolUpdatePayload {
  count:   number;
  workers: WorkerState[];
}

// Maps backend `type` field values → their payload shapes
export type SsePayloadMap = {
  job_update:        JobUpdatePayload;
  metrics_update:    MetricsUpdatePayload;
  worker_pool_update:WorkerPoolUpdatePayload;
};
