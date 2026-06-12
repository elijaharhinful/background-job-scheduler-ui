import { useSSE } from '@/hooks/useSSE';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricsCard } from '@/components/ui/MetricsCard';

export function Dashboard() {
  const { metrics, setMetrics, loading } = useMetrics();
  
  useSSE({
    'metrics_update': (newMetrics) => {
      setMetrics(newMetrics);
    }
  });

  if (loading && !metrics) return <div style={{ padding: 24 }}>Loading metrics...</div>;
  if (!metrics) return <div style={{ padding: 24 }}>Failed to load metrics.</div>;

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <MetricsCard title="Pending Jobs" value={metrics.jobs.pending} color="warning" />
        <MetricsCard title="Processing" value={metrics.jobs.processing} color="primary" />
        <MetricsCard title="Completed" value={metrics.jobs.completed} color="success" />
        <MetricsCard title="Failed" value={metrics.jobs.failed} color="danger" />
        <MetricsCard title="Cancelled" value={metrics.jobs.cancelled} color="primary" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <MetricsCard 
          title="Dead Letter Queue" 
          value={metrics.dlq_count} 
          color={metrics.dlq_count > 0 ? 'danger' : 'success'} 
        />
        
        <div className="glass-card fade-up" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            Workers
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {metrics.active_workers}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>active pool</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Heap Size: {metrics.heap_size.toLocaleString()} jobs
          </div>
        </div>
      </div>
    </div>
  );
}
