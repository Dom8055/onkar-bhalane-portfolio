import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GoldWireframeSculpture() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const count = 180;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.16;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.25, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -state.pointer.x * 0.2, 0.05);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={1.8} color="#D8B779" />
      <pointLight position={[-5, -3, -4]} intensity={0.9} color="#3B5998" />

      <group ref={groupRef} position={[0, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.65, 1]} />
          <meshStandardMaterial color="#B68B50" wireframe transparent opacity={0.32} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <torusGeometry args={[2.25, 0.015, 16, 100]} />
          <meshStandardMaterial color="#D8B779" transparent opacity={0.4} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
          <torusGeometry args={[2.65, 0.01, 16, 100]} />
          <meshStandardMaterial color="#B68B50" transparent opacity={0.22} />
        </mesh>
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#D8B779" transparent opacity={0.55} sizeAttenuation />
      </points>
    </>
  );
}

export const HeroCanvas3D: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-75">
      <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <GoldWireframeSculpture />
      </Canvas>
    </div>
  );
};
