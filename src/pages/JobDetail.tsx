import { useParams, useNavigate } from 'react-router-dom';
import { useJob } from '@/hooks/useJob';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { WorkflowGraph } from '@/components/workflow/WorkflowGraph';

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, workflow, loading, cancelJob } = useJob(id);

  if (loading && !job) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!job) return <div style={{ padding: 24 }}>Job not found</div>;

  return (
    <div className="fade-up" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button className="btn btn-secondary" style={{ marginBottom: '16px', fontSize: '12px' }} onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px' }}>
            Job Details
            <StatusBadge status={job.status} />
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginTop: '8px' }}>
            {job.id}
          </p>
        </div>
        
        {['pending', 'processing'].includes(job.status) && (
          <button className="btn btn-danger" onClick={cancelJob}>
            Cancel Job
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Properties</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
              <span style={{ fontWeight: 500 }}>{job.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Priority:</span>
              <PriorityBadge priority={job.priority} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Retries:</span>
              <span>{job.retryCount} / {job.maxRetries}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Created:</span>
              <span>{new Date(job.createdAt).toLocaleString()}</span>
            </div>
            {job.scheduledAt && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Scheduled For:</span>
                <span>{new Date(job.scheduledAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Payload</h3>
          <pre style={{ backgroundColor: 'var(--bg-base)', padding: '16px', borderRadius: '4px', fontSize: '13px', overflowX: 'auto', height: '160px' }}>
            {JSON.stringify(job.payload, null, 2)}
          </pre>
        </div>
      </div>

      {job.errorMessage && (
        <div className="glass-card fade-up" style={{ marginBottom: '32px', borderLeft: '4px solid var(--status-failed)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--status-failed)' }}>Error</h3>
          <p style={{ color: 'var(--status-failed)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            {job.errorMessage}
          </p>
        </div>
      )}

      {workflow && workflow.length > 0 && (
        <div className="glass-card fade-up" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Workflow DAG</h3>
          <WorkflowGraph workflow={workflow} />
        </div>
      )}

      <div className="glass-card fade-up">
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Execution Logs</h3>
        {job.logs && job.logs.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
              <tr>
                <th style={{ padding: '8px' }}>Time</th>
                <th style={{ padding: '8px' }}>Event</th>
                <th style={{ padding: '8px' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {job.logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{new Date(log.createdAt).toLocaleTimeString()}</td>
                  <td style={{ padding: '8px', fontFamily: 'var(--font-mono)' }}>{log.event}</td>
                  <td style={{ padding: '8px' }}>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No logs available</p>
        )}
      </div>
    </div>
  );
}
