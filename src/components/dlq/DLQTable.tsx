import React, { useState } from 'react';
import type { DlqEntry } from '@/types/dlq.types';

interface DLQTableProps {
  entries:     DlqEntry[];
  retryingIds: Set<string>;
  deletingIds: Set<string>;
  onRetry:     (id: string) => Promise<void>;
  onDelete:    (id: string) => Promise<void>;
}

export function DLQTable({
  entries,
  retryingIds,
  deletingIds,
  onRetry,
  onDelete,
}: DLQTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!entries.length) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
        <div style={{ fontWeight: 500 }}>Dead Letter Queue is empty</div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
      <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
          <tr>
            <th>Job ID</th>
            <th>Type</th>
            <th>Error Message</th>
            <th>Retries</th>
            <th>Failed At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isRetrying = retryingIds.has(entry.id);
            const isDeleting = deletingIds.has(entry.id);
            const alreadyRetried = entry.retried_at !== null;
            const isBusy = isRetrying || isDeleting;

            return (
              <React.Fragment key={entry.id}>
                <tr
                  style={{ borderTop: '1px solid var(--bg-border)' }}
                  className={alreadyRetried && !isRetrying ? 'row-retried' : ''}
                >
                  {/* Job ID */}
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {entry.job_id.slice(0, 8)}…
                  </td>

                  {/* Type */}
                  <td style={{ fontWeight: 500 }}>{entry.job_type}</td>

                  {/* Error — click to expand */}
                  <td
                    style={{
                      color: 'var(--status-failed)',
                      cursor: 'pointer',
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title="Click to view full error"
                    onClick={() =>
                      setExpandedRow(expandedRow === entry.id ? null : entry.id)
                    }
                  >
                    {entry.final_error}
                  </td>

                  {/* Retry count */}
                  <td style={{ color: 'var(--text-secondary)' }}>{entry.retry_count}</td>

                  {/* Created at */}
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </td>

                  {/* Retried-at status badge */}
                  <td>
                    {isRetrying ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary-h)', fontSize: '13px' }}>
                        <span className="spinner" />
                        Queuing…
                      </span>
                    ) : alreadyRetried ? (
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--status-completed)',
                        whiteSpace: 'nowrap',
                      }}>
                        Retried {new Date(entry.retried_at!).toLocaleTimeString()}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--status-failed)',
                      }}>
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className={`btn ${alreadyRetried ? 'btn-success' : 'btn-secondary'}`}
                        style={{ padding: '4px 10px', fontSize: '12px', minWidth: '64px' }}
                        onClick={() => { void onRetry(entry.id); }}
                        disabled={isBusy || alreadyRetried}
                        title={alreadyRetried ? `Already retried at ${new Date(entry.retried_at!).toLocaleTimeString()}` : 'Re-queue this job'}
                      >
                        {isRetrying ? (
                          <><span className="spinner" /> Queuing</>
                        ) : alreadyRetried ? (
                          'Done'
                        ) : (
                          'Retry'
                        )}
                      </button>

                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 10px', fontSize: '12px', minWidth: '60px' }}
                        onClick={() => { void onDelete(entry.id); }}
                        disabled={isBusy}
                      >
                        {isDeleting ? (
                          <><span className="spinner" /> …</>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expandable error detail row */}
                {expandedRow === entry.id && (
                  <tr>
                    <td colSpan={7} style={{ padding: 0, borderTop: '1px solid var(--bg-border)' }}>
                      <div
                        className="slide-in"
                        style={{ padding: '16px 24px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                      >
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
                          Payload Snapshot
                        </h4>
                        <pre style={{
                          backgroundColor: 'var(--bg-base)',
                          padding: '12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          overflowX: 'auto',
                          marginBottom: '16px',
                        }}>
                          {JSON.stringify(entry.payload_snapshot, null, 2)}
                        </pre>

                        <h4 style={{ marginBottom: '8px', color: 'var(--status-failed)' }}>
                          Stack Trace
                        </h4>
                        <pre style={{
                          backgroundColor: 'var(--bg-base)',
                          padding: '12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          overflowX: 'auto',
                          color: 'var(--status-failed)',
                        }}>
                          {entry.error_stack ?? entry.final_error}
                        </pre>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
