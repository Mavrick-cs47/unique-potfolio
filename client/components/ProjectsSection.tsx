import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
  emoji?: string;
  features?: string[];
  image?: string;
  imageAlt?: string;
}

const projects: Project[] = [
  {
    id: "hotel-booking",
    title: "Hotel Booking Website 🏨",
    description:
      "MERN app with auth, room search & booking, and payments. Minimal, professional booking UI.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Payments"],
    link: "https://stayeasecs47.netlify.app/",
    repo: "#",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2Fc1b75292535b4951ad19acdee978113f?format=webp&width=800",
    imageAlt: "Hotel booking website UI",
    features: [
      "User authentication",
      "Room search & availability",
      "Booking & payment integration",
    ],
  },
  {
    id: "dream2design",
    title: "Dream2Design ✨",
    description:
      "Turn your dreams into visuals. Type a dream and let AI capture, visualize, and explain it in a sleek, futuristic space.",
    tags: ["AI", "Generative", "Web"],
    link: "https://dream2design.netlify.app/",
    repo: "#",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2F37af70afef544ad1ac6a9cbfe5d53163?format=webp&width=800",
    imageAlt: "Dream2Design app home screen",
    features: [
      "Capture dreams in seconds",
      "AI visualizes dream scenes",
      "Insights into symbols and emotions",
    ],
  },
  {
    id: "invisible-tshirt",
    title: "Invisible Magic T‑Shirt 🧙‍♂️👕",
    description:
      "AR-style web experience simulating invisibility with playful animations.",
    tags: ["Web", "Animations", "AR‑style"],
    link: "https://yellowtshirtmagic.netlify.app/",
    repo: "#",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2F20dcab1e1d8b4182831780188d1a810c?format=webp&width=800",
    imageAlt: "Invisibility T-shirt demo UI",
    features: [
      "Interactive UI",
      "Hover-triggered invisibility",
      "Fun experimental design",
    ],
  },
  {
    id: "image-bg-remover",
    title: "Image Background Remover 🪄",
    description:
      "Upload an image and instantly remove the background for clean, share-ready results.",
    tags: ["AI", "Image", "Web"],
    link: "https://csbgremover.netlify.app/",
    repo: "#",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2Fb2ec6e6ac51246098bbfc8a97e79ec64?format=webp&width=800",
    imageAlt: "Image background remover landing page",
    features: [
      "One-click background removal",
      "High-quality transparent output",
      "Fast, mobile-friendly UI",
    ],
  },
];

