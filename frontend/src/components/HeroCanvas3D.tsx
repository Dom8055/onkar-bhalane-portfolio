import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ArchitecturalMesh({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 140;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.8 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.11;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, state.pointer.y * 0.22, 0.04);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -state.pointer.x * 0.18, 0.04);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.035;
    }
  });

  const primaryLine = isDark ? '#38BDF8' : '#A77B43';
  const secondaryLine = isDark ? '#B68B50' : '#17191F';

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 5, 6]} intensity={1.6} color={primaryLine} />
      <pointLight position={[-6, -4, -3]} intensity={1.1} color={secondaryLine} />

      <group ref={meshRef} position={[1.4, 0.1, -0.5]}>
        <mesh>
          <octahedronGeometry args={[2.1, 2]} />
          <meshStandardMaterial
            color={primaryLine}
            wireframe
            transparent
            opacity={isDark ? 0.22 : 0.14}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[Math.PI / 5, Math.PI / 4, 0]}>
          <icosahedronGeometry args={[2.75, 1]} />
          <meshStandardMaterial
            color={secondaryLine}
            wireframe
            transparent
            opacity={isDark ? 0.16 : 0.1}
          />
        </mesh>
      </group>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color={isDark ? '#93C5FD' : '#A77B43'}
          transparent
          opacity={isDark ? 0.5 : 0.35}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export const HeroCanvas3D: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
      <Canvas camera={{ position: [0, 0, 6.8], fov: 44 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ArchitecturalMesh isDark={isDark} />
      </Canvas>
    </div>
  );
};
