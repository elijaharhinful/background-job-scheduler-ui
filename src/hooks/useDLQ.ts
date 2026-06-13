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
  const [retryingIds, setRetryingIds]   = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds]   = useState<Set<string>>(new Set());

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

  const retryEntry = async (id: string): Promise<void> => {
    // Mark row as retrying immediately
    setRetryingIds((prev) => new Set(prev).add(id));
    try {
      await apiClient.post(Endpoints.DLQ_RETRY(id));
      // Optimistically mark the entry as retried so the row reflects the
      // new state without waiting for a full reload
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, retried_at: new Date().toISOString() } : e
        )
      );
      // Silently refresh in the background (no loading flash)
      void fetchDLQ();
    } finally {
      setRetryingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const deleteEntry = async (id: string): Promise<void> => {
    // Optimistically remove the row so the user sees instant feedback
    setDeletingIds((prev) => new Set(prev).add(id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await apiClient.delete(Endpoints.DLQ_DELETE(id));
    } catch (err) {
      // If delete failed, restore the list
      await fetchDLQ();
      throw err;
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => { void fetchDLQ(); }, [fetchDLQ]);

  return {
    entries, setEntries,
    total, loading, error,
    retryingIds, deletingIds,
    refetch: fetchDLQ,
    retryEntry, deleteEntry,
  };
}
