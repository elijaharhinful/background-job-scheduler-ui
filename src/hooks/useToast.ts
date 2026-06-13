import { useState, useCallback, useRef } from 'react';

export interface Toast {
  id:      string;
  message: string;
  type:    'success' | 'error';
  exiting: boolean;
}

const DISPLAY_MS = 3500;
const EXIT_MS    = 200;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove from DOM after animation completes
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, EXIT_MS);
    timers.current.set(id, t);
  }, []);

  const show = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      const t = setTimeout(() => dismiss(id), DISPLAY_MS);
      timers.current.set(id, t);
    },
    [dismiss],
  );

  return { toasts, show, dismiss };
}
