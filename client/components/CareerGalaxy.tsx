import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PlanetKey = "mercury" | "venus" | "earth" | "mars";

type Achievement = { title: string; subtitle?: string; year?: string };

const planetAchievements: Record<PlanetKey, { name: string; achievements: Achievement[] }> = {
  mercury: {
    name: "Mercury",
    achievements: [
      { title: "Scholarship", subtitle: "Awarded 50% External Scholarship", year: "2023" },
    ],
  },
  venus: {
    name: "Venus",
    achievements: [
      { title: "Stroke Awareness Seminar", subtitle: "Hosted & Organized", year: "2024" },
    ],
  },
  earth: {
    name: "Earth",
    achievements: [
      { title: "Deloitte Health Dashboard", subtitle: "Healthcare analytics" },
      { title: "Hackathon Participation", subtitle: "Participated in Hackathon", year: "2025" },
    ],
  },
  mars: {
    name: "Mars",
    achievements: [
      { title: "AgriPlay", subtitle: "Smart agriculture game" },
      { title: "Sign → Speech", subtitle: "Sign language to speech" },
      { title: "SkinScope", subtitle: "Skin condition analyzer" },
    ],
  },
};

export default function CareerGalaxy() {
  const [musicOn, setMusicOn] = useState(false);
  const [activePlanet, setActivePlanet] = useState<PlanetKey | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  const onPlanetClick = (key: PlanetKey) => setActivePlanet(key);

  const active = activePlanet ? planetAchievements[activePlanet] : null;

  return (
    <section data-section="career" className="relative py-24">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gradient">Career Journey Galaxy</h2>
          <button className="btn-neon" onClick={() => setMusicOn((v) => !v)}>{musicOn ? "Music: On" : "Music"}</button>
          <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/30/audio_8b18284c02.mp3?filename=ambient-celestial-ambient-124008.mp3" />
        </div>
        <p className="text-foreground/80 mb-6">Click a planet to view achievements.</p>

        <div className="relative rounded-2xl glass neon-border overflow-hidden px-2 py-6">
          <div className="solar-system">
            <div id="sun" />

            <div className="orbit mercury-orbit" />
            <div className="mercury-spin">
              <div
                id="mercury"
                role="button"
                tabIndex={0}
                aria-label="Open Mercury achievements"
                onClick={() => onPlanetClick("mercury")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPlanetClick("mercury")}
              />
            </div>

            <div className="orbit venus-orbit" />
            <div className="venus-spin">
              <div
                id="venus"
                role="button"
                tabIndex={0}
                aria-label="Open Venus achievements"
                onClick={() => onPlanetClick("venus")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPlanetClick("venus")}
              />
            </div>

            <div className="orbit earth-orbit" />
            <div className="earth-spin">
              <div className="orbit moon-orbit" />
              <div className="moon-spin">
                <div id="moon" />
              </div>
              <img
                id="earth"
                src="https://raw.githubusercontent.com/everdimension-personal/codepen-assets/master/earth_small_150.jpg"
                alt="Earth"
                role="button"
                tabIndex={0}
                aria-label="Open Earth achievements"
                onClick={() => onPlanetClick("earth")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPlanetClick("earth")}
              />
            </div>

            <div className="orbit mars-orbit" />
            <div className="mars-spin">
              <div
                id="mars"
                role="button"
                tabIndex={0}
                aria-label="Open Mars achievements"
                onClick={() => onPlanetClick("mars")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPlanetClick("mars")}
              />
            </div>
          </div>
        </div>

        <Dialog open={!!activePlanet} onOpenChange={(open) => !open && setActivePlanet(null)}>
          <DialogContent>
            {active && (
              <>
                <DialogHeader>
                  <DialogTitle>{active.name} Achievements</DialogTitle>
                  <DialogDescription>Highlights associated with {active.name}.</DialogDescription>
                </DialogHeader>
                <ul className="mt-2 space-y-3">
                  {active.achievements.map((a, idx) => (
                    <li key={idx} className="p-3 rounded-xl border bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{a.title}</div>
                        {a.year && <span className="text-xs opacity-70">{a.year}</span>}
                      </div>
                      {a.subtitle && <div className="text-sm text-foreground/80">{a.subtitle}</div>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
