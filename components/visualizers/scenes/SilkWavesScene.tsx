
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../types';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const SilkWavesScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.SpotLight>(null);

  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  
  // Use refs for colors to lerp smoothly
  const c0 = useRef(new THREE.Color(colors[0]));
  const c1 = useRef(new THREE.Color(colors[1]));
  const c2 = useRef(new THREE.Color(colors[2] || '#ffffff'));
  const targetColor = useRef(new THREE.Color());

  // Optimized: Adjust segments based on quality setting
  const geometry = useMemo(() => {
    let segs = 24;
    if (settings.quality === 'med') segs = 35;
    if (settings.quality === 'high') segs = 50;
    return new THREE.PlaneGeometry(60, 60, segs, segs);
  }, [settings.quality]);

  useFrame((state) => {
    // 1. Color Lerping - Slower factor (0.005) for smoother transitions
    const lerpSpeed = 0.005;
    c0.current.lerp(targetColor.current.set(colors[0]), lerpSpeed);
    c1.current.lerp(targetColor.current.set(colors[1]), lerpSpeed);
    c2.current.lerp(targetColor.current.set(colors[2] || '#ffffff'), lerpSpeed);

    if (materialRef.current) {
        materialRef.current.color = c0.current;
        materialRef.current.emissive = c1.current;
        materialRef.current.sheenColor = c2.current;
    }
    if (light1Ref.current) light1Ref.current.color = c0.current;
    if (light2Ref.current) light2Ref.current.color = c1.current;
    if (light3Ref.current) light3Ref.current.color = c2.current;

    // 2. Geometry Animation
    if (!meshRef.current) return;
    analyser.getByteFrequencyData(dataArray);

    let bass = 0;
    let treble = 0;

    for(let i=0; i<10; i++) bass += dataArray[i];
    bass = (bass / 10) * settings.sensitivity;

    for(let i=100; i<140; i++) treble += dataArray[i];
    treble = (treble / 40) * settings.sensitivity;

    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime() * settings.speed * 0.2;

    const bassNorm = bass / 255;
    const trebleNorm = treble / 255;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const z1 = Math.sin(x * 0.15 + time) * Math.cos(y * 0.12 + time * 0.7) * 4.0;
        const z2 = Math.sin(x * 0.4 - time * 1.2) * Math.sin(y * 0.35 + time * 0.9) * 2.0;
        
        const distSq = x*x + y*y; 
        const dist = Math.sqrt(distSq); 
        const bassRipple = Math.sin(dist * 0.8 - time * 4.0) * bassNorm * 4.0;
        
        let trebleDetail = 0;
        if (settings.quality !== 'low') {
            trebleDetail = Math.cos(x * 2.0 + time * 3.0) * Math.sin(y * 2.0 + time * 3.0) * trebleNorm * 1.2;
        }
        
        const combinedZ = z1 + z2 + bassRipple + trebleDetail;
        
        positions.setZ(i, combinedZ);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.x = -Math.PI / 2.5;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <>
      <color attach="background" args={['#020205']} /> 
      <pointLight ref={light1Ref} position={[25, 40, 25]} intensity={8.0} distance={150} />
      <pointLight ref={light2Ref} position={[-25, 20, 25]} intensity={5.0} distance={150} />
      <spotLight ref={light3Ref} position={[0, -40, 30]} angle={0.8} penumbra={0.6} intensity={15.0} distance={120} />
      <ambientLight intensity={0.8} />
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            ref={materialRef}
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.2}
            sheen={1.5}
            sheenRoughness={0.4}
            side={THREE.DoubleSide}
            flatShading={settings.quality === 'low'}
         />
      </mesh>
    </>
  );
};
