import { useEffect } from 'react';

function useScrollRestoration(
  ref: React.RefObject<HTMLElement>,
  storageKey: string
) {
  useEffect(() => {
    // Disable browser auto scroll restore to avoid fights
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    const getPos = () =>
      isDesktop() ? (ref.current?.scrollTop ?? 0) : window.scrollY;
    const setPos = (y: number) => {
      if (isDesktop()) {
        if (ref.current) ref.current.scrollTop = y;
      } else {
        window.scrollTo(0, y);
      }
    };

    // ---- Restore on mount (after paint and content load)
    const saved = Number(sessionStorage.getItem(storageKey) || 0);
    // Use multiple animation frames to ensure content is loaded
    let raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          setPos(saved);
        }, 50);
      });
    });

    // ---- Save before we leave / hide / refresh
    const save = () => {
      sessionStorage.setItem(storageKey, String(getPos()));
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') save();
    };

    // Save on tab hide, page hide, refresh, and when unmounting
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);

    return () => {
      save();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', save);
      window.removeEventListener('beforeunload', save);
      cancelAnimationFrame(raf);
    };
  }, [ref, storageKey]);
}

export default useScrollRestoration;
