
import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../core/types';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

export const LiquidSphereScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const rectLightRef = useRef<THREE.RectAreaLight>(null);

  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  
  const c0 = useRef(new THREE.Color(colors[0]));
  const c1 = useRef(new THREE.Color(colors[1] || colors[0]));
  const targetColor = useRef(new THREE.Color());

  const geometry = useMemo(() => {
      let detail = 2;
      if (settings.quality === 'med') detail = 3;
      if (settings.quality === 'high') detail = 4;
      return new THREE.IcosahedronGeometry(4, detail);
  }, [settings.quality]);
  
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
    const time = clock.getElapsedTime() * settings.speed * 0.4;
    const lerpSpeed = 0.05;
    
    c0.current.lerp(targetColor.current.set(colors[0] || '#ffffff'), lerpSpeed);
    c1.current.lerp(targetColor.current.set(colors[1] || colors[0] || '#ffffff'), lerpSpeed);

    if (materialRef.current) {
        materialRef.current.color = c0.current;
        materialRef.current.emissive = c1.current;
    }
    
    analyser.getByteFrequencyData(dataArray);
    let bass = 0, treble = 0;
    for(let i=0; i<15; i++) bass += dataArray[i];
    bass = (bass / 15) * settings.sensitivity;
    for(let i=100; i<160; i++) treble += dataArray[i];
    treble = (treble / 60) * settings.sensitivity;
    const reactivity = bass / 255;
    const vibration = treble / 255;

    if (light1Ref.current) {
        light1Ref.current.color = c0.current;
        light1Ref.current.intensity = 15 + reactivity * 30;
    }
    if (light2Ref.current) {
        light2Ref.current.color = c1.current;
        light2Ref.current.intensity = 10 + reactivity * 20;
    }
    if (rectLightRef.current) {
        rectLightRef.current.intensity = 2 + vibration * 15;
        rectLightRef.current.lookAt(0,0,0);
    }


    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
        const ox = originalPositions[i*3];
        const oy = originalPositions[i*3+1];
        const oz = originalPositions[i*3+2];
        
        // More complex noise for swirling, mercurial surface
        const noise1 = Math.sin(ox * 0.5 + time) * Math.cos(oy * 0.4 + time * 0.8) * Math.sin(oz * 0.5 + time * 1.2);
        let noise2 = 0;
        if (settings.quality !== 'low') {
            noise2 = Math.sin(ox * 2.5 + time * 1.5) * Math.cos(oy * 2.2 + time * 1.8) * 0.5;
        }
        
        const d1 = noise1 * (0.3 + reactivity * 0.7);
        const d2 = noise2 * (0.05 + vibration * 0.2);
        const totalDisplacement = Math.max(0.1, 1.0 + d1 + d2);
        
        positions.setXYZ(i, ox * totalDisplacement, oy * totalDisplacement, oz * totalDisplacement);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.y = time * 0.08;
    meshRef.current.rotation.x = time * 0.05;
  });

  return (
    <>
      <color attach="background" args={['#030303']} />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>
      <ambientLight intensity={0.2} />
      <pointLight ref={light1Ref} position={[20, 20, 20]} intensity={15} distance={100} />
      <pointLight ref={light2Ref} position={[-20, -20, 10]} intensity={10} distance={100} />
      {/* RectAreaLight for elegant, soft reflections */}
      <rectAreaLight ref={rectLightRef} width={10} height={10} intensity={2} color={c1.current} position={[10, 10, -20]} />
      
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            ref={materialRef}
            metalness={0.9} // More metallic
            roughness={0.05} // More reflective
            clearcoat={1.0} // Strong clear coat for depth
            clearcoatRoughness={0.1}
            reflectivity={1.0}
            envMapIntensity={0.8}
            ior={1.8} // Higher index of refraction for more dramatic distortion
            side={THREE.DoubleSide}
            flatShading={settings.quality === 'low'}
         />
      </mesh>
    </>
  );
};
