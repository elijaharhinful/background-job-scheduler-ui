import { useBenchmark } from '@/hooks/useBenchmark';
import { useState } from 'react';

export function Benchmark() {
  const { result, loading, running, error, runBenchmark } = useBenchmark();
  const [jobCount, setJobCount] = useState('10000');

  const handleRun = () => {
    const num = parseInt(jobCount, 10);
    if (!isNaN(num)) {
      runBenchmark(num);
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Algorithm Benchmark</h1>

      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Compare the performance of the Min-Heap vs. Timing-Wheel algorithms for scheduling N jobs.
        </p>
        
        {error && (
          <div style={{ color: 'var(--status-failed)', marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="number" 
            className="input" 
            style={{ width: '150px' }} 
            value={jobCount} 
            onChange={(e) => setJobCount(e.target.value)} 
            min="100" 
            step="1000"
          />
          <button className="btn btn-primary" onClick={handleRun} disabled={running}>
            {running ? 'Running Benchmark...' : 'Run Benchmark'}
          </button>
        </div>
      </div>

      {loading && !result && <p>Loading last results...</p>}

      {result && (
        <div className="fade-up">
          <h3 style={{ marginBottom: '16px' }}>Results ({result.total_jobs.toLocaleString()} jobs)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Run at: {new Date(result.timestamp).toLocaleString()}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <h4 style={{ marginBottom: '16px', color: '#f59e0b' }}>Min-Heap</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Insert Time:</span>
                <span style={{ fontWeight: 600 }}>{result.heap_insert_ms.toFixed(2)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Extract Time:</span>
                <span style={{ fontWeight: 600 }}>{result.heap_extract_ms.toFixed(2)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--bg-border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Memory:</span>
                <span style={{ fontWeight: 600 }}>{result.heap_memory_mb.toFixed(2)} MB</span>
              </div>
            </div>

            <div className="glass-card" style={{ borderTop: '4px solid #10b981' }}>
              <h4 style={{ marginBottom: '16px', color: '#10b981' }}>Timing-Wheel</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Insert Time:</span>
                <span style={{ fontWeight: 600 }}>{result.timing_wheel_insert_ms.toFixed(2)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Extract Time:</span>
                <span style={{ fontWeight: 600 }}>{result.timing_wheel_extract_ms.toFixed(2)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--bg-border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Memory:</span>
                <span style={{ fontWeight: 600 }}>{result.timing_wheel_memory_mb.toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
