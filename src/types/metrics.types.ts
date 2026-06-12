export interface WorkerState {
  id: number;
  status: 'idle' | 'processing';
  current_job_id: string | null;
  uptime_seconds: number;
}

export interface JobsMetrics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
}

export interface Metrics {
  jobs: JobsMetrics;
  dlq_count: number;
  active_workers: number;
  heap_size: number;
  uptime_seconds: number;
}
