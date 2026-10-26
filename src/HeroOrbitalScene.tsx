import { useEffect, useRef } from "react";
import { Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, Group } from "three";

type Orbiter = {
  color: string;
  radius: number;
  size: number;
  speed: number;
  phase: number;
  depth: number;
  direction: number;
};

const orbiters: Orbiter[] = [
  { color: "#e7a721", radius: 0.29, size: 18, speed: 0.3, phase: 0.45, depth: 0.18, direction: 1 },
  { color: "#168bd5", radius: 0.36, size: 15, speed: 0.22, phase: 2.2, depth: 0.28, direction: -1 },
  { color: "#f2bd50", radius: 0.25, size: 13, speed: 0.17, phase: 4.25, depth: 0.12, direction: 1 },
  { color: "#0879c9", radius: 0.41, size: 11, speed: 0.13, phase: 5.55, depth: 0.24, direction: -1 },
  { color: "#c88511", radius: 0.32, size: 10, speed: 0.19, phase: 3.2, depth: 0.3, direction: 1 },
];

function OrbitalTrail({ radius, color, rotation }: { radius: number; color: string; rotation: [number, number, number] }) {
  const { size } = useThree();
  const scale = size.width / 80;

  return (
    <mesh
      position={[(size.width * 0.12) / 80, -(size.height * 0.02) / 80, -0.12]}
      rotation={rotation}
      scale={[scale * radius, (size.height / 80) * radius * 0.67, 1]}
    >
      <torusGeometry args={[1, 0.0045, 5, 128]} />
      <meshBasicMaterial color={color} transparent opacity={color === "#f5ae22" ? 0.28 : 0.25} depthWrite={false} />
    </mesh>
  );
}

function OrbitalSphere({ orb, index, reducedMotion }: { orb: Orbiter; index: number; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const { size } = useThree();
  const centerX = (size.width * 0.12) / 80;
  const centerY = -(size.height * 0.02) / 80;

  useFrame(({ clock }, delta) => {
    const container = group.current;
    if (!container || reducedMotion) return;
    const angle = clock.elapsedTime * orb.speed * orb.direction + orb.phase;
    const rx = (size.width * orb.radius) / 80;
    const ry = (size.height * orb.radius * 0.67) / 80;
    container.position.set(
      centerX + Math.cos(angle) * rx,
      centerY + Math.sin(angle) * ry + Math.sin(clock.elapsedTime * 0.65 + orb.phase) * 0.035,
      Math.sin(angle) * orb.depth,
    );
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.12;
      mesh.current.rotation.y += delta * (0.18 + index * 0.025);
    }
  });

  const radius = orb.size / 80;

  return (
    <group ref={group} position={[centerX + Math.cos(orb.phase) * ((size.width * orb.radius) / 80), centerY + Math.sin(orb.phase) * ((size.height * orb.radius * 0.67) / 80), 0]}>
      <Float speed={reducedMotion ? 0 : 0.5 + index * 0.09} floatIntensity={reducedMotion ? 0 : 0.08} rotationIntensity={reducedMotion ? 0 : 0.08}>
        <mesh ref={mesh}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshPhysicalMaterial
            color={orb.color}
            metalness={0.84}
            roughness={0.2}
            clearcoat={0.95}
            clearcoatRoughness={0.12}
            emissive={orb.color}
            emissiveIntensity={0.08}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroOrbitalScene({ reducedMotion }: { reducedMotion: boolean }) {
  const hero = document.querySelector<HTMLElement>(".hero");
  const pointer = useRef({ x: 0, y: 0 });
  const orbitSystem = useRef<Group>(null);

  useEffect(() => {
    if (!hero) return;
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      pointer.current.x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      pointer.current.y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
    };
    const handlePointerLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [hero]);

  useFrame(() => {
    if (!orbitSystem.current || reducedMotion) return;
    orbitSystem.current.position.x += (pointer.current.x * 0.12 - orbitSystem.current.position.x) * 0.035;
    orbitSystem.current.position.y += (-pointer.current.y * 0.08 - orbitSystem.current.position.y) * 0.035;
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[-3, 4, 7]} intensity={2.8} color="#ffffff" />
      <pointLight position={[2.4, 1.5, 4]} intensity={45} distance={9} color="#8ccfff" />
      <pointLight position={[-2.5, -1.5, 3]} intensity={34} distance={8} color="#ffd06b" />
      <group ref={orbitSystem}>
        <OrbitalTrail radius={0.3} color="#f5ae22" rotation={[0.14, 0.18, -0.08]} />
        <OrbitalTrail radius={0.39} color="#168bd5" rotation={[-0.12, -0.16, 0.06]} />
        <OrbitalTrail radius={0.43} color="#e9af3d" rotation={[0.2, -0.1, 0.12]} />
        {orbiters.map((orb, index) => (
          <OrbitalSphere key={orb.phase} orb={orb} index={index} reducedMotion={reducedMotion} />
        ))}
      </group>
    </>
  );
}
