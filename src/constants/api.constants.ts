export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const SSE_URL      = import.meta.env.VITE_SSE_URL as string;

export const Endpoints = {
  JOBS:             '/jobs',
  JOB:              (id: string) => `/jobs/${id}`,
  JOB_CANCEL:       (id: string) => `/jobs/${id}/cancel`,
  JOB_WORKFLOW:     (id: string) => `/jobs/${id}/workflow`,
  DLQ:              '/dlq',
  DLQ_ENTRY:        (id: string) => `/dlq/${id}`,
  DLQ_RETRY:        (id: string) => `/dlq/${id}/retry`,
  DLQ_DELETE:       (id: string) => `/dlq/${id}`,
  METRICS:          '/metrics',
  WORKERS:          '/workers',
  BENCHMARK_RUN:    '/benchmark/run',
  BENCHMARK_RESULTS:'/benchmark/results',
} as const;
