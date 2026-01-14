
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../core/types';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const LowPolyTerrainScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const fogRef = useRef<THREE.Fog>(null);

  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  const geometry = useMemo(() => {
    const segments = settings.quality === 'high' ? 50 : settings.quality === 'med' ? 35 : 25;
    return new THREE.PlaneGeometry(80, 80, segments, segments);
  }, [settings.quality]);

  const c0 = useRef(new THREE.Color(colors[0])); // Sun/Moon
  const c1 = useRef(new THREE.Color(colors[1] || colors[0])); // Terrain
  const c2 = useRef(new THREE.Color(colors[2] || colors[0])); // Fog/Sky
  const targetColor = useRef(new THREE.Color());

  useFrame(({ clock }) => {
     const time = clock.getElapsedTime() * settings.speed * 0.2;
     const lerpSpeed = 0.05;
     c0.current.lerp(targetColor.current.set(colors[0] || '#ffffff'), lerpSpeed);
     c1.current.lerp(targetColor.current.set(colors[1] || colors[0] || '#ffffff'), lerpSpeed);
     c2.current.lerp(targetColor.current.set(colors[2] || '#1a1a2e'), lerpSpeed);

     analyser.getByteFrequencyData(dataArray);
     let bass = 0, mids = 0;
     for(let i=0; i<20; i++) bass += dataArray[i];
     bass = (bass/20) * settings.sensitivity / 255;
     for(let i=20; i<80; i++) mids += dataArray[i];
     mids = (mids/60) * settings.sensitivity / 255;

     if (materialRef.current) materialRef.current.color = c1.current;
     if (sunRef.current) {
        (sunRef.current.material as THREE.MeshBasicMaterial).color = c0.current;
        // Sun pulses and moves
        const sunScale = 1.0 + bass * 0.5;
        sunRef.current.scale.set(sunScale, sunScale, sunScale);
        sunRef.current.position.y = 10 + Math.cos(time * 0.2) * 5;
     }
     if (fogRef.current) {
        fogRef.current.color = c2.current;
        // Fog density reacts to music
        fogRef.current.near = 10 - bass * 5;
        fogRef.current.far = 40 + mids * 15;
     }

     if (!meshRef.current) return;
     const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;

     for(let i=0; i<positions.count; i++) {
         const x = positions.getX(i);
         const y = positions.getY(i);

         // Fractal noise for more realistic terrain
         const y_moved = y + time * 10;
         const noise1 = Math.sin(x * 0.1 + y_moved * 0.05) * 2.0;
         const noise2 = Math.sin(x * 0.3 + y_moved * 0.2) * 0.8;
         const noise3 = settings.quality === 'high' ? Math.sin(x * 0.8 + y_moved * 0.6) * 0.3 : 0;
         
         const height = noise1 + noise2 + noise3;
         const audioH = height * (1 + bass * 1.5);
         positions.setZ(i, audioH);
     }
     positions.needsUpdate = true;
     meshRef.current.geometry.computeVertexNormals();
  });

  // Set initial camera to a more dramatic fly-over angle
  const cameraProps = { position: [0, 2, 18], fov: 60 };

  return (
      <>
        <color attach="background" args={[c2.current.getStyle()]} /> 
        <fog ref={fogRef} attach="fog" args={[c2.current.getStyle(), 10, 40]} />
        <Stars radius={150} depth={100} count={6000} factor={5} saturation={0} fade speed={1.5} />
        
        {/* Sun/Moon */}
        <mesh ref={sunRef} position={[0, 10, -30]}>
            <circleGeometry args={[8, 32]} />
            <meshBasicMaterial color={c0.current} toneMapped={false} />
        </mesh>
        
        {/* Terrain Mesh */}
        <mesh ref={meshRef} rotation={[-Math.PI/2.2, 0, 0]} position={[0, -5, 0]}>
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial 
                ref={materialRef}
                flatShading={true} 
                roughness={0.9}
                metalness={0.1}
            />
        </mesh>
        
        <ambientLight intensity={0.6} color={c1.current} />
        <directionalLight 
            color={c0.current} 
            intensity={2.5} 
            position={[10, 20, -20]}
        />
      </>
  );
};
