import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { Endpoints }  from '@/constants/api.constants';
import type { DlqEntry } from '@/types/dlq.types';
import type { PaginatedData } from '@/types/api.types';

export function useDLQ(page = 1, limit = 20) {
  const [entries, setEntries] = useState<DlqEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDLQ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<PaginatedData<DlqEntry>>(
        `${Endpoints.DLQ}?page=${page}&limit=${limit}`
      );
      setEntries(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load DLQ');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const retryEntry = async (id: string) => {
    await apiClient.post(Endpoints.DLQ_RETRY(id));
    await fetchDLQ();
  };

  const deleteEntry = async (id: string) => {
    await apiClient.delete(Endpoints.DLQ_DELETE(id));
    await fetchDLQ();
  };

  useEffect(() => { void fetchDLQ(); }, [fetchDLQ]);

  return { entries, setEntries, total, loading, error, refetch: fetchDLQ, retryEntry, deleteEntry };
}
