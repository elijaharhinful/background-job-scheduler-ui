import { useState } from 'react';
import { useDLQ } from '@/hooks/useDLQ';
import { useSSE } from '@/hooks/useSSE';
import { useToast } from '@/hooks/useToast';
import { DLQTable } from '@/components/dlq/DLQTable';
import { ToastContainer } from '@/components/ui/ToastContainer';

export function DLQ() {
  const [page, setPage] = useState(1);
  const {
    entries, total, loading,
    retryingIds, deletingIds,
    refetch, retryEntry, deleteEntry,
  } = useDLQ(page, 20);

  const { toasts, show: showToast, dismiss } = useToast();

  // When a failed job re-appears in SSE (re-failed after retry), refresh the list
  useSSE({
    job_update: (payload) => {
      if (payload.status === 'failed') {
        refetch();
      }
    },
  });

  const handleRetry = async (id: string): Promise<void> => {
    try {
      await retryEntry(id);
      showToast('Job re-queued successfully. Check the Jobs list.', 'success');
    } catch {
      showToast('Failed to retry job. Please try again.', 'error');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteEntry(id);
      showToast('DLQ entry deleted.', 'success');
    } catch {
      showToast('Failed to delete entry. Please try again.', 'error');
    }
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Dead Letter Queue</h1>
        <button className="btn btn-secondary" onClick={() => refetch()}>Refresh</button>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>Loading DLQ...</div>
      ) : (
        <>
          <DLQTable
            entries={entries}
            retryingIds={retryingIds}
            deletingIds={deletingIds}
            onRetry={handleRetry}
            onDelete={handleDelete}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Showing {entries.length} of {total} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary"
                disabled={page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
