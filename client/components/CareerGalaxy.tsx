import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

export type Milestone = { id: string; title: string; subtitle: string; year?: string; description?: string; color?: string; radius?: number; speed?: number; textureUrl?: string; size?: number };

const tex = {
  earth: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  mars: "https://threejs.org/examples/textures/planets/mars_1k_color.jpg",
  jupiter: "https://threejs.org/examples/textures/planets/jupiter.jpg",
  venus: "https://threejs.org/examples/textures/planets/venus.jpg",
  mercury: "https://threejs.org/examples/textures/planets/mercury.jpg",
  neptune: "https://threejs.org/examples/textures/planets/neptune.jpg",
};

const milestones: Milestone[] = [
  { id: "scholarship", year: "2023", title: "Scholarship", subtitle: "Awarded 50% External Scholarship", description: "Recognized for academic excellence.", color: "#7dd3fc", radius: 2.2, speed: 0.22, textureUrl: tex.earth, size: 0.38 },
  { id: "seminar", year: "2024", title: "Seminar", subtitle: "Hosted Stroke Awareness Seminar", description: "Organized and presented an impactful seminar.", color: "#93c5fd", radius: 2.8, speed: 0.2, textureUrl: tex.venus, size: 0.34 },
  { id: "hackathon", year: "2025", title: "Hackathon Participation", subtitle: "Participated in Hackathon 2025", description: "Focused on learning and innovation.", color: "#f0abfc", radius: 3.2, speed: 0.28, textureUrl: tex.mars, size: 0.32 },
  { id: "agriplay", title: "AgriPlay", subtitle: "Smart agriculture game", description: "Educates farmers with playful simulations.", color: "#34d399", radius: 1.7, speed: 0.35, textureUrl: tex.jupiter, size: 0.55 },
  { id: "sign-speech", title: "Sign → Speech", subtitle: "Sign language to speech", description: "Real-time gesture to speech.", color: "#60a5fa", radius: 2.0, speed: 0.32, textureUrl: tex.neptune, size: 0.4 },
  { id: "skinscope", title: "SkinScope", subtitle: "Skin condition analyzer", description: "Image-based diagnostics.", color: "#f472b6", radius: 2.4, speed: 0.27, textureUrl: tex.mercury, size: 0.3 },
  { id: "deloitte", title: "Deloitte Health Dashboard", subtitle: "Healthcare analytics", description: "Actionable dashboards for insights.", color: "#a78bfa", radius: 2.6, speed: 0.26, textureUrl: tex.earth, size: 0.36 },
];

function Starfield() {
  const ref = useRef<THREE.Points>(null!);
  const [geo] = useState(() => new THREE.BufferGeometry());
  const [mat] = useState(() => new THREE.PointsMaterial({ color: 0xffffff, size: 0.01, sizeAttenuation: true, transparent: true, opacity: 0.8 }));
  const positions = useMemo(() => {
    const count = 1200; const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { const r = 6 * Math.random() + 2; const t = Math.random() * Math.PI * 2; const p = Math.acos(2 * Math.random() - 1) - Math.PI / 2; arr[i*3] = Math.cos(t) * Math.cos(p) * r; arr[i*3+1] = Math.sin(p) * r; arr[i*3+2] = Math.sin(t) * Math.cos(p) * r; }
    return arr;
  }, []);
  useEffect(() => { geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); }, [geo, positions]);
  useFrame((state) => { ref.current.rotation.y += 0.0006; ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05; });
  return <points ref={ref} geometry={geo} material={mat} />;
}

function Nebula() {
  const group = useRef<THREE.Group>(null!);
  const mats = useMemo(() => [new THREE.MeshBasicMaterial({ color: new THREE.Color('#8b5cf6'), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }), new THREE.MeshBasicMaterial({ color: new THREE.Color('#10b981'), transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })], []);
  useFrame((s) => { const t = s.clock.elapsedTime; group.current.rotation.z = t * 0.02; });
  return (
    <group ref={group}>
      <mesh rotation={[0,0,0]}>
        <circleGeometry args={[4, 64]} />
        <primitive object={mats[0]} attach="material" />
      </mesh>
      <mesh rotation={[0,0,0]} scale={1.3}>
        <circleGeometry args={[3.2, 64]} />
        <primitive object={mats[1]} attach="material" />
      </mesh>
    </group>
  );
}

