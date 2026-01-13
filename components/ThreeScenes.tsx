
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerSettings } from '../types';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const SilkWavesScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  // Optimized geometry: 100x100 segments
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 100, 100), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    analyser.getByteFrequencyData(dataArray);

    let bass = 0;
    let treble = 0;

    for(let i=0; i<20; i++) bass += dataArray[i];
    bass = (bass / 20) * settings.sensitivity;

    for(let i=100; i<180; i++) treble += dataArray[i];
    treble = (treble / 80) * settings.sensitivity;

    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime() * settings.speed * 0.2;

    const bassNorm = bass / 255;
    const trebleNorm = treble / 255;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const z1 = Math.sin(x * 0.15 + time) * Math.cos(y * 0.12 + time * 0.7) * 4.0;
        const z2 = Math.sin(x * 0.4 - time * 1.2) * Math.sin(y * 0.35 + time * 0.9) * 2.0;
        
        const dist = Math.sqrt(x*x + y*y);
        const bassRipple = Math.sin(dist * 0.8 - time * 4.0) * bassNorm * 4.0;
        
        const trebleDetail = Math.cos(x * 2.0 + time * 3.0) * Math.sin(y * 2.0 + time * 3.0) * trebleNorm * 1.2;
        
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
      <pointLight position={[25, 40, 25]} intensity={8.0} color={colors[0]} distance={150} />
      <pointLight position={[-25, 20, 25]} intensity={5.0} color={colors[1]} distance={150} />
      <spotLight position={[0, -40, 30]} angle={0.8} penumbra={0.6} intensity={15.0} color={colors[2] || '#ffffff'} distance={120} />
      <ambientLight intensity={0.8} />
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            color={colors[0]} 
            emissive={colors[1]} 
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.2}
            sheen={1.5}
            sheenColor={new THREE.Color(colors[2] || '#ffffff')}
            sheenRoughness={0.4}
            side={THREE.DoubleSide}
            flatShading={false}
         />
      </mesh>
    </>
  );
};

export const LiquidSphereScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  // Optimized geometry: detail 4
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(4, 4), []);
  const originalPositions = useMemo(() => {
     const pos = geometry.attributes.position;
     const count = pos.count;
     const array = new Float32Array(count * 3);
     for(let i=0; i<count; i++) {
         array[i*3] = pos.getX(i);
         array[i*3+1] = pos.getY(i);
         array[i*3+2] = pos.getZ(i);
     }
     return array;
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    analyser.getByteFrequencyData(dataArray);
    
    let bass = 0;
    let treble = 0;
    
    for(let i=0; i<20; i++) bass += dataArray[i];
    bass = (bass / 20) * settings.sensitivity;
    
    for(let i=80; i<150; i++) treble += dataArray[i];
    treble = (treble / 70) * settings.sensitivity;

    const time = clock.getElapsedTime() * settings.speed * 0.4;
    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < positions.count; i++) {
        const ox = originalPositions[i*3];
        const oy = originalPositions[i*3+1];
        const oz = originalPositions[i*3+2];
        
        const noise1 = Math.sin(ox * 0.4 + time) * Math.cos(oy * 0.3 + time * 0.8) * Math.sin(oz * 0.4 + time * 1.2);
        
        const noise2 = Math.sin(ox * 2.5 + time * 1.5) * Math.cos(oy * 2.5 + time * 1.7) * Math.sin(oz * 2.5 + time * 1.3);
        
        const reactivity = (bass / 255);
        const vibration = (treble / 255);

        const d1 = noise1 * (0.3 + reactivity * 0.5);
        const d2 = noise2 * (0.05 + vibration * 0.15);

        const totalDisplacement = 1 + d1 + d2;
        
        positions.setXYZ(i, ox * totalDisplacement, oy * totalDisplacement, oz * totalDisplacement);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <>
      <color attach="background" args={['#050505']} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[15, 15, 15]} intensity={2} color={colors[0]} />
      <pointLight position={[-15, -15, -5]} intensity={2} color={colors[1]} />
      <spotLight position={[0, 10, 0]} intensity={1} color={colors[2] || '#ffffff'} angle={0.5} penumbra={1} />
      
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            color={colors[0]}
            emissive={colors[1]}
            emissiveIntensity={0.2}
            metalness={0.95}    
            roughness={0.08}    
            clearcoat={1.0}     
            clearcoatRoughness={0.1}
            reflectivity={1.0}
            envMapIntensity={1.2}
            side={THREE.DoubleSide}
         />
      </mesh>
    </>
  );
};

export const LowPolyTerrainScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 40, 40), []);

  useFrame(({ clock }) => {
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
        <fog attach="fog" args={[colors[2] || '#1a1a2e', 10, 40]} />
        <mesh position={[0, 10, -30]}>
            <circleGeometry args={[8, 32]} />
            <meshBasicMaterial color={colors[0]} />
        </mesh>
        <mesh ref={meshRef} rotation={[-Math.PI/2, 0, 0]} position={[0, -5, 0]}>
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial 
                color={colors[1] || '#ffffff'} 
                flatShading={true} 
                roughness={0.8}
                metalness={0.2}
            />
        </mesh>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, -20]} intensity={2} color={colors[0]} />
      </>
  );
};
