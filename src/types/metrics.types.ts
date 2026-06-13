// Matches getStatus() in worker.ts: id is a string, status is idle|processing|stopped
export interface WorkerState {
  id:             string;
  status:         'idle' | 'processing' | 'stopped';
  current_job_id: string | null;
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
