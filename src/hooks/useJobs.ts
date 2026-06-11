import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { Job }   from '@/types/job.types';
import type { PaginatedData } from '@/types/api.types';

interface UseJobsOptions {
  page?:   number;
  limit?:  number;
  status?: string;
  type?:   string;
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs,    setJobs]    = useState<Job[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.page)   params.set('page',   String(options.page));
      if (options.limit)  params.set('limit',  String(options.limit));
      if (options.status) params.set('status', options.status);
      if (options.type)   params.set('type',   options.type);

      const res = await apiClient.get<PaginatedData<Job>>(
        `${Endpoints.JOBS}?${params.toString()}`
      );
      setJobs(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.status, options.type]);

  useEffect(() => { void fetchJobs(); }, [fetchJobs]);

  return { jobs, setJobs, total, loading, error, refetch: fetchJobs };
}
