import React, { useState } from 'react';
import type { DlqEntry } from '@/types/dlq.types';

interface DLQTableProps {
  entries: DlqEntry[];
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DLQTable({ entries, onRetry, onDelete }: DLQTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!entries.length) {
    return <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No DLQ entries found</div>;
  }

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
          <tr>
            <th>Job ID</th>
            <th>Type</th>
            <th>Error Message</th>
            <th>Retries</th>
            <th>Failed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <React.Fragment key={entry.id}>
              <tr style={{ borderTop: '1px solid var(--bg-border)' }}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{entry.jobId.slice(0, 8)}...</td>
                <td style={{ fontWeight: 500 }}>{entry.jobType}</td>
                <td 
                  style={{ color: 'var(--status-failed)', cursor: 'pointer', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                >
                  {entry.finalError}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{entry.retryCount}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => onRetry(entry.id)}>Retry</button>
                    <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => onDelete(entry.id)}>Delete</button>
                  </div>
                </td>
              </tr>
              {expandedRow === entry.id && (
                <tr>
                  <td colSpan={6} style={{ padding: 0, borderTop: '1px solid var(--bg-border)' }}>
                    <div className="slide-in" style={{ padding: '16px 24px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Payload Snapshot</h4>
                      <pre style={{ backgroundColor: 'var(--bg-base)', padding: '12px', borderRadius: '4px', fontSize: '12px', overflowX: 'auto', marginBottom: '16px' }}>
                        {JSON.stringify(entry.payloadSnapshot, null, 2)}
                      </pre>
                      
                      <h4 style={{ marginBottom: '8px', color: 'var(--status-failed)' }}>Stack Trace</h4>
                      <pre style={{ backgroundColor: 'var(--bg-base)', padding: '12px', borderRadius: '4px', fontSize: '12px', overflowX: 'auto', color: 'var(--status-failed)' }}>
                        {entry.errorStack || entry.finalError}
                      </pre>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
