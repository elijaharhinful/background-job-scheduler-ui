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
    <aside style={{ width: '240px', borderRight: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', fontSize: '18px', fontWeight: 600, color: 'var(--accent-primary-h)' }}>
        Job Scheduler
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
              isActive ? 'bg-accent-glow text-accent-primary-h' : 'text-text-secondary hover:bg-glass-bg hover:text-text-primary'
            )}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
              color: isActive ? 'var(--accent-primary-h)' : 'var(--text-secondary)',
              textDecoration: 'none'
            })}
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
