import { useEffect, useRef, useCallback } from 'react';
import { SSE_URL } from '@/constants/api.constants';
import { SseEventNames, type SseEventName } from '@/constants/sse.constants';
import type { SsePayloadMap } from '@/types/sse.types';
import { logger } from '@/utils/logger';

type SseHandlers = {
  [K in SseEventName]?: (data: SsePayloadMap[K]) => void;
};

export function useSSE(handlers: SseHandlers): boolean {
  const sourceRef     = useRef<EventSource | null>(null);
  const handlersRef   = useRef<SseHandlers>(handlers);
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    const source = new EventSource(SSE_URL);
    sourceRef.current = source;

    source.onopen = () => {
      logger.info('SSE Connected');
    };

    (Object.values(SseEventNames) as SseEventName[]).forEach((eventName) => {
      source.addEventListener(eventName, (e: MessageEvent<string>) => {
        const handler = handlersRef.current[eventName];
        if (handler) {
          try {
            const parsed = JSON.parse(e.data) as SsePayloadMap[typeof eventName];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (handler as (d: any) => void)(parsed);
          } catch (err) {
            logger.error(`Failed to parse SSE event ${eventName}:`, err);
          }
        }
      });
    });

    source.onerror = () => {
      logger.error('SSE connection error, reconnecting...');
      source.close();
      setTimeout(connect, 3000);
    };

    return source;
  }, []);

  useEffect(() => {
    const source = connect();
    return () => {
      source.close();
      logger.info('SSE Disconnected');
    };
  }, [connect]);

  return sourceRef.current?.readyState === EventSource.OPEN;
}
