import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

type Milestone = { id: string; title: string; subtitle: string; year: string; position: [number, number, number]; color?: string };

const milestones: Milestone[] = [
  { id: "scholarship", title: "Scholarship", subtitle: "Merit-based award", year: "2023", position: [-2.4, 0.6, -1.6], color: "#7dd3fc" },
  { id: "hackathon", title: "Hackathon Winner", subtitle: "Built an AI tool in 24h", year: "2024", position: [1.8, 1.2, -2.2], color: "#f0abfc" },
  { id: "project", title: "Project Launch", subtitle: "3D Portfolio Engine", year: "2024", position: [0.2, -0.8, -1.7], color: "#a78bfa" },
  { id: "seminar", title: "Seminar Speaker", subtitle: "Future of Web+AI", year: "2025", position: [-1.3, -1.5, -2.5], color: "#93c5fd" },
];

function Stars({ onHover }: { onHover: (m: Milestone | null, p: THREE.Vector3 | null) => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = new THREE.Color();
  const { raycaster, pointer, camera } = useThree();
  const [scales] = useState<number[]>(() => new Array(milestones.length).fill(1));

  // Initialize instance transforms and colors after mesh ref is set
  useEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      dummy.position.set(...m.position);
      dummy.scale.setScalar(0.18);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, color.set(m.color || "#67e8f9"));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if ((mesh.current as any).instanceColor) (mesh.current as any).instanceColor.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    for (let i = 0; i < milestones.length; i++) {
      const s = 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.06;
      scales[i] = THREE.MathUtils.lerp(scales[i], s, 0.08);
      mesh.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, new THREE.Quaternion(), new THREE.Vector3());
      dummy.scale.setScalar(0.18 * scales[i]);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;

    // hover detection
    raycaster.setFromCamera(pointer, camera);
    const intersects: any[] = raycaster.intersectObject(mesh.current as any);
    if (intersects.length > 0 && mesh.current) {
      const idx = intersects[0].instanceId ?? 0;
      const m = milestones[idx];
      const p = new THREE.Vector3();
      const mat = new THREE.Matrix4();
      mesh.current.getMatrixAt(idx, mat);
      p.setFromMatrixPosition(mat);
      onHover(m, p);
    } else onHover(null, null);
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as any, undefined as any, milestones.length]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial toneMapped={false} emissiveIntensity={2} />
    </instancedMesh>
  );
}

export default function CareerGalaxy() {
  const [active, setActive] = useState<Milestone | null>(null);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <section data-section="career" className="relative py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gradient">Interactive Career Journey</h2>
        <p className="text-foreground/80 mb-6">Hover stars to explore milestones. Click to pin details.</p>
        <div className="relative h-[420px] rounded-2xl glass neon-border overflow-hidden">
          <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <Suspense fallback={null}>
              <Stars
                onHover={(m) => {
                  setActive(m);
                }}
              />
            </Suspense>
          </Canvas>
          {active && (
            <div className="absolute left-4 top-4 glass neon-border p-4 rounded-xl">
              <div className="text-sm opacity-80">{active.year}</div>
              <div className="text-lg font-semibold">{active.title}</div>
              <div className="text-foreground/80">{active.subtitle}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
