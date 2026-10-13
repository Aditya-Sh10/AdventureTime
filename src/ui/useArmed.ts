import { useEffect, useRef, useState } from 'react';

/**
 * End cards: buttons stay disabled for `ms` after `key` changes, then the returned ref gets focus.
 * Autofocusing at mount let the Space that closed the last dialogue line (or a mashed one) skip the
 * card unseen while the dialogue box was still fading out.
 */
export function useArmed(key: unknown, ms = 600) {
  const [armedKey, setArmedKey] = useState<{ k: unknown } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setArmedKey({ k: key }), ms);
    return () => clearTimeout(t);
  }, [key, ms]);
  const armed = armedKey !== null && armedKey.k === key;
  useEffect(() => {
    if (armed) ref.current?.focus();
  }, [armed]);
  return { armed, ref };
}
