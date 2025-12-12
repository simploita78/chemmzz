import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ElementData } from '../types';
import { getElectronConfiguration } from '../utils/chemistry';

// Augment the JSX namespace to include React Three Fiber elements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ringGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ringGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface AtomVisualizerProps {
  element: ElementData;
}

const Nucleus: React.FC<{ protons: number }> = ({ protons }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create a clump of protons/neutrons
  // We approximate mass ~ 2x protons for simplicity in visualization sizing
  const particles = useMemo(() => {
    const count = Math.max(protons * 2, 2); // At least 2 particles
    const temp = [];
    const radius = Math.cbrt(count) * 0.4; // Packing radius approximation
    
    for (let i = 0; i < count; i++) {
      const isProton = i < protons;
      // Random spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.pow(Math.random(), 1/3) * radius; // Uniform distribution in sphere
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      temp.push({ position: [x, y, z] as [number, number, number], isProton });
    }
    return temp;
  }, [protons]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={p.isProton ? "#ef4444" : "#3b82f6"} 
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
      <pointLight position={[0,0,0]} intensity={2} distance={10} color="#ffffff" />
    </group>
  );
};

const ElectronShell: React.FC<{ radius: number, count: number, speed: number, index: number }> = ({ radius, count, speed, index }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * speed;
      // Rotate the whole shell group to simulate orbits
      // Vary rotation axis based on index to create a "atom" look instead of flat solar system
      groupRef.current.rotation.x = Math.sin(t * 0.2 + index) * 0.5;
      groupRef.current.rotation.y = t;
      groupRef.current.rotation.z = Math.cos(t * 0.3 + index) * 0.5;
    }
  });

  const electrons = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      temp.push(angle);
    }
    return temp;
  }, [count]);

  return (
    <group ref={groupRef}>
      {/* Orbital Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Electrons */}
      {electrons.map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[radius, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const AtomVisualizer: React.FC<AtomVisualizerProps> = ({ element }) => {
  const shells = useMemo(() => getElectronConfiguration(element.number), [element.number]);

  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
      <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Nucleus protons={element.number} />
        
        {shells.map((shell, i) => (
          <ElectronShell 
            key={i} 
            index={i}
            radius={3 + (i * 1.5)} 
            count={shell.electrons} 
            speed={0.5 - (i * 0.05)} 
          />
        ))}
        
        <OrbitControls enablePan={false} maxDistance={40} minDistance={5} />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
        <p>Left Click to Rotate • Scroll to Zoom</p>
      </div>
    </div>
  );
};