import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export interface Skill {
  name: string;
  value: number; // 0..100
}

interface Props {
  skills: Skill[];
}

export default function RadarSkills({ skills }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    const cx = 160;
    const cy = 160;
    const radius = 120;
    const step = (Math.PI * 2) / skills.length;
    return skills.map((s, i) => {
      const r = (s.value / 100) * radius;
      const angle = i * step - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      };
    });
  }, [skills]);

  const polygonPath = useMemo(() => points.map((p) => `${p.x},${p.y}`).join(" "), [points]);

  const grid = useMemo(() => {
    const layers = 5;
    const cx = 160;
    const cy = 160;
    const radius = 120;
    const step = (Math.PI * 2) / skills.length;
    const result: string[] = [];
    for (let l = 1; l <= layers; l++) {
      const r = (l / layers) * radius;
      const ring: string[] = [];
      for (let i = 0; i < skills.length; i++) {
        const angle = i * step - Math.PI / 2;
        ring.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
      }
      result.push(ring.join(" "));
    }
    return result;
  }, [skills.length]);

  return (
    <div className="relative w-full max-w-[360px]">
      <svg viewBox="0 0 320 320" className="w-full h-auto">
        {/* grid rings */}
        {grid.map((g, idx) => (
          <polygon key={idx} points={g} fill="none" stroke="hsl(var(--border))" strokeOpacity={0.3} />
        ))}
        {/* axes */}
        {skills.map((_, i) => {
          const cx = 160; const cy = 160; const r = 120; const step = (Math.PI * 2) / skills.length; const angle = i * step - Math.PI / 2;
          return <line key={`axis-${i}`} x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke="hsl(var(--border))" strokeOpacity={0.3} />;
        })}
        {/* polygon */}
        <motion.polygon
          points={polygonPath}
          fill={`hsla(var(--neon), 0.18)`}
          stroke={`hsl(var(--neon))`}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="neon-border"
        />
        {/* nodes */}
        {points.map((p, i) => (
          <g key={`node-${i}`} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex((v) => (v === i ? null : v))}>
            <motion.circle cx={p.x} cy={p.y} r={hoverIndex === i ? 7 : 5} fill={`hsl(var(--neon))`} filter="url(#glow)" />
            <motion.text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-xs fill-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoverIndex === i ? 1 : 0 }}
            >
              {skills[i].name}
            </motion.text>
          </g>
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
