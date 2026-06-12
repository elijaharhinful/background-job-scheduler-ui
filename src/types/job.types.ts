export enum JobStatus {
  PENDING    = 'pending',
  PROCESSING = 'processing',
  COMPLETED  = 'completed',
  FAILED     = 'failed',
  CANCELLED  = 'cancelled',
}

export enum JobPriority {
  HIGH   = 1,
  MEDIUM = 2,
  LOW    = 3,
}

export enum RecurrenceInterval {
  EVERY_1_MINUTE  = 'every_1_minute',
  EVERY_5_MINUTES = 'every_5_minutes',
  EVERY_1_HOUR    = 'every_1_hour',
}

export interface Job {
  id:                  string;
  type:                string;
  payload:             Record<string, unknown>;
  priority:            JobPriority;
  status:              JobStatus;
  retry_count:         number;
  max_retries:         number;
  scheduled_at:        string | null;
  started_at:          string | null;
  completed_at:        string | null;
  recurrence_interval: RecurrenceInterval | null;
  error_message:       string | null;
  effective_priority:  number;
  created_at:          string;
  updated_at:          string;
  logs?:               JobLog[];
}

export interface JobLog {
  id:         string;
  job_id:     string;
  event:      string;
  message:    string;
  metadata:   Record<string, unknown> | null;
  created_at: string;
}

export interface CreateJobPayload {
  type:                string;
  priority?:           JobPriority;
  payload:             Record<string, unknown>;
  scheduled_at?:       string;
  recurrence_interval?:RecurrenceInterval;
  depends_on?:         string[];
}
