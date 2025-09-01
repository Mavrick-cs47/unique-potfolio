import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Achievement {
  title: string;
  subtitle?: string;
  year?: string;
}
interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  line: "edu" | "projects" | "events";
  achievements: Achievement[];
}

const LINES = {
  edu: { id: "edu", name: "Education", color: "#06b6d4" },
  projects: { id: "projects", name: "Projects", color: "#a78bfa" },
  events: { id: "events", name: "Events", color: "#22c55e" },
} as const;

const STATIONS: Station[] = [
  {
    id: "scholarship",
    name: "Scholarship",
    x: 120,
    y: 320,
    line: "edu",
    achievements: [
      {
        title: "Scholarship",
        subtitle: "Awarded 50% External Scholarship",
        year: "2023",
      },
    ],
  },
  {
    id: "seminar",
    name: "Stroke Seminar",
    x: 240,
    y: 260,
    line: "events",
    achievements: [
      {
        title: "Stroke Awareness Seminar",
        subtitle: "Hosted & Organized",
        year: "2024",
      },
    ],
  },
  {
    id: "hackathon",
    name: "Hackathon",
    x: 420,
    y: 200,
    line: "events",
    achievements: [
      {
        title: "Hackathon Participation",
        subtitle: "Participated in Hackathon",
        year: "2025",
      },
    ],
  },
  {
    id: "deloitte",
    name: "Deloitte Dashboard",
    x: 540,
    y: 300,
    line: "projects",
    achievements: [
      { title: "Deloitte Health Dashboard", subtitle: "Healthcare analytics" },
    ],
  },
  {
    id: "agriplay",
    name: "AgriPlay",
    x: 360,
    y: 400,
    line: "projects",
    achievements: [{ title: "AgriPlay", subtitle: "Smart agriculture game" }],
  },
  {
    id: "signspeech",
    name: "Sign → Speech",
    x: 220,
    y: 430,
    line: "projects",
    achievements: [
      { title: "Sign → Speech", subtitle: "Real-time gesture to speech" },
    ],
  },
  {
    id: "skinscope",
    name: "SkinScope",
    x: 120,
    y: 500,
    line: "projects",
    achievements: [{ title: "SkinScope", subtitle: "Skin condition analyzer" }],
  },
];

function useTrain(pathRef: React.RefObject<SVGPathElement>, speed = 60) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    let raf = 0;
    const length = path.getTotalLength();
    const start = performance.now();
    const loop = (t: number) => {
      const dt = (t - start) / 1000; // seconds
      const dist = (((dt * speed) % length) + length) % length;
      const p = path.getPointAtLength(dist);
      setPos({ x: p.x, y: p.y });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pathRef, speed]);
  return pos;
}

