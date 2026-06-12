import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { BenchmarkResult } from '@/types/benchmark.types';

export function useBenchmark() {
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<BenchmarkResult>(Endpoints.BENCHMARK_RESULTS);
      setResult(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load benchmark results');
    } finally {
      setLoading(false);
    }
  }, []);

  const runBenchmark = async (n: number) => {
    setRunning(true);
    setError(null);
    try {
      const res = await apiClient.post<BenchmarkResult>(Endpoints.BENCHMARK_RUN, { count: Number(n) });
      setResult(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run benchmark');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => { void fetchResults(); }, [fetchResults]);

  return { result, loading, running, error, fetchResults, runBenchmark };
}
