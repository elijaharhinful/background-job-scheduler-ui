import { useState } from 'react';
import { useDLQ } from '@/hooks/useDLQ';
import { DLQTable } from '@/components/dlq/DLQTable';

export function DLQ() {
  const [page, setPage] = useState(1);
  const { entries, total, loading, refetch, retryEntry, deleteEntry } = useDLQ(page, 20);

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
          <DLQTable entries={entries} onRetry={retryEntry} onDelete={deleteEntry} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Showing {entries.length} of {total} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <button 
                className="btn btn-secondary" 
                disabled={page * 20 >= total} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
