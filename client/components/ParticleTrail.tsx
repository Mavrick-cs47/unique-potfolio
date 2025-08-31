import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number; // use to shift colors along gradient
}

export default function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      for (let i = 0; i < 4; i++) {
        // spawn a few particles each move
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.6 + 0.2;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 60 + Math.random() * 20,
          size: 2 + Math.random() * 2,
          hue: 170 + Math.random() * 100, // cyan -> purple range
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw softly glowing particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life += 1;
        if (mouse.current) {
          // attraction for subtle follow
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          p.vx += dx * 0.0005;
          p.vy += dy * 0.0005;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        const t = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - t);
        if (alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24);
        // derive neon color via CSS variables fallbacks
        const color = `hsla(${p.hue}, 100%, 60%, ${alpha * 0.7})`;
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-70 mix-blend-screen"
    />
  );
}
