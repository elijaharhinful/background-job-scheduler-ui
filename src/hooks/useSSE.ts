import { useState, useEffect, useRef } from 'react';
import {
  SSE_JOBS_URL,
  SSE_METRICS_URL,
  SSE_WORKERS_URL,
} from '@/constants/api.constants';
import { SseEventNames } from '@/constants/sse.constants';
import type {
  SsePayloadMap,
  JobUpdatePayload,
  MetricsUpdatePayload,
  WorkerPoolUpdatePayload,
} from '@/types/sse.types';
import { logger } from '@/utils/logger';

export interface SseHandlers {
  job_update?:         (data: JobUpdatePayload)        => void;
  metrics_update?:     (data: MetricsUpdatePayload)    => void;
  worker_pool_update?: (data: WorkerPoolUpdatePayload) => void;
}

const MAX_BACKOFF_MS = 30_000;

/**
 * Opens a single SSE channel. Returns a cleanup function that permanently
 * closes the connection and cancels any pending reconnect.
 */
function openChannel<K extends keyof SsePayloadMap>(
  url:       string,
  eventName: K,
  getHandler: () => ((data: SsePayloadMap[K]) => void) | undefined,
  onOpen:    () => void,
  onClose:   () => void,
): () => void {
  let attempt  = 0;
  let es:      EventSource | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;

  function connect(): void {
    if (destroyed) return;

    es = new EventSource(url);

    es.onopen = () => {
      attempt = 0;
      logger.info(`SSE connected: ${eventName}`);
      onOpen();
    };

    es.addEventListener(eventName as string, (e: MessageEvent<string>) => {
      const handler = getHandler();
      if (!handler) return;
      try {
        handler(JSON.parse(e.data) as SsePayloadMap[K]);
      } catch (err) {
        logger.error(`Failed to parse SSE event "${eventName}":`, err);
      }
    });

    es.onerror = () => {
      es?.close();
      onClose();
      if (!destroyed) {
        const delay = Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS);
        logger.error(`SSE "${eventName}" error — reconnecting in ${delay}ms`);
        attempt += 1;
        timerId = setTimeout(connect, delay);
      }
    };
  }

  connect();

  return () => {
    destroyed = true;
    if (timerId !== null) clearTimeout(timerId);
    es?.close();
    logger.info(`SSE disconnected: ${eventName}`);
  };
}

/**
 * Opens SSE connections to all three backend channels.
 * Returns true only when ALL three channels are open simultaneously.
 */
export function useSSE(handlers: SseHandlers): boolean {
  const [openCount, setOpenCount] = useState(0);
  const handlersRef = useRef<SseHandlers>(handlers);
  handlersRef.current = handlers; // always up-to-date, no re-subscription needed

  useEffect(() => {
    const inc = (): void => setOpenCount((n) => n + 1);
    const dec = (): void => setOpenCount((n) => Math.max(0, n - 1));

    const cleanups = [
      openChannel(
        SSE_JOBS_URL,
        SseEventNames.JOB_UPDATE,
        () => handlersRef.current.job_update,
        inc,
        dec,
      ),
      openChannel(
        SSE_METRICS_URL,
        SseEventNames.METRICS_UPDATE,
        () => handlersRef.current.metrics_update,
        inc,
        dec,
      ),
      openChannel(
        SSE_WORKERS_URL,
        SseEventNames.WORKER_POOL_UPDATE,
        () => handlersRef.current.worker_pool_update,
        inc,
        dec,
      ),
    ];

    return () => cleanups.forEach((fn) => fn());
  }, []); // runs once — channels live for the component's lifetime

  return openCount === 3;
}
