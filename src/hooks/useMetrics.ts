import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { Metrics } from '@/types/metrics.types';

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setError(null);
    try {
      const res = await apiClient.get<Metrics>(Endpoints.METRICS);
      setMetrics(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchMetrics(); }, [fetchMetrics]);

  return { metrics, setMetrics, loading, error, refetch: fetchMetrics };
}
