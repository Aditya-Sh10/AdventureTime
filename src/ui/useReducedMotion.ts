import { useEffect, useState } from 'react';
import { useSettings } from '@/store/settingsStore';

/** True when the player asked for less motion: in-game setting OR the OS-level prefers-reduced-motion. */
export function useReducedMotion(): boolean {
  const setting = useSettings((s) => s.reducedMotion);
  const [os, setOs] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setOs(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return setting || os;
}
