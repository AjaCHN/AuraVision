import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend, ThreeElements } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, TiltShift } from '@react-three/postprocessing';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import * as THREE from 'three';
import { VisualizerMode, VisualizerSettings } from '../types';

// Register standard Three.js shader pass if not available in R3F postprocessing automatically
extend({ AfterimagePass });

// Add global JSX augmentation to ensure Three.js intrinsic elements are recognized by the TypeScript compiler.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      pointLight: any;
      spotLight: any;
      ambientLight: any;
      primitive: any;
      meshPhysicalMaterial: any;
      color: any;
      directionalLight: any;
      fog: any;
      circleGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
    }
  }
}

interface ThreeVisualizerProps {
  analyser: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode; 
}

const SilkWavesScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  // Increase segments for smoother silk detail
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 100, 100), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    analyser.getByteFrequencyData(dataArray);

    let vol = 0;
    for(let i=0; i<40; i++) vol += dataArray[i];
    vol = (vol / 40) * settings.sensitivity;

    const positions = meshRef.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime() * settings.speed * 0.3;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Multi-layered noise for silk-like folds
        const z1 = Math.sin(x * 0.15 + time) * Math.cos(y * 0.12 + time * 0.7) * 5.5;
        const z2 = Math.sin(x * 0.4 - time * 1.2) * Math.sin(y * 0.35 + time * 0.9) * 2.5;
        const z3 = Math.sin(x * 0.8 + time * 2) * 0.8; // High freq micro-folds
        
        const audioAmp = 1 + (vol / 255) * 4.0; 
        const dist = Math.sqrt(x*x + y*y);
        const ripple = Math.sin(dist * 1.2 - time * 6) * (vol / 255) * 2.0;
        
        positions.setZ(i, (z1 + z2 + z3) * audioAmp + ripple);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.x = -Math.PI / 2.5;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <>
      <color attach="background" args={['#020205']} /> 
      <pointLight position={[25, 40, 25]} intensity={12.0} color={colors[0]} distance={150} />
      <pointLight position={[-25, 20, 25]} intensity={8.0} color={colors[1]} distance={150} />
      <spotLight position={[0, -40, 30]} angle={0.9} penumbra={0.6} intensity={25.0} color={colors[2] || '#ffffff'} distance={120} />
      <ambientLight intensity={1.2} />
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            color={colors[0]} 
            emissive={colors[1]} 
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            sheen={1.0}
            sheenColor={new THREE.Color(colors[2] || '#ffffff')}
            sheenRoughness={0.2}
            side={THREE.DoubleSide}
            flatShading={false}
         />
      </mesh>
    </>
  );
};

const LiquidSphereScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(4, 3), []);
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
    let lowEnd = 0;
    for(let i=0; i<30; i++) lowEnd += dataArray[i];
    lowEnd = (lowEnd / 30) * settings.sensitivity;
    const time = clock.getElapsedTime() * settings.speed * 0.4;
    const positions = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const ox = originalPositions[i*3];
        const oy = originalPositions[i*3+1];
        const oz = originalPositions[i*3+2];
        const noise = Math.sin(ox * 0.4 + time) * Math.cos(oy * 0.3 + time * 0.8) * Math.sin(oz * 0.4 + time * 1.2);
        const reactivity = (lowEnd/255) * 0.5;
        const displacement = 1 + (noise * 0.3) + (reactivity * noise);
        positions.setXYZ(i, ox * displacement, oy * displacement, oz * displacement);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 15, 15]} intensity={3} color={colors[0]} />
      <pointLight position={[-15, -15, -5]} intensity={2} color={colors[1]} />
      <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
      <mesh ref={meshRef}>
         <primitive object={geometry} attach="geometry" />
         <meshPhysicalMaterial 
            color={colors[0]}
            emissive={colors[1]}
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.2}
            reflectivity={1.0}
         />
      </mesh>
    </>
  );
};

const LowPolyTerrainScene: React.FC<{ analyser: AnalyserNode; colors: string[]; settings: VisualizerSettings }> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useMemo(() => new Uint8Array(analyser.frequencyBinCount), [analyser]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, 40, 40), []);

  useFrame(({ clock }) => {
     if (!meshRef.current) return;
     analyser.getByteFrequencyData(dataArray);
     let bass = 0;
     for(let i=0; i<20; i++) bass += dataArray[i];
     bass = (bass/20) * settings.sensitivity;
     const positions = meshRef.current.geometry.attributes.position;
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
                color={colors[1]} 
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

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ analyser, colors, settings, mode }) => {
  if (!analyser) return null;

  const renderScene = () => {
    switch (mode) {
        case VisualizerMode.SILK:
            return <SilkWavesScene analyser={analyser} colors={colors} settings={settings} />;
        case VisualizerMode.LIQUID:
            return <LiquidSphereScene analyser={analyser} colors={colors} settings={settings} />;
        case VisualizerMode.TERRAIN:
            return <LowPolyTerrainScene analyser={analyser} colors={colors} settings={settings} />;
        default:
            return <LowPolyTerrainScene analyser={analyser} colors={colors} settings={settings} />;
    }
  };

  const getBloomIntensity = () => {
      if (mode === VisualizerMode.SILK) return 1.8;
      if (mode === VisualizerMode.LIQUID) return 2.5;
      return 2.0;
  };

  return (
    <div className={`absolute inset-0 z-0 ${settings.hideCursor ? 'cursor-none' : ''}`}>
      <Canvas 
        camera={{ position: [0, 2, 15], fov: 60 }} 
        dpr={[1, 2]} 
        gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, preserveDrawingBuffer: true, autoClear: true }}
      >
        {renderScene()}
        {settings.glow && (
            <EffectComposer enableNormalPass={false}>
                <Bloom 
                    luminanceThreshold={0.2} 
                    luminanceSmoothing={0.85} 
                    height={300} 
                    intensity={getBloomIntensity()} 
                />
                <ChromaticAberration 
                    offset={new THREE.Vector2(0.002 * settings.sensitivity, 0.002)}
                />
                {(mode === VisualizerMode.LIQUID || mode === VisualizerMode.SILK) && (
                    <TiltShift blur={0.1} />
                )}
            </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;