import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
}

const projects: Project[] = [
  {
    id: "ai-assistant",
    title: "AI Assistant Platform",
    description: "Conversational AI toolkit with real-time inference and custom toolchains.",
    tags: ["AI", "TypeScript", "WebRTC"],
    link: "#",
    repo: "#",
  },
  {
    id: "neon-commerce",
    title: "Neon Commerce",
    description: "Headless e-commerce with 3D product views and edge functions.",
    tags: ["Next.js", "Three.js", "Edge"],
    link: "#",
  },
  {
    id: "gen-art",
    title: "Generative Art Lab",
    description: "GPU-accelerated generative visuals with shader-based editor.",
    tags: ["WebGL", "Shaders", "Vite"],
    repo: "#",
  },
];

function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const x = (py - 0.5) * 10; // rotateX
    const y = (px - 0.5) * -10; // rotateY
    el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return; el.style.transform = `rotateX(0deg) rotateY(0deg)`;
  }, []);
  return { ref, onMouseMove, onLeave };
}

export default function ProjectsSection() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative z-10 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-gradient">Featured Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={() => setActive(p)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={active.id}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-1/2 w-[min(920px,92vw)] -translate-x-1/2 -translate-y-1/2 glass neon-border p-6 md:p-10"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold text-gradient">{active.title}</h3>
                  <p className="mt-2 text-foreground/80 max-w-2xl">{active.description}</p>
                </div>
                <button className="btn-neon px-3 py-2" onClick={() => setActive(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Highlights</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    <li>Liquid morph transition from card to showcase using shared layout</li>
                    <li>Gradient borders and neon accents</li>
                    <li>Responsive and performant interactions</li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {active.tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs border border-white/20 bg-white/5">{t}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    {active.link && (
                      <a className="btn-neon" href={active.link} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} className="mr-2" /> Live Demo
                      </a>
                    )}
                    {active.repo && (
                      <a className="btn-neon" href={active.repo} target="_blank" rel="noreferrer">
                        <Github size={16} className="mr-2" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { ref, onMouseMove, onLeave } = useTilt();
  const gradient = useMemo(() => `linear-gradient(135deg, hsla(var(--neon),0.25), transparent)`, []);
  return (
    <motion.div
      layoutId={project.id}
      onClick={onOpen}
      className="tilt-3d group cursor-pointer select-none"
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="glass neon-border p-5 rounded-2xl transition-transform will-change-transform"
        style={{ backgroundImage: gradient }}
      >
        <div className="aspect-video rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:glow transition-shadow" />
        <div className="mt-4">
          <h3 className="text-lg font-bold">{project.title}</h3>
          <p className="mt-1 text-sm text-foreground/70">{project.description}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[11px] border border-white/20 bg-white/5">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
