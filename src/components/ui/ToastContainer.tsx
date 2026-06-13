import type { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts:   Toast[];
  onDismiss:(id: string) => void;
}

const ICONS: Record<Toast['type'], string> = {
  success: '✓',
  error:   '✕',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.exiting ? ' exiting' : ''}`}
          role="alert"
        >
          <span style={{ fontWeight: 700, fontSize: '16px', lineHeight: 1 }}>
            {ICONS[t.type]}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      'currentColor',
              opacity:    0.6,
              fontSize:   '16px',
              lineHeight: 1,
              padding:    '0 0 0 8px',
            }}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
