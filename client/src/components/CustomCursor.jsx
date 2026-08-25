import { useEffect, useRef, useState } from 'react';

/*
  Subtle cursor accent: a small dot + a lagging ring that grows over
  interactive elements. Disabled on touch devices and when the user
  prefers reduced motion — in those cases the native cursor is untouched.
*/
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };

    const hoverOn = () => ringRef.current?.classList.add('cursor-ring--active');
    const hoverOff = () => ringRef.current?.classList.remove('cursor-ring--active');
    const interactive = () => document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    const bind = () => interactive().forEach((el) => {
      el.addEventListener('mouseenter', hoverOn);
      el.addEventListener('mouseleave', hoverOff);
    });

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    bind();
    // Re-bind when route/content changes swap elements in/out.
    const observer = new MutationObserver(() => bind());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
