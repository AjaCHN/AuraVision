
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../types';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const LowPolyTerrainScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const bgMeshRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 40, 40), []);

  // Use refs for colors to lerp smoothly
  const c0 = useRef(new THREE.Color(colors[0]));
  const c1 = useRef(new THREE.Color(colors[1]));
  const c2 = useRef(new THREE.Color(colors[2] || '#1a1a2e'));
  const targetColor = useRef(new THREE.Color());

  useFrame(({ clock }) => {
     // 1. Color Lerping - Slower factor (0.002) for smoother transitions
     const lerpSpeed = 0.002;
     c0.current.lerp(targetColor.current.set(colors[0]), lerpSpeed);
     c1.current.lerp(targetColor.current.set(colors[1] || '#ffffff'), lerpSpeed);
     c2.current.lerp(targetColor.current.set(colors[2] || '#1a1a2e'), lerpSpeed);

     if (materialRef.current) materialRef.current.color = c1.current;
     if (bgMeshRef.current) bgMeshRef.current.color = c0.current;
     if (pointLightRef.current) pointLightRef.current.color = c0.current;
     if (fogRef.current) fogRef.current.color = c2.current;

     // 2. Geometry Animation
     if (!meshRef.current) return;
     analyser.getByteFrequencyData(dataArray);
     let bass = 0;
     for(let i=0; i<20; i++) bass += dataArray[i];
     bass = (bass/20) * settings.sensitivity;
     const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
     const time = clock.getElapsedTime() * settings.speed;
     for(let i=0; i<positions.count; i++) {
         const x = positions.getX(i);
         const y = positions.getY(i);
         const noiseY = y + time * 5;
         const h = Math.sin(x * 0.2) * Math.cos(noiseY * 0.2) * 2 + Math.sin(x * 0.5 + noiseY * 0.5) * 1;
         const audioH = h * (1 + bass/100);
         positions.setZ(i, audioH);
     }
     positions.needsUpdate = true;
  });

  return (
      <>
        <color attach="background" args={[colors[2] || '#1a1a2e']} /> 
        <fog ref={fogRef} attach="fog" args={[colors[2] || '#1a1a2e', 10, 40]} />
        <mesh position={[0, 10, -30]}>
            <circleGeometry args={[8, 32]} />
            <meshBasicMaterial ref={bgMeshRef} color={colors[0]} />
        </mesh>
        <mesh ref={meshRef} rotation={[-Math.PI/2, 0, 0]} position={[0, -5, 0]}>
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial 
                ref={materialRef}
                color={colors[1] || '#ffffff'} 
                flatShading={true} 
                roughness={0.8}
                metalness={0.2}
            />
        </mesh>
        <ambientLight intensity={0.5} />
        <pointLight ref={pointLightRef} position={[0, 10, -20]} intensity={2} color={colors[0]} />
      </>
  );
};
