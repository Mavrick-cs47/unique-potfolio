import { motion } from "framer-motion";

export default function SkillDataProvider({ src, width, height, index }: { src: string; width: number; height: number; index: number }) {
  const animationDelay = 0.12;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * animationDelay, duration: 0.5 }}
      className="p-3 rounded-xl border border-white/15 bg-white/5 hover:glow"
    >
      <img src={src} alt="skill" width={width} height={height} className="object-contain" />
    </motion.div>
  );
}
