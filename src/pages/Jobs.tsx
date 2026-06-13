import { useState } from 'react';
import type { Job } from '@/types/job.types';
import { useJobs } from '@/hooks/useJobs';
import { useSSE } from '@/hooks/useSSE';
import { JobsTable } from '@/components/jobs/JobsTable';

export function Jobs() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { jobs, setJobs, total, loading, refetch } = useJobs({ page, limit: 20, status: statusFilter });

  useSSE({
    'job_update': (updatedJob) => {
      setJobs((prev) => {
        const exists = prev.find(j => j.id === updatedJob.id);
        if (exists) {
          // We have the full job in state, so we can merge the partial update
          return prev.map(j => 
            j.id === updatedJob.id ? ({ ...j, ...updatedJob } as unknown as Job) : j
          );
        }
        // If the job is not in the current view, we ignore the partial update 
        // because we lack the full data (e.g. payload, created_at) to render it.
        return prev;
      });
    }
  });

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Jobs List</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select 
            className="select" 
            style={{ width: '200px' }}
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-secondary" onClick={() => refetch()}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>Loading jobs...</div>
      ) : (
        <>
          <JobsTable jobs={jobs} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Showing {jobs.length} of {total} jobs
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
