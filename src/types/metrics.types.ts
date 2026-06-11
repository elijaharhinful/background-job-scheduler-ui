export interface WorkerState {
  id: number;
  status: 'idle' | 'processing';
  currentJobId: string | null;
  uptimeSeconds: number;
}

export interface QueueMetrics {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
}

export interface Metrics {
  queue: QueueMetrics;
  dlqCount: number;
  workers: WorkerState[];
  heapSize: number;
  timestamp: string;
}
