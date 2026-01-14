
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../core/types';

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
  
  const c0 = useRef(new THREE.Color(colors[0]));
  const c1 = useRef(new THREE.Color(colors[1] || colors[0]));
  const c2 = useRef(new THREE.Color(colors[2] || colors[0]));
  const targetColor = useRef(new THREE.Color());

  const geometry = useMemo(() => {
    let segs = 24;
    if (settings.quality === 'med') segs = 40;
    if (settings.quality === 'high') segs = 60;
    return new THREE.PlaneGeometry(60, 60, segs, segs);
  }, [settings.quality]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * settings.speed;
    const lerpSpeed = 0.05;
    
    c0.current.lerp(targetColor.current.set(colors[0] || '#ffffff'), lerpSpeed);
    c1.current.lerp(targetColor.current.set(colors[1] || colors[0] || '#ffffff'), lerpSpeed);
    c2.current.lerp(targetColor.current.set(colors[2] || colors[0] || '#ffffff'), lerpSpeed);

    analyser.getByteFrequencyData(dataArray);
    let bass = 0, treble = 0;
    for(let i=0; i<10; i++) bass += dataArray[i];
    bass = (bass / 10) * settings.sensitivity;
    for(let i=100; i<140; i++) treble += dataArray[i];
    treble = (treble / 40) * settings.sensitivity;
    const bassNorm = bass / 255;
    const trebleNorm = treble / 255;

    if (materialRef.current) {
        materialRef.current.color = c0.current;
        materialRef.current.emissive = c1.current;
        materialRef.current.sheenColor = c2.current;
    }
    
    // Dynamic orbiting lights
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.1) * 30;
      light1Ref.current.position.y = 20 + Math.cos(time * 0.2) * 10;
      light1Ref.current.color = c0.current;
      light1Ref.current.intensity = 8.0 + bassNorm * 20;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(time * 0.15) * -30;
      light2Ref.current.position.z = Math.sin(time * 0.15) * 30;
      light2Ref.current.color = c1.current;
      light2Ref.current.intensity = 5.0 + trebleNorm * 15;
    }
    if (light3Ref.current) light3Ref.current.color = c2.current;
    
    // Subtle camera dolly zoom with bass
    state.camera.position.z = 16 - bassNorm * 3.0;
    state.camera.lookAt(0,0,0);

    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // More complex, organic displacement for a silkier feel
        const z1 = Math.sin(x * 0.15 + time * 0.2) * Math.cos(y * 0.12 + time * 0.14) * 3.0;
        const z2 = Math.sin(x * 0.4 - time * 0.22) * Math.sin(y * 0.35 + time * 0.18) * 1.5;
        const dist = Math.sqrt(x*x + y*y); 
        const bassRipple = Math.sin(dist * 0.8 - time * 1.5) * bassNorm * 3.0;
        
        // Higher frequency noise for fine wrinkles, disabled on low quality
        let trebleDetail = settings.quality !== 'low' 
            ? Math.cos(x * 1.8 + time * 0.6) * Math.sin(y * 2.2 + time * 0.5) * trebleNorm * 1.0 
            : 0;
            
        positions.setZ(i, z1 + z2 + bassRipple + trebleDetail);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.x = -Math.PI / 2.5;
    meshRef.current.rotation.z = time * 0.01;
  });

  return (
    <>
      <color attach="background" args={['#020205']} /> 
      <pointLight ref={light1Ref} position={[0, 20, 25]} intensity={8.0} distance={150} />
      <pointLight ref={light2Ref} position={[0, 20, 25]} intensity={5.0} distance={150} />
      <spotLight ref={light3Ref} position={[0, -40, 30]} angle={0.8} penumbra={0.6} intensity={15.0} distance={120} />
      <ambientLight intensity={0.8} />
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            ref={materialRef}
            emissiveIntensity={0.4}
            metalness={0.4}
            roughness={0.25}
            clearcoat={1.0}
            clearcoatRoughness={0.15}
            sheen={1.8} // Increased sheen for silk-like quality
            sheenRoughness={0.3}
            side={THREE.DoubleSide}
            flatShading={settings.quality === 'low'}
         />
      </mesh>
    </>
  );
};
