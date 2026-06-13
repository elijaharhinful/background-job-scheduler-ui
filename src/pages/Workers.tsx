import { useWorkers } from '@/hooks/useWorkers';
import { useState } from 'react';
import { useSSE } from '@/hooks/useSSE';

export function Workers() {
  const { workers, setWorkers, loading, updateWorkerCount } = useWorkers();
  const [count, setCount] = useState('3');
  const [updating, setUpdating] = useState(false);

  useSSE({
    'worker_pool_update': (payload) => {
      setWorkers(payload.workers);
    }
  });

  const handleUpdate = async () => {
    const num = parseInt(count, 10);
    if (!isNaN(num) && num > 0) {
      setUpdating(true);
      try {
        await updateWorkerCount(num);
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Worker Pool Management</h1>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Pool Size</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="number" 
            className="input" 
            style={{ width: '150px' }} 
            value={count} 
            onChange={(e) => setCount(e.target.value)} 
            min="1" 
            max="10" 
          />
          <button className="btn btn-primary" onClick={handleUpdate} disabled={updating}>
            {updating ? 'Updating...' : 'Scale Workers'}
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Active Workers ({workers.length})</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {workers.map(w => (
              <div key={w.id} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600}}
                  title={w.id}>
                  {w.id.slice(0, 20)}…
                </span>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor:
                    w.status === 'processing' ? 'rgba(59, 130, 246, 0.1)' :
                    w.status === 'stopped'    ? 'rgba(107, 114, 128, 0.1)' :
                                               'rgba(16, 185, 129, 0.1)',
                  color:
                    w.status === 'processing' ? 'var(--status-processing)' :
                    w.status === 'stopped'    ? 'var(--status-cancelled)' :
                                               'var(--status-completed)',
                }}>
                  {w.status}
                </span>
              </div>
              {w.current_job_id && (
                <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  Job: {w.current_job_id.slice(0, 8)}…
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
