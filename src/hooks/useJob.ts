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
        apiClient.get<any>(Endpoints.JOB_WORKFLOW(id)).catch(() => ({ data: { nodes: [], edges: [] } })),
      ]);
      setJob(jobRes.data);
      
      const backendData = workflowRes.data;
      if (backendData && Array.isArray(backendData.nodes) && Array.isArray(backendData.edges)) {
        const mappedNodes: WorkflowNode[] = backendData.nodes.map((n: any) => ({
          id: n.id,
          type: n.type,
          status: n.status,
          dependsOn: backendData.edges.filter((e: any) => e.target === n.id).map((e: any) => e.source)
        }));
        setWorkflow(mappedNodes);
      } else {
        setWorkflow([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const cancelJob = async () => {
    if (!id) return;
    await apiClient.post(Endpoints.JOB_CANCEL(id));
    await fetchJob();
  };

  useEffect(() => { void fetchJob(); }, [fetchJob]);

  return { job, setJob, workflow, loading, error, refetch: fetchJob, cancelJob };
}
