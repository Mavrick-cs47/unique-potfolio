import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RippleButton from "@/components/RippleButton";
import Typewriter from "@/components/Typewriter";
import ThreeBlob from "@/components/ThreeBlob";
import ProjectsSection from "@/components/ProjectsSection";
import RadarSkills from "@/components/RadarSkills";
import MarqueeAchievements from "@/components/MarqueeAchievements";
import HeroPortrait from "@/components/HeroPortrait";
import CareerGalaxy from "@/components/CareerGalaxy";
import HRMode from "@/components/HRMode";
import ChiragBot from "@/components/ChiragBot";
import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

export default function Index() {
  const [phrases, setPhrases] = useState<string[]>([
    "B.Tech Student | AI & Web Enthusiast | Future Tech Innovator",
    "Turning ideas into impactful digital experiences.",
  ]);
  // Background gradient morphs by section
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      let city = "there";
      try {
        const res = await fetch("https://ipapi.co/json");
        const data = await res.json();
        if (data && data.city) city = data.city;
      } catch {}
      const now = new Date();
      const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(now);
      // Prefer sonner if available
      const el = document.createElement('div');
      el.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass neon-border px-5 py-3 rounded-2xl';
      el.textContent = `Hey ${city}, thanks for visiting at ${time}. Remember my name: Chirag Sharma 🚀`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, 60000);

    const colors: Record<string, [string, string, string]> = {
      hero: ["222 89% 52%", "280 87% 60%", "190 95% 55%"],
      about: ["200 100% 50%", "260 100% 64%", "178 100% 52%"],
      career: ["260 100% 64%", "190 95% 55%", "312 100% 58%"],
      projects: ["312 100% 58%", "178 100% 52%", "224 100% 62%"],
      skills: ["178 100% 52%", "260 100% 64%", "312 100% 58%"],
      contact: ["224 100% 62%", "178 100% 52%", "312 100% 58%"],
    };

    const setGradient = (key: keyof typeof colors) => {
      const trio = colors[key] ?? colors.hero;
      const [a, b, c] = trio;
      const root = document.documentElement;
      root.style.setProperty("--grad-1", a);
      root.style.setProperty("--grad-2", b);
      root.style.setProperty("--grad-3", c);
    };

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const obs = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topMost) {
          const key = (topMost.target.getAttribute("data-section") || "hero") as keyof typeof colors;
          setGradient(key);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.2, 0.6, 1] },
    );
    sections.forEach((el) => obs.observe(el));
    setGradient("hero");
    const onMood = (e: any) => {
      if (e.detail?.tagline) setPhrases([e.detail.tagline]);
    };
    window.addEventListener('mood-change', onMood as any);
    return () => { obs.disconnect(); window.removeEventListener('mood-change', onMood as any); };
  }, []);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <main className="relative z-10">
      <HRMode />
      <ChiragBot />
      {/* Hero */}
      <section data-section="hero" className="relative min-h-[92svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ThreeBlob />
        </div>
        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-10 py-20">
          <motion.div style={{ y: yHero }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs border border-white/20">
              <Sparkles size={16} className="text-gradient" />
              <span>Hackathon Participator</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="block">Hi, I’m</span>
              <span className="text-gradient">Chirag Sharma 🚀</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 transition-colors duration-500">
              <Typewriter
                phrases={phrases}
                typingSpeed={28}
                pause={1600}
              />
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <RippleButton onClick={() => { document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>View My Work</RippleButton>
              <RippleButton onClick={() => { document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Get in Touch</RippleButton>
              <div className="flex items-center gap-3 ml-2">
                <a className="glass p-2 rounded-xl hover:glow" href="https://github.com/" aria-label="GitHub" target="_blank" rel="noreferrer"><Github /></a>
                <a className="glass p-2 rounded-xl hover:glow" href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>
                <a className="glass p-2 rounded-xl hover:glow" href="#contact" aria-label="Email"><Mail /></a>
              </div>
            </div>
          </motion.div>
          <div className="relative h-[320px] md:h-auto md:min-h-[520px]">
            <div className="absolute -inset-12 z-0 blur-3xl opacity-50 bg-[radial-gradient(circle_at_center,hsl(var(--neon)/.4),transparent_60%)]" />
            <HeroPortrait src="https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2Fc15e437f559148e987665b8f73a9ce2a?format=webp&width=800" alt="Chirag Sharma" />
          </div>
        </div>
      </section>

      {/* About */}
      <section data-section="about" id="about" className="relative py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-10 text-gradient">About Me</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Timeline */}
            <div className="space-y-8">
              {[{
                title: "B.Tech in Computer Science",
                period: "2022 — Present",
                detail: "Exploring AI, systems, and human-centered design.",
              }, {
                title: "AI & Web Projects",
                period: "2023 — Present",
                detail: "Building assistants, 3D experiences, and developer tools.",
              }, {
                title: "Open Source",
                period: "Ongoing",
                detail: "Contributing to libraries and sharing learning.",
              }].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[hsl(var(--neon))] shadow-[0_0_16px_hsl(var(--neon)/0.9)]" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-foreground/70">{item.period}</p>
                  <p className="mt-2 text-foreground/80">{item.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* Fun facts hover cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Design Lover", text: "Minimalism with a sci‑fi twist." },
                { title: "24/7 Curious", text: "Always tinkering with new stacks." },
                { title: "Team Player", text: "Lead by empathy and clarity." },
                { title: "Runner", text: "Code sprints and real ones." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass neon-border p-6 rounded-2xl hover:glow"
                >
                  <h4 className="font-semibold text-lg">{f.title}</h4>
                  <p className="mt-2 text-foreground/70">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Journey Galaxy */}
      <CareerGalaxy />

      {/* Projects Section */}
      <section data-section="projects" id="projects" className="relative">
        <ProjectsSection />
      </section>

      {/* Skills */}
      <section data-section="skills" id="skills" className="relative py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gradient">Skills</h2>
            <p className="text-foreground/80 max-w-xl">
              Tools and technologies I use to craft immersive, performant, and delightful experiences.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-foreground/70 max-w-md">
              {['TypeScript','React','Three.js','Node.js','Tailwind','Framer Motion','Vite','Postgres'].map((s) => (
                <li key={s} className="px-3 py-1 rounded-full border border-white/20 bg-white/5">{s}</li>
              ))}
            </ul>
          </div>
          <div className="justify-self-center">
            <RadarSkills skills={[
              { name: 'TS', value: 92 },
              { name: 'React', value: 90 },
              { name: 'Three', value: 70 },
              { name: 'Node', value: 80 },
              { name: 'Design', value: 75 },
              { name: 'AI', value: 78 },
            ]} />
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="relative py-10">
        <div className="container mx-auto px-6">
          <MarqueeAchievements />
        </div>
      </section>

      {/* Contact */}
      <section data-section="contact" id="contact" className="relative py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-gradient">Let’s build something amazing</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <form
              className="glass neon-border p-6 md:p-8 rounded-2xl space-y-4"
              onSubmit={(e) => { e.preventDefault(); alert('Thanks for reaching out!'); }}
            >
              <div>
                <label className="text-sm opacity-80">Name</label>
                <input required className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 outline-none focus:ring-2 focus:ring-[hsl(var(--neon))]" />
              </div>
              <div>
                <label className="text-sm opacity-80">Email</label>
                <input type="email" required className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 outline-none focus:ring-2 focus:ring-[hsl(var(--neon))]" />
              </div>
              <div>
                <label className="text-sm opacity-80">Message</label>
                <textarea required rows={5} className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 outline-none focus:ring-2 focus:ring-[hsl(var(--neon))]"></textarea>
              </div>
              <RippleButton className="w-full">Send Message</RippleButton>
              <p className="text-xs text-foreground/60">Press "C" anytime to toggle neon cyberpunk mode ⚡</p>
            </form>
            <div className="space-y-6">
              <div className="glass neon-border p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-2">Let’s connect</h3>
                <p className="text-foreground/80">Open to internships, collaborations, and exciting projects.</p>
                <div className="mt-4 flex gap-3">
                  <a className="btn-neon" href="mailto:hello@example.com"><Mail size={16} className="mr-2"/> Email</a>
                  <a className="btn-neon" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16} className="mr-2"/> GitHub</a>
                  <a className="btn-neon" href="https://linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} className="mr-2"/> LinkedIn</a>
                </div>
              </div>
              <div className="glass neon-border p-6 rounded-2xl">
                <h3 className="font-semibold text-lg mb-2">What to expect</h3>
                <ul className="list-disc list-inside text-foreground/80 space-y-1">
                  <li>Response within 24 hours</li>
                  <li>Clear timelines and communication</li>
                  <li>Quality with attention to detail</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10">
        <div className="container mx-auto px-6">
          <div className="futuristic-line mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/70">© {new Date().getFullYear()} Chirag Sharma. Built with love and neon.</p>
            <div className="flex gap-4">
              <a className="text-sm hover:underline" href="#projects">Projects</a>
              <a className="text-sm hover:underline" href="#skills">Skills</a>
              <a className="text-sm hover:underline" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
