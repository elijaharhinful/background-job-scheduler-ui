import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { Job }   from '@/types/job.types';
import type { WorkflowNode } from '@/types/workflow.types';

export function useJob(id: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [jobRes, workflowRes] = await Promise.all([
        apiClient.get<Job>(Endpoints.JOB(id)),
        apiClient.get<WorkflowNode[]>(Endpoints.JOB_WORKFLOW(id)).catch(() => ({ data: [] as WorkflowNode[] })),
      ]);
      setJob(jobRes.data);
      // Ensure the return data is correctly structured workflow array or empty
      setWorkflow(Array.isArray(workflowRes?.data) ? workflowRes.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const cancelJob = async () => {
    if (!id) return;
    await apiClient.patch(Endpoints.JOB_CANCEL(id));
    await fetchJob();
  };

  useEffect(() => { void fetchJob(); }, [fetchJob]);

  return { job, setJob, workflow, loading, error, refetch: fetchJob, cancelJob };
}
