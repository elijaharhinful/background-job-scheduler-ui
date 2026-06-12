import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, AlertTriangle, Activity, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: List, label: 'Jobs' },
    { to: '/jobs/new', icon: PlusCircle, label: 'Create Job' },
    { to: '/dlq', icon: AlertTriangle, label: 'DLQ' },
    { to: '/benchmark', icon: Activity, label: 'Benchmark' },
    { to: '/workers', icon: Settings, label: 'Workers' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Job Scheduler
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              'sidebar-link',
              isActive ? 'active' : ''
            )}
          >
            <link.icon size={18} />
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
