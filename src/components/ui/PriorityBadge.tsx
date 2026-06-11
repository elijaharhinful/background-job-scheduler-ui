import { PRIORITY_LABELS } from '@/constants/ui.constants';
import type { JobPriority } from '@/types/job.types';

export function PriorityBadge({ priority }: { priority: JobPriority }) {
  const label = PRIORITY_LABELS[priority] || 'Unknown';
  let color = 'var(--text-secondary)';
  if (priority === 1) color = 'var(--priority-high)';
  if (priority === 2) color = 'var(--priority-medium)';
  if (priority === 3) color = 'var(--priority-low)';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        fontWeight: 600,
        color,
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
      {label}
    </span>
  );
}
