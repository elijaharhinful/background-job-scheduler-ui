import { useNavigate } from 'react-router-dom';
import type { Job } from '@/types/job.types';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';
import { RECURRENCE_LABELS } from '@/constants/ui.constants';

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const navigate = useNavigate();

  if (!jobs.length) {
    return <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No jobs found</div>;
  }

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Retry</th>
            <th>Recurrence</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              style={{ cursor: 'pointer', borderTop: '1px solid var(--bg-border)' }}
            >
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {job.id.slice(0, 8)}...
              </td>
              <td style={{ fontWeight: 500 }}>{job.type}</td>
              <td><PriorityBadge priority={job.priority} /></td>
              <td><StatusBadge status={job.status} /></td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {job.retryCount} / {job.maxRetries}
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {job.recurrenceInterval ? RECURRENCE_LABELS[job.recurrenceInterval] : 'None'}
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {new Date(job.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
