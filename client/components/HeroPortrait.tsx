import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props { src?: string; alt?: string; }

export default function HeroPortrait({ src = "/profile.jpg", alt = "Chirag portrait" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    const img = new Image(); img.src = src; // warm up
  }, [src]);

  return (
    <motion.div ref={ref} style={{ rotate, y, scale }} className="relative h-full w-full rounded-[28px] overflow-hidden glass neon-border">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_40%,transparent,rgba(0,0,0,0.25))]" />
    </motion.div>
  );
}
