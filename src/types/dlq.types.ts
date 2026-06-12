import type { Job } from './job.types';

export interface DlqEntry {
  id: string;
  job_id: string;
  final_error: string;
  error_stack: string | null;
  payload_snapshot: Record<string, unknown>;
  retry_count: number;
  job_type: string;
  created_at: string;
  retried_at: string | null;
  job?: Job;
}