function useTilt() {
  const ref = useRef<HTMLElement | null>(null);
  const coarseRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    coarseRef.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!coarseRef.current) return;
    // Gentle auto-tilt for touch devices
    const start = performance.now();
    const loop = (t: number) => {
      const dt = (t - start) / 1000;
      const x = Math.sin(dt * 0.8) * 4; // rotateX
      const y = Math.cos(dt * 0.9) * -4; // rotateY
      const el = ref.current;
      if (el) el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const setTilt = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const x = (py - 0.5) * 10; // rotateX
    const y = (px - 0.5) * -10; // rotateY
    el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setTilt(e.clientX, e.clientY);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    cancelAnimationFrame(rafRef.current);
    setTilt(t.clientX, t.clientY);
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotateX(0deg) rotateY(0deg)`;
  }, []);

  return { ref, onMouseMove, onTouchMove, onLeave };
}

function ParticleAura({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const container = (canvas.parentElement as HTMLElement) || canvas;
    let w = container.clientWidth,
      h = container.clientHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let resizeRaf = 0;
    const doResize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      if ((ctx as any).resetTransform) (ctx as any).resetTransform();
      else ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    const scheduleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(doResize);
    };
    scheduleResize();
    const ro = new ResizeObserver(scheduleResize);
    ro.observe(container);

    const neonVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--neon")
      .trim();
    const [hStr, sStr, lStr] = neonVar.split(/\s+/);
    const hue = parseFloat(hStr) || 178;
    const sat = (parseFloat(sStr) || 100) / 100;
    const lig = (parseFloat(lStr) || 52) / 100;
    const hslToRgb = (
      hh: number,
      ss: number,
      ll: number,
    ): [number, number, number] => {
      const c = (1 - Math.abs(2 * ll - 1)) * ss;
      const hp = (((hh % 360) + 360) % 360) / 60;
      const x = c * (1 - Math.abs((hp % 2) - 1));
      let r1 = 0,
        g1 = 0,
        b1 = 0;
      if (hp >= 0 && hp < 1) {
        r1 = c;
        g1 = x;
        b1 = 0;
      } else if (hp < 2) {
        r1 = x;
        g1 = c;
        b1 = 0;
      } else if (hp < 3) {
        r1 = 0;
        g1 = c;
        b1 = x;
      } else if (hp < 4) {
        r1 = 0;
        g1 = x;
        b1 = c;
      } else if (hp < 5) {
        r1 = x;
        g1 = 0;
        b1 = c;
      } else {
        r1 = c;
        g1 = 0;
        b1 = x;
      }
      const m = ll - c / 2;
      return [
        Math.round((r1 + m) * 255),
        Math.round((g1 + m) * 255),
        Math.round((b1 + m) * 255),
      ];
    };
    const [nr, ng, nb] = hslToRgb(hue, sat, lig);
    const neonColor = (a: number) => `rgba(${nr}, ${ng}, ${nb}, ${a})`;

    const particles = Array.from({ length: 24 }).map(() => ({
      a: Math.random() * Math.PI * 2,
      r: 60 + Math.random() * 120,
      s: 0.3 + Math.random() * 0.8,
      size: 1 + Math.random() * 2,
    }));
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const dt = (t - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      particles.forEach((p, i) => {
        const ang = p.a + dt * p.s * (i % 2 === 0 ? 1 : -1);
        const x = Math.cos(ang) * p.r + Math.sin(dt * 0.6 + i) * 4;
        const y = Math.sin(ang) * p.r + Math.cos(dt * 0.7 + i) * 4;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 6);
        g.addColorStop(0, neonColor(0.9));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={canvasRef} className={className} />;
}

function RippleLink({
  href,
  children,
  className = "",
  icon,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const addRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={addRipple}
      onClick={addRipple}
      className={`btn-neon ${className}`}
    >
      {icon} {children}
    </a>
  );
}

export default function ProjectsSection() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative z-10 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-10 text-gradient">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                delay: idx * 0.06,
                type: "spring",
                stiffness: 120,
                damping: 16,
              }}
            >
              <ProjectCard project={p} onOpen={() => setActive(p)} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-2xl bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={active.id}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-1/2 w-[min(1000px,94vw)] -translate-x-1/2 -translate-y-1/2 glass neon-border p-6 md:p-10 overflow-hidden rounded-3xl"
            >
              {/* Liquid morph backdrop */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-20 opacity-40"
                initial={{
                  borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                  rotate: 0,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "radial-gradient(600px 400px at 60% 50%, hsl(var(--neon)/.25), transparent 60%)",
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-bold text-gradient">
                      {active.title}
                    </h3>
                    <p className="mt-2 text-foreground/80 max-w-2xl">
                      {active.description}
                    </p>
                  </div>
                  <button
                    className="btn-neon px-3 py-2"
                    onClick={() => setActive(null)}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-video rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden">
                    {active.image && (
                      <img
                        src={active.image}
                        alt={active.imageAlt || active.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(600px_300px_at_40%_20%,hsl(var(--neon)/.25),transparent_60%)]" />
                    <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
                      <ParticleAura className="absolute inset-0" />
                    </div>
                  </div>
                  <div>
                    {active.features && (
                      <>
                        <h4 className="font-semibold text-lg mb-2">
                          Highlights
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-foreground/80">
                          {active.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {active.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs border border-white/20 bg-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <RippleLink
                        href={active.link || "#"}
                        icon={<ExternalLink size={16} className="mr-2" />}
                      >
                        Live Demo
                      </RippleLink>
                      <RippleLink
                        href={active.repo || "#"}
                        icon={<Github size={16} className="mr-2" />}
                      >
                        GitHub Repo
                      </RippleLink>
                    </div>
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

function ProjectCard({ project }: { project: Project }) {
  const { ref, onMouseMove, onTouchMove, onLeave } = useTilt();
  const gradient = useMemo(
    () => `linear-gradient(135deg, hsl(var(--neon) / 0.20), transparent)`,
    [],
  );
  return (
    <motion.div
      layoutId={project.id}
      className="tilt-3d group cursor-pointer select-none relative"
    >
      {/* Particle aura */}
      <div className="absolute -inset-2 rounded-3xl pointer-events-none opacity-60">
        <ParticleAura className="absolute inset-0" />
      </div>
      <a
        href={project.link || "#"}
        target="_blank"
        rel="noreferrer"
        ref={ref as any}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="block relative glass neon-border p-5 rounded-2xl transition-transform will-change-transform overflow-hidden"
        style={{ backgroundImage: gradient }}
      >
        <div className="absolute -inset-20 opacity-25 bg-[radial-gradient(500px_300px_at_20%_0%,hsl(var(--neon)/.35),transparent_60%)]" />
        <div className="relative aspect-video rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:glow transition-shadow overflow-hidden">
          {project.image && (
            <img
              src={project.image}
              alt={project.imageAlt || project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
            <ParticleAura className="absolute inset-0" />
          </div>
        </div>
        <div className="relative mt-4">
          <h3 className="text-lg font-bold">{project.title}</h3>
          <p className="mt-1 text-sm text-foreground/70">
            {project.description}
          </p>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[11px] border border-white/20 bg-white/5"
            >
              {t}
            </span>
          ))}
        </div>
      </a>
    </motion.div>
  );
}
