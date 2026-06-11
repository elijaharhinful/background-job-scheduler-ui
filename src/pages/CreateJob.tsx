import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateJob } from '@/hooks/useCreateJob';
import { JobPriority, RecurrenceInterval } from '@/types/job.types';

export function CreateJob() {
  const navigate = useNavigate();
  const { createJob, loading, error } = useCreateJob();
  
  const [type, setType] = useState('send_email');
  const [priority, setPriority] = useState<JobPriority>(JobPriority.MEDIUM);
  const [payloadText, setPayloadText] = useState('{\n  "to": "test@example.com",\n  "subject": "Hello",\n  "body": "World"\n}');
  const [scheduledAt, setScheduledAt] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceInterval | ''>('');
  
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    
    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch (err) {
      setJsonError('Invalid JSON in payload');
      return;
    }

    try {
      const job = await createJob({
        type,
        priority,
        payload: parsedPayload,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt).toISOString() } : {}),
        ...(recurrence ? { recurrenceInterval: recurrence } : {}),
      });
      navigate(`/jobs/${job.id}`);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Create New Job</h1>
      
      <form onSubmit={handleSubmit} className="glass-card">
        {error && <div style={{ color: 'var(--status-failed)', marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        {jsonError && <div style={{ color: 'var(--status-failed)', marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>{jsonError}</div>}

        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="send_email">send_email</option>
            <option value="process_video">process_video (dummy)</option>
            <option value="generate_report">generate_report (dummy)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="radio" name="priority" checked={priority === JobPriority.HIGH} onChange={() => setPriority(JobPriority.HIGH)} /> High (1)
            </label>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="radio" name="priority" checked={priority === JobPriority.MEDIUM} onChange={() => setPriority(JobPriority.MEDIUM)} /> Medium (2)
            </label>
            <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="radio" name="priority" checked={priority === JobPriority.LOW} onChange={() => setPriority(JobPriority.LOW)} /> Low (3)
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payload (JSON)</label>
          <textarea 
            className="textarea" 
            style={{ fontFamily: 'var(--font-mono)', minHeight: '150px' }}
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="form-group">
            <label className="form-label">Schedule At (Optional)</label>
            <input 
              type="datetime-local" 
              className="input" 
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recurrence (Optional)</label>
            <select className="select" value={recurrence} onChange={(e) => setRecurrence(e.target.value as RecurrenceInterval | '')}>
              <option value="">None</option>
              <option value={RecurrenceInterval.EVERY_1_MINUTE}>Every 1 Minute</option>
              <option value={RecurrenceInterval.EVERY_5_MINUTES}>Every 5 Minutes</option>
              <option value={RecurrenceInterval.EVERY_1_HOUR}>Every 1 Hour</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
