export const API_BASE_URL    = import.meta.env.VITE_API_BASE_URL as string;
export const SSE_JOBS_URL    = import.meta.env.VITE_SSE_JOBS_URL as string;
export const SSE_METRICS_URL = import.meta.env.VITE_SSE_METRICS_URL as string;
export const SSE_WORKERS_URL = import.meta.env.VITE_SSE_WORKERS_URL as string;

export const Endpoints = {
  JOBS:             '/api/jobs',
  JOB:              (id: string) => `/api/jobs/${id}`,
  JOB_CANCEL:       (id: string) => `/api/jobs/${id}/cancel`,
  JOB_WORKFLOW:     (id: string) => `/api/jobs/${id}/workflow`,
  DLQ:              '/api/dlq',
  DLQ_ENTRY:        (id: string) => `/api/dlq/${id}`,
  DLQ_RETRY:        (id: string) => `/api/dlq/${id}/retry`,
  DLQ_DELETE:       (id: string) => `/api/dlq/${id}`,
  METRICS:          '/api/metrics',
  WORKERS:          '/api/workers',
  BENCHMARK_RUN:    '/api/benchmark',
  BENCHMARK_RESULTS:'/api/benchmark/results',
} as const;
