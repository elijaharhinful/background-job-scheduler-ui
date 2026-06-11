export function LiveIndicator({ connected }: { connected: boolean }) {
  const color = connected ? 'var(--status-completed)' : 'var(--status-failed)';
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          animation: connected ? 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
        }}
      />
      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {connected ? 'Live' : 'Disconnected'}
      </span>
    </div>
  );
}