export default function CareerGalaxy() {
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const eduPath = useRef<SVGPathElement>(null);
  const projPath = useRef<SVGPathElement>(null);
  const evtPath = useRef<SVGPathElement>(null);

  const trainEdu = useTrain(eduPath, 70);
  const trainProj = useTrain(projPath, 55);
  const trainEvt = useTrain(evtPath, 65);

  const stationsByLine = useMemo(
    () => ({
      edu: STATIONS.filter((s) => s.line === "edu"),
      projects: STATIONS.filter((s) => s.line === "projects"),
      events: STATIONS.filter((s) => s.line === "events"),
    }),
    [],
  );

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(2, Math.max(0.6, s + delta)));
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };
  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <section data-section="career" className="relative py-24 select-none">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gradient">
            Achievement Metro
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="btn-neon px-3 py-1 text-sm md:px-6 md:py-3"
              onClick={() => setScale((s) => Math.min(2, s + 0.15))}
            >
              Zoom +
            </button>
            <button
              className="btn-neon px-3 py-1 text-sm md:px-6 md:py-3"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            >
              Zoom −
            </button>
            <button
              className="btn-neon px-3 py-1 text-sm md:px-6 md:py-3"
              onClick={() => {
                setScale(1);
                setOffset({ x: 0, y: 0 });
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-foreground/80 mb-6">
          A unique subway-style journey. Drag to pan, scroll to zoom, click
          stations for details.
        </p>

        <div
          className="relative h-[520px] rounded-2xl glass neon-border overflow-hidden touch-none"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={(e) => {
            dragging.current = true;
            last.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            };
          }}
          onTouchMove={(e) => {
            if (!dragging.current) return;
            const dx = e.touches[0].clientX - last.current.x;
            const dy = e.touches[0].clientY - last.current.y;
            last.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            };
            setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
            e.preventDefault();
          }}
          onTouchEnd={endDrag}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            <svg viewBox="0 0 700 600" className="w-full h-full">
              {/* Lines */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Education curve */}
              <path
                ref={eduPath}
                d="M60,360 C200,160 420,160 600,340"
                stroke={LINES.edu.color}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              {/* Projects curve */}
              <path
                ref={projPath}
                d="M80,520 C180,420 360,420 560,300"
                stroke={LINES.projects.color}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              {/* Events curve */}
              <path
                ref={evtPath}
                d="M100,240 C260,180 460,120 620,200"
                stroke={LINES.events.color}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Intersections connectors */}
              <g opacity={0.25}>
                <path
                  d="M240,260 L360,400"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                />
                <path
                  d="M420,200 L540,300"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                />
              </g>

              {/* Stations */}
              {STATIONS.map((s) => (
                <g
                  key={s.id}
                  transform={`translate(${s.x}, ${s.y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveStation(s)}
                >
                  <circle
                    r={13}
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <circle r={7} fill={LINES[s.line].color} />
                  <text
                    x={18}
                    y={5}
                    fontSize={12}
                    fill="currentColor"
                    className="text-foreground"
                  >
                    {s.name}
                  </text>
                </g>
              ))}

              {/* Trains */}
              {trainEdu && (
                <text
                  x={trainEdu.x}
                  y={trainEdu.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                >
                  🏍️
                </text>
              )}
              {trainProj && (
                <text
                  x={trainProj.x}
                  y={trainProj.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                >
                  🏍️
                </text>
              )}
              {trainEvt && (
                <text
                  x={trainEvt.x}
                  y={trainEvt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                >
                  🏍️
                </text>
              )}

              {/* Legend */}
              <g transform="translate(24,24)">
                <rect
                  width="210"
                  height="70"
                  rx="12"
                  ry="12"
                  fill="rgba(15,23,42,0.6)"
                  stroke="rgba(148,163,184,0.4)"
                />
                <g
                  transform="translate(12,18)"
                  fill="none"
                  strokeWidth={8}
                  strokeLinecap="round"
                >
                  <line x1={0} y1={0} x2={28} y2={0} stroke={LINES.edu.color} />
                  <text x={40} y={4} fontSize={12} className="text-foreground">
                    Education
                  </text>
                </g>
                <g
                  transform="translate(12,38)"
                  fill="none"
                  strokeWidth={8}
                  strokeLinecap="round"
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={28}
                    y2={0}
                    stroke={LINES.projects.color}
                  />
                  <text x={40} y={4} fontSize={12} className="text-foreground">
                    Projects
                  </text>
                </g>
                <g
                  transform="translate(112,18)"
                  fill="none"
                  strokeWidth={8}
                  strokeLinecap="round"
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={28}
                    y2={0}
                    stroke={LINES.events.color}
                  />
                  <text x={40} y={4} fontSize={12} className="text-foreground">
                    Events
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <Dialog
          open={!!activeStation}
          onOpenChange={(o) => !o && setActiveStation(null)}
        >
          <DialogContent>
            {activeStation && (
              <>
                <DialogHeader>
                  <DialogTitle>{activeStation.name}</DialogTitle>
                  <DialogDescription>
                    {LINES[activeStation.line].name} • Station
                  </DialogDescription>
                </DialogHeader>
                <ul className="mt-2 space-y-3">
                  {activeStation.achievements.map((a, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl border bg-secondary/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{a.title}</div>
                        {a.year && (
                          <span className="text-xs opacity-70">{a.year}</span>
                        )}
                      </div>
                      {a.subtitle && (
                        <div className="text-sm text-foreground/80">
                          {a.subtitle}
                        </div>
                      )}
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
