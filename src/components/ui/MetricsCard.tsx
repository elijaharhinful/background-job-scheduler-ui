import { cn } from '@/utils/cn';

interface MetricsCardProps {
  title: string;
  value: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function MetricsCard({ title, value, color = 'primary' }: MetricsCardProps) {
  const colorMap = {
    primary: 'var(--accent-primary)',
    success: 'var(--status-completed)',
    warning: 'var(--status-pending)',
    danger:  'var(--status-failed)',
  };

  return (
    <div className={cn('glass-card', 'fade-up')} style={{ borderLeft: `4px solid ${colorMap[color]}` }}>
      <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
        {title}
      </h3>
      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