function ShootingStars() {
  const refs = useRef<THREE.Mesh[]>([]);
  const pool = 6;
  useEffect(() => { refs.current = refs.current.slice(0, pool); }, []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      const tt = (t + i * 1.7) % 5;
      const x = -3 + tt * 1.2; const y = 1.5 - tt * 0.6; const z = -1 - (i % 3) * 0.2;
      m.position.set(x, y, z); m.visible = tt < 4.6;
    });
  });
  return (
    <group>
      {Array.from({ length: pool }).map((_, i) => (
        <mesh key={i} ref={(el) => el && (refs.current[i] = el)}>
          <boxGeometry args={[0.12, 0.01, 0.01]} />
          <meshBasicMaterial color={0xffffff} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Planet({ m, onSelect }: { m: Milestone; onSelect: (m: Milestone) => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const [hover, setHover] = useState(false);
  const angle0 = useMemo(() => Math.random() * Math.PI * 2, []);
  const texture = useLoader(THREE.TextureLoader, m.textureUrl || "");
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (m.speed ?? 0.25) + angle0;
    const r = m.radius ?? 1.5;
    ref.current.position.set(Math.cos(t) * r, Math.sin(t * 0.9) * 0.25, Math.sin(t) * r);
    ref.current.rotation.y += 0.01;
    const s = hover ? 1.2 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, s, 0.08));
    if (ring.current) ring.current.rotation.z += 0.01;
  });
  return (
    <group>
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); onSelect(m); }}
      >
        <sphereGeometry args={[m.size ?? 0.3, 32, 32]} />
        {m.textureUrl ? (
          <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
        ) : (
          <meshStandardMaterial color={m.color || '#67e8f9'} emissive={new THREE.Color(m.color || '#67e8f9')} emissiveIntensity={0.6} roughness={0.3} metalness={0.4} />
        )}
      </mesh>
      {hover && (
        <mesh ref={ring} position={ref.current ? ref.current.position : undefined}>
          <torusGeometry args={[ (m.size ?? 0.3) + 0.08, 0.006, 8, 60]} />
          <meshBasicMaterial color={m.color || '#67e8f9'} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function Galaxy() {
  const group = useRef<THREE.Group>(null!);
  useFrame(() => { group.current.rotation.y += 0.0008; });
  const handleSelect = (m: Milestone) => {
    const ev = new CustomEvent('milestone-select', { detail: m });
    window.dispatchEvent(ev);
  };
  return (
    <group ref={group}>
      <Nebula />
      <Starfield />
      <ShootingStars />
      {milestones.map((m) => (
        <Planet key={m.id} m={m} onSelect={handleSelect} />
      ))}
    </group>
  );
}

export default function CareerGalaxy() {
  const [active, setActive] = useState<Milestone | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onSel = (e: any) => setActive(e.detail as Milestone);
    window.addEventListener('milestone-select', onSel as any);
    return () => window.removeEventListener('milestone-select', onSel as any);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) { audioRef.current.volume = 0.25; audioRef.current.play().catch(() => {}); }
    else { audioRef.current.pause(); }
  }, [musicOn]);

  return (
    <section data-section="career" className="relative py-24">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gradient">Career Journey Galaxy</h2>
          <button className="btn-neon" onClick={() => setMusicOn((v) => !v)}>{musicOn ? 'Music: On' : 'Music'}</button>
          <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/10/30/audio_8b18284c02.mp3?filename=ambient-celestial-ambient-124008.mp3" />
        </div>
        <p className="text-foreground/80 mb-6">Hover stars → planets with orbits. Click to reveal details.</p>
        <div className="relative h-[460px] rounded-2xl glass neon-border overflow-hidden">
          {/* CSS starfield and nebula background */}
          <div className="absolute inset-0 -z-10">
            <div className="galaxy-bg" />
            <div className="galaxy-star-field">
              <div className="galaxy-layer" />
              <div className="galaxy-layer" />
              <div className="galaxy-layer" />
            </div>
          </div>

          <Canvas camera={{ position: [0, 0.4, 5.2], fov: 60 }} dpr={[1, 2]}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.1} />
            <Suspense fallback={null}>
              <Galaxy />
            </Suspense>
          </Canvas>

          {active && (
            <div className="absolute left-4 top-4 right-4 md:right-auto md:max-w-md glass neon-border p-5 rounded-xl animate-[glow_3s_ease-in-out_infinite]">
              {active.year && <div className="text-xs opacity-80 mb-1">{active.year}</div>}
              <div className="text-lg font-semibold">{active.title}</div>
              <div className="text-foreground/80">{active.subtitle}</div>
              {active.description && <p className="mt-2 text-sm text-foreground/70">{active.description}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
