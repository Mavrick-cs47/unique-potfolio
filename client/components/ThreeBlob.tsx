import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.15;
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.35, 220, 16, 2, 3]} />
      <meshStandardMaterial
        color={new THREE.Color("hsl(180, 100%, 65%)")}
        metalness={0.6}
        roughness={0.2}
        emissive={new THREE.Color("hsl(178, 100%, 50%)")}
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}

export default function ThreeBlob() {
  return (
    <div className="absolute inset-0 -z-0">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Knot />
        </Suspense>
      </Canvas>
    </div>
  );
}
