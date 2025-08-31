import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

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
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set((py - 0.5) * -12);
    ry.set((px - 0.5) * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotate, y, scale, rotateX: rx, rotateY: ry }}
      className="relative h-full w-full rounded-[28px] overflow-hidden glass neon-border will-change-transform"
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_40%,transparent,rgba(0,0,0,0.25))]" />
    </motion.div>
  );
}
