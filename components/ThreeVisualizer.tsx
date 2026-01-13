
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, TiltShift } from '@react-three/postprocessing';
import * as THREE from 'three';
import { VisualizerMode, VisualizerSettings } from '../types';
import { SilkWavesScene, LiquidSphereScene, LowPolyTerrainScene } from './ThreeScenes';

interface ThreeVisualizerProps {
  analyser: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode; 
}

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

  const dpr = settings.quality === 'low' ? 1 : settings.quality === 'med' ? 1.5 : 2;

  return (
    <div className={`absolute inset-0 z-0 ${settings.hideCursor ? 'cursor-none' : ''}`}>
      <Canvas 
        camera={{ position: [0, 2, 15], fov: 60 }} 
        dpr={dpr} 
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