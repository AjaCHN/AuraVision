import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerSettings } from '../types';

// Fix for missing JSX types in this environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      color: any;
      fog: any;
      mesh: any;
      circleGeometry: any;
      meshBasicMaterial: any;
      pointLight: any;
      primitive: any;
      meshStandardMaterial: any;
      ambientLight: any;
    }
  }
}

interface ThreeVisualizerProps {
  analyser: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
}

// --- SYNTHWAVE SCENE ---
const SynthwaveScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const { clock, camera } = useThree();
  
  // Create grid geometry
  const geometry = useMemo(() => {
    // 64x64 segments plane
    return new THREE.PlaneGeometry(100, 100, 64, 64); 
  }, []);

  // Audio data buffer
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);

  useFrame(() => {
    if (!meshRef.current || !sunRef.current) return;

    // Get Audio Data
    analyser.getByteFrequencyData(dataArray);

    // Calculate Bass Energy for Sun Pulse
    let bass = 0;
    for (let i = 0; i < 10; i++) bass += dataArray[i];
    bass = (bass / 10) * settings.sensitivity;
    
    // Animate Sun
    const sunScale = 5 + (bass / 255) * 2;
    sunRef.current.scale.set(sunScale, sunScale, sunScale);
    sunRef.current.position.y = 10 + Math.sin(clock.getElapsedTime() * 0.5) * 2;

    // Animate Grid Terrain
    const positions = meshRef.current.geometry.attributes.position;
    const count = positions.count;
    const time = clock.getElapsedTime() * settings.speed;

    // We want the grid to move towards camera (y axis in plane geometry space implies z in world if rotated)
    // Actually, let's keep geometry static X/Y and scroll noise? 
    // Easier: Map frequency data to Z height based on Y position (distance)
    
    for (let i = 0; i < count; i++) {
        // Plane is defined in x, y. We modify z (height).
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Simplex-ish movement
        const movement = (y + time * 20) % 100;
        
        // Map audio freq to x position
        // Map x (-50 to 50) to freq index (0 to ~100)
        const freqIndex = Math.floor(Math.abs(x) + Math.abs(y * 0.5)) % (dataArray.length / 4);
        const audioVal = dataArray[freqIndex] || 0;
        
        // Height formula
        // 1. Base rolling hills
        const noise = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time);
        // 2. Audio Spike
        const spike = (audioVal / 255) * settings.sensitivity * 8;
        
        // Apply
        let z = noise * 2;
        if (Math.abs(x) < 15) { // Road in middle is flat
            z = 0;
        } else {
            z += spike;
        }
        
        positions.setZ(i, z);
    }
    
    positions.needsUpdate = true;
    
    // Move Mesh to simulate infinite scrolling? 
    // Instead we scrolled the noise above.
  });

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 60]} />

      {/* Retro Sun */}
      <mesh ref={sunRef} position={[0, 10, -40]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color={colors[0]} />
      </mesh>
      
      {/* Glow for Sun */}
      <pointLight position={[0, 10, -35]} intensity={2} color={colors[0]} distance={50} />

      {/* Terrain */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial 
            color={colors[1]} 
            wireframe={true} 
            emissive={colors[2] || colors[1]}
            emissiveIntensity={2}
            roughness={0.1}
            metalness={0.8}
        />
      </mesh>
      
      <ambientLight intensity={0.5} />
    </>
  );
};

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ analyser, colors, settings }) => {
  if (!analyser) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 2, 15], fov: 60 }} 
        dpr={[1, 2]} // Optimize pixel ratio
        gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}
      >
        <SynthwaveScene analyser={analyser} colors={colors} settings={settings} />
        
        {/* Post Processing Effects */}
        {settings.glow && (
            <EffectComposer>
                <Bloom 
                    luminanceThreshold={0.2} 
                    luminanceSmoothing={0.9} 
                    height={300} 
                    intensity={1.5} 
                />
                <ChromaticAberration 
                    offset={new THREE.Vector2(0.002 * settings.sensitivity, 0.002)}
                />
            </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;