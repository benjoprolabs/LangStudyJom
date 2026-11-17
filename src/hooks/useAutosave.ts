import { useEffect, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

/**
 * Debounced automatic saving. Calls `save(value)` `delay` ms after the last change
 * when `enabled` is true. A pending save is flushed immediately on unmount so
 * navigating away never loses edits.
 */
export function useAutosave<T>(value: T, save: (v: T) => Promise<unknown>, { enabled, delay = 600 }: { enabled: boolean; delay?: number }) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const first = useRef(true);
  const pending = useRef<{ value: T } | null>(null);
  const saveRef = useRef(save);
  saveRef.current = save;

  const run = async (v: T) => {
    pending.current = null;
    setStatus('saving');
    try {
      await saveRef.current(v);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!enabled) {
      pending.current = null;
      setStatus('idle');
      return;
    }
    pending.current = { value };
    setStatus('pending');
    const timer = setTimeout(() => void run(value), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled, delay]);

  // Flush on unmount.
  useEffect(
    () => () => {
      if (pending.current) void saveRef.current(pending.current.value);
    },
    [],
  );

  return status;
}
