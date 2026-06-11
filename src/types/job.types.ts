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
  id:                 string;
  type:               string;
  payload:            Record<string, unknown>;
  priority:           JobPriority;
  status:             JobStatus;
  retryCount:         number;
  maxRetries:         number;
  scheduledAt:        string | null;
  startedAt:          string | null;
  completedAt:        string | null;
  recurrenceInterval: RecurrenceInterval | null;
  errorMessage:       string | null;
  effectivePriority:  number;
  createdAt:          string;
  updatedAt:          string;
  logs?:              JobLog[];
}

export interface JobLog {
  id:        string;
  jobId:     string;
  event:     string;
  message:   string;
  metadata:  Record<string, unknown> | null;
  createdAt: string;
}

export interface CreateJobPayload {
  type:               string;
  priority?:          JobPriority;
  payload:            Record<string, unknown>;
  scheduledAt?:       string;
  recurrenceInterval?:RecurrenceInterval;
  dependsOn?:         string[];
}
