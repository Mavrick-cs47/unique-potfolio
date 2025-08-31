import { motion } from "framer-motion";

export default function SkillDataProvider({
  src,
  width,
  height,
  index,
}: {
  src: string;
  width: number;
  height: number;
  index: number;
}) {
  const animationDelay = 0.12;
  const fallback = "https://www.vectorlogo.zone/logos/w3c/w3c-icon.svg";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateX: 0 }}
      animate={{ y: [0, -2, 0] }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.08,
        rotate: 1,
        translateY: -2,
        boxShadow: "0 10px 30px -10px hsl(var(--neon)/.6)",
      }}
      whileTap={{ scale: 1.05 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * animationDelay, duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="p-3 rounded-xl border border-white/15 bg-white/5 hover:glow will-change-transform w-16 h-16 sm:w-auto sm:h-auto"
      style={{ perspective: 600 }}
    >
      <img
        src={src}
        alt="skill"
        width={width}
        height={height}
        className="object-contain w-full h-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = fallback;
        }}
      />
    </motion.div>
  );
}
