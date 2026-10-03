import { useEffect, useRef } from 'react';

import { backgroundConfig, type MotionTier, type ParticleConfig } from '../config/background';
import { palette } from '../config/theme';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
}

const rgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

/**
 * Layer 4 — energy field. Canvas, because dozens of independently moving points with
 * distance-based links is what DOM nodes are worst at. Kept cheap: count scales with
 * area and is capped per tier, links are dropped on phones, device pixel ratio is
 * capped, motion is time-based (120Hz screens do not run double speed), and the loop
 * stops entirely while the canvas is off-screen or the tab is hidden. Reduced motion
 * draws one still frame.
 */
export function ParticleField({
  config,
  tier,
  reduced,
}: {
  config: ParticleConfig;
  tier: MotionTier;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const point = rgb(palette[config.color]);
    const link = rgb(palette[config.linkColor]);
    const scale = backgroundConfig.tiers[tier].particles;
    const links = tier !== 'mobile' && config.linkDistance > 0;
    const speed = backgroundConfig.motion.speed || 1;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let last = 0;
    let visible = false;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(config.max[tier], Math.round(((width * height) / 100000) * config.density * scale));
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (config.speed[0] + Math.random() * (config.speed[1] - config.speed[0])) * speed;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - config.lift * speed,
          r: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
          alpha: 0.35 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (links) {
        context.lineWidth = 0.7;
        const max = config.linkDistance;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < max) {
              context.strokeStyle = `rgba(${link},${(1 - distance / max) * config.linkOpacity})`;
              context.beginPath();
              context.moveTo(a.x, a.y);
              context.lineTo(b.x, b.y);
              context.stroke();
            }
          }
        }
      }
      const glowAt = config.size[1] * 0.78;
      for (const p of particles) {
        const twinkle = 0.65 + 0.35 * Math.sin(time / 1400 + p.phase);
        context.fillStyle = `rgba(${point},${p.alpha * twinkle})`;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
        if (p.r > glowAt) {
          // A soft halo on the largest points — a filled ring, not shadowBlur.
          context.fillStyle = `rgba(${point},${p.alpha * twinkle * 0.12})`;
          context.beginPath();
          context.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const step = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // Wrap with a margin so points leave and re-enter off-canvas, never popping.
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }
      draw(time);
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (reduced || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    seed();
    draw(0);

    const resize = new ResizeObserver(() => {
      seed();
      draw(performance.now());
    });
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [config, tier, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-particles"
      aria-hidden="true"
      style={config.mask ? { WebkitMaskImage: config.mask, maskImage: config.mask } : undefined}
    />
  );
}
