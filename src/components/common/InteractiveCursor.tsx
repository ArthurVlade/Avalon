import React, { useEffect, useState } from 'react';

export const InteractiveCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'button' | 'input' | 'card' | 'link' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Enforce 100% suppression of the OS default cursor across all elements
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

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

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

    const animate = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer interactive magnetic follower ring */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : isHovered ? 1.3 : 1})`,
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 border ${
            isHovered
              ? hoverType === 'button'
                ? 'w-10 h-10 border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                : hoverType === 'input'
                ? 'w-7 h-7 border-indigo-400 bg-indigo-500/10'
                : 'w-11 h-11 border-indigo-400/50 bg-indigo-500/5'
              : 'w-6 h-6 border-slate-500/50 dark:border-indigo-300/40 bg-slate-500/5 dark:bg-white/5'
          }`}
        />
      </div>

      {/* Central focal pointer dot */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered
              ? hoverType === 'input'
                ? 'w-0.5 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-none'
                : 'w-2 h-2 bg-indigo-600 dark:bg-indigo-400'
              : 'w-1.5 h-1.5 bg-slate-900 dark:bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)]'
          }`}
        />
      </div>
    </>
  );
};
