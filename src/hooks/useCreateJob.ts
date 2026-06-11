import { useState } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { CreateJobPayload, Job } from '@/types/job.types';

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Job | null>(null);

  const createJob = async (payload: CreateJobPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await apiClient.post<Job>(Endpoints.JOBS, payload);
      setSuccess(res.data);
      return res.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createJob, loading, error, success };
}
