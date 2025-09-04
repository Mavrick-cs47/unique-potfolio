import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  src?: string;
  alt?: string;
}

export default function HeroPortrait({
  src = "/profile.jpg",
  alt = "Chirag portrait",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);

  const [staticMobile, setStaticMobile] = useState(false);
  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    setStaticMobile(coarse);
  }, []);

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as any).clientY;
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    rx.set((py - 0.5) * -12);
    ry.set((px - 0.5) * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  useEffect(() => {
    const coarse =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return;
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const dt = (t - start) / 1000;
      rx.set(Math.sin(dt) * 8);
      ry.set(Math.cos(dt * 0.9) * 8);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rx, ry]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onMove}
      onTouchEnd={onLeave}
      style={{
        rotate,
        y: staticMobile ? 0 : (yScroll as any),
        scale,
        rotateX: rx,
        rotateY: ry,
        perspective: 800,
      }}
      className="relative h-full w-full rounded-[28px] overflow-hidden glass neon-border will-change-transform"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain md:object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_40%,transparent,rgba(0,0,0,0.25))]" />
    </motion.div>
  );
}
