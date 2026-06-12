import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function PageShell() {
  return (
    <div className="page-shell">
      <Sidebar />
      <div className="page-content">
        <TopBar />
        <main className="page-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
