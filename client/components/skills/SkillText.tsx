import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const slideIn = (dir: "left" | "right" | "top", delay = 0) => ({
  hidden: { opacity: 0, y: dir === "top" ? -20 : 0, x: dir === "left" ? -20 : dir === "right" ? 20 : 0 },
  visible: { opacity: 1, x: 0, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
});

export default function SkillText() {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center">
      <motion.div variants={slideIn("top")} initial="hidden" whileInView="visible" viewport={{ once: true }} className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] flex items-center gap-2 rounded-xl">
        <Sparkles className="text-[#b49bff] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">Think better with modern React</h1>
      </motion.div>
      <motion.div variants={slideIn("left", 0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-[30px] font-medium mt-[10px] text-center mb-[15px]">
        Making apps with modern technologies
      </motion.div>
      <motion.div variants={slideIn("right", 0.3)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="cursive text-[20px] text-foreground/70 mb-10 mt-[10px] text-center">
        Never miss a task, deadline or idea
      </motion.div>
    </div>
  );
}
