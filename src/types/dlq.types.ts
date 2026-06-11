import type { Job } from './job.types';

export interface DlqEntry {
  id: string;
  jobId: string;
  finalError: string;
  errorStack: string | null;
  payloadSnapshot: Record<string, unknown>;
  retryCount: number;
  jobType: string;
  createdAt: string;
  retriedAt: string | null;
  job?: Job;
}
