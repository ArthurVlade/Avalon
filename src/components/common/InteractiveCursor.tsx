import React, { useEffect, useRef, useState } from 'react';

export const InteractiveCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'button' | 'input' | 'card' | 'link' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Complete suppression of the OS default cursor across all elements
    let styleTag = document.getElementById('avalon-hide-system-cursor');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'avalon-hide-system-cursor';
      styleTag.innerHTML = `
        *, *::before, *::after,
        html, body, button, a, input, textarea, select, label, [role="button"], svg, svg * {
          cursor: none !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    // Direct hardware-accelerated real-time positioning with 0ms latency
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check hover element types efficiently
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isButton = !!(target.tagName === 'BUTTON' || target.closest('button') || target.getAttribute('role') === 'button');
      const isLink = !!(target.tagName === 'A' || target.closest('a'));
      const isInput = !!(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');
      const isCard = !!target.closest('.workspace-card, [data-interactive="card"]');

      if (isButton) {
        setIsHovered(true);
        setHoverType('button');
      } else if (isLink) {
        setIsHovered(true);
        setHoverType('link');
      } else if (isInput) {
        setIsHovered(true);
        setHoverType('input');
      } else if (isCard) {
        setIsHovered(true);
        setHoverType('card');
      } else {
        setIsHovered(false);
        setHoverType(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      {/* Outer interactive magnetic follower ring - 100% Real-Time (0ms lag, direct GPU translation) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-150`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full transition-all duration-150 border ease-out ${
            isClicking
              ? 'scale-75 border-indigo-600 bg-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
              : isHovered
              ? hoverType === 'button'
                ? 'w-10 h-10 scale-110 border-indigo-500 bg-indigo-500/15 shadow-[0_0_16px_rgba(99,102,241,0.35)]'
                : hoverType === 'input'
                ? 'w-7 h-7 scale-100 border-indigo-400 bg-indigo-500/10'
                : 'w-11 h-11 scale-105 border-indigo-400/50 bg-indigo-500/5'
              : 'w-6 h-6 scale-100 border-slate-600/40 dark:border-indigo-300/40 bg-slate-500/5 dark:bg-white/5'
          }`}
        />
      </div>

      {/* Central pinpoint dot - 100% Real-Time Instant 1:1 Hardware Response */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-150`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full transition-all duration-100 ease-out ${
            isHovered
              ? hoverType === 'input'
                ? 'w-0.5 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-none'
                : 'w-2 h-2 bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]'
              : 'w-1.5 h-1.5 bg-slate-900 dark:bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)] dark:shadow-[0_0_6px_rgba(255,255,255,0.6)]'
          }`}
        />
      </div>
    </>
  );
};
