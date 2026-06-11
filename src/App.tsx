import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Dashboard }  from '@/pages/Dashboard';
import { Jobs }       from '@/pages/Jobs';
import { JobDetail }  from '@/pages/JobDetail';
import { CreateJob }  from '@/pages/CreateJob';
import { DLQ }        from '@/pages/DLQ';
import { Benchmark }  from '@/pages/Benchmark';
import { Workers }    from '@/pages/Workers';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/jobs"       element={<Jobs />} />
          <Route path="/jobs/new"   element={<CreateJob />} />
          <Route path="/jobs/:id"   element={<JobDetail />} />
          <Route path="/dlq"        element={<DLQ />} />
          <Route path="/benchmark"  element={<Benchmark />} />
          <Route path="/workers"    element={<Workers />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
