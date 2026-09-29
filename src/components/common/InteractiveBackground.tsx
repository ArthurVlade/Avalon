import React, { useEffect, useState, useRef } from 'react';

interface Props {
  isDark: boolean;
}

interface StarNode {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  radius: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isGlitterStar: boolean;
}

export const InteractiveBackground: React.FC<Props> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const [auraPos, setAuraPos] = useState({ x: -1000, y: -1000 });

  // Mouse tracking with decoupled ref so canvas loop is never torn down
  useEffect(() => {
    let animationFrameId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const animateAura = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setAuraPos({ x: Math.round(currentX), y: Math.round(currentY) });
      animationFrameId = requestAnimationFrame(animateAura);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(animateAura);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Perpetual, continuous starry particle drift canvas (PERSISTENT LOOP: never tears down on mouse movement)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Continuous, active drifting star nodes initialized ONCE per theme change (tastefully restrained frequency)
    const nodeCount = Math.min(Math.floor((width * height) / 32000), 50);
    const nodes: StarNode[] = Array.from({ length: nodeCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.42 + Math.random() * 0.38; // Constant, lively perpetual drift speed
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.5 + 1.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.02,
        isGlitterStar: i % 4 === 0,
      };
    });

    let clock = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      clock += 0.02;

      const maxConnectDistance = 145;
      const mouseInfluenceRadius = 140;
      const mouse = mousePosRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const star = nodes[i];

        // Perpetual drift regardless of mouse moving, hovering, or stationary
        star.x += star.baseVx + Math.sin(clock * 0.7 + i) * 0.18 + star.vx;
        star.y += star.baseVy + Math.cos(clock * 0.7 + i) * 0.18 + star.vy;

        // Smooth damping on the interactive mouse push
        star.vx *= 0.94;
        star.vy *= 0.94;

        // Screen wrap keeps stars flowing perpetually across the viewport
        if (star.x < -20) star.x = width + 20;
        else if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        else if (star.y > height + 20) star.y = -20;

        // Smooth gentle interactive reaction when hovering near mouse
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const distToMouse = Math.hypot(dx, dy);

        if (distToMouse < mouseInfluenceRadius && distToMouse > 2) {
          const force = (1 - distToMouse / mouseInfluenceRadius) * 0.35;
          const normalX = dx / distToMouse;
          const normalY = dy / distToMouse;
          star.vx += normalX * force * 0.5;
          star.vy += normalY * force * 0.5;
        }

        // Star Twinkle
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const effectiveRadius = star.radius * (0.85 + twinkle * 0.3);

        ctx.save();
        if (isDark) {
          // Dark mode: luminous celestial glow
          const glowColor = star.isGlitterStar
            ? 'rgba(199, 210, 254, 0.35)'
            : 'rgba(129, 140, 248, 0.2)';
          const coreColor = `rgba(248, 250, 252, ${0.75 * twinkle})`;

          ctx.beginPath();
          ctx.arc(star.x, star.y, effectiveRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(star.x, star.y, effectiveRadius, 0, Math.PI * 2);
          ctx.fillStyle = coreColor;
          ctx.fill();
        } else {
          // Light mode: high-contrast sapphire & slate stars clearly visible
          const outerGlow = star.isGlitterStar
            ? 'rgba(79, 70, 229, 0.28)'
            : 'rgba(99, 102, 241, 0.2)';
          const coreColor = star.isGlitterStar
            ? `rgba(49, 46, 129, ${0.9 * twinkle})`
            : `rgba(67, 56, 202, ${0.85 * twinkle})`;

          ctx.beginPath();
          ctx.arc(star.x, star.y, effectiveRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = outerGlow;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(star.x, star.y, effectiveRadius, 0, Math.PI * 2);
          ctx.fillStyle = coreColor;
          ctx.fill();
        }

        // Delicate 4-point star glint
        if (star.isGlitterStar && twinkle > 0.8) {
          const glintLen = effectiveRadius * 2.8;
          ctx.strokeStyle = isDark
            ? `rgba(224, 231, 255, ${0.5 * (twinkle - 0.7)})`
            : `rgba(67, 56, 202, ${0.6 * (twinkle - 0.7)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(star.x - glintLen, star.y);
          ctx.lineTo(star.x + glintLen, star.y);
          ctx.moveTo(star.x, star.y - glintLen);
          ctx.lineTo(star.x, star.y + glintLen);
          ctx.stroke();
        }
        ctx.restore();

        // Constellation Lines
        for (let j = i + 1; j < nodes.length; j++) {
          const star2 = nodes[j];
          const dist = Math.hypot(star.x - star2.x, star.y - star2.y);

          if (dist < maxConnectDistance) {
            const lineAlpha = 1 - dist / maxConnectDistance;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star2.x, star2.y);

            if (isDark) {
              ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha * 0.2})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(79, 70, 229, ${lineAlpha * 0.22})`;
              ctx.lineWidth = 0.9;
            }
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isDark]); // Re-renders only if theme flips, never cancels on mouse movement!

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-300"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Subtle Dot Grid Matrix */}
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.16]"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)'
            : 'radial-gradient(rgba(30, 41, 59, 0.22) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Smooth Soft Mouse Spotlight Aura */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isDark
            ? `radial-gradient(550px circle at ${auraPos.x}px ${auraPos.y}px, rgba(99, 102, 241, 0.12), rgba(79, 70, 229, 0.04), transparent 75%)`
            : `radial-gradient(550px circle at ${auraPos.x}px ${auraPos.y}px, rgba(79, 70, 229, 0.08), rgba(99, 102, 241, 0.03), transparent 70%)`,
        }}
      />

      {/* Ambient Celestial Glow Orbs */}
      <div
        className={`absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDark ? 'bg-indigo-950/25' : 'bg-indigo-200/40'
        }`}
      />
      <div
        className={`absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDark ? 'bg-slate-900/40' : 'bg-slate-200/50'
        }`}
      />
    </div>
  );
};
