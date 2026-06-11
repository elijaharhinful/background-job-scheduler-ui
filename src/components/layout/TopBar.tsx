import { LiveIndicator } from '../ui/LiveIndicator';

export function TopBar() {
  return (
    <header style={{ height: '64px', borderBottom: '1px solid var(--bg-border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', backgroundColor: 'var(--bg-elevated)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LiveIndicator connected={true} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>System Active</span>
      </div>
    </header>
  );
}
