import { STATUS_LABELS } from '@/constants/ui.constants';
import type { JobStatus } from '@/types/job.types';

export function StatusBadge({ status }: { status: JobStatus }) {
  const colorVar = `var(--status-${status})`;
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: `rgba(var(--status-${status}-rgb, 128, 128, 128), 0.1)`,
        border: `1px solid ${colorVar}`,
        color: colorVar,
        animation: status === 'processing' ? 'statusPulse 2s infinite' : 'none',
      }}
    >
      {label}
    </span>
  );
}
