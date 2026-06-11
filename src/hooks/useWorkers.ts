import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { WorkerState } from '@/types/metrics.types';

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ count: number, workers: WorkerState[] }>(Endpoints.WORKERS);
      setWorkers(res.data.workers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWorkerCount = async (count: number) => {
    try {
      await apiClient.patch(Endpoints.WORKERS, { count });
      await fetchWorkers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update worker count');
    }
  };

  useEffect(() => { void fetchWorkers(); }, [fetchWorkers]);

  return { workers, loading, error, refetch: fetchWorkers, updateWorkerCount };
}
