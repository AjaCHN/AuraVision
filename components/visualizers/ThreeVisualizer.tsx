
/**
 * File: components/visualizers/ThreeVisualizer.tsx
 * Version: 0.7.3
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, TiltShift } from '@react-three/postprocessing';
import * as THREE from 'three';
import { VisualizerMode, VisualizerSettings } from '../../core/types';
import { SilkWavesScene, LiquidSphereScene, LowPolyTerrainScene } from './ThreeScenes';

interface ThreeVisualizerProps {
  analyser: AnalyserNode | null;
  colors: string[];
  settings: VisualizerSettings;
  mode: VisualizerMode; 
}

const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ analyser, colors, settings, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!analyser) return null;

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    console.warn("[WebGL] Context lost! High GPU pressure detected. Attempting to restore...");
  }, []);

  const handleContextRestored = useCallback(() => {
    console.log("[WebGL] Context restored. Re-initializing engine...");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    }
    return () => {
        if (canvas) {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        }
    };
  }, [handleContextLost, handleContextRestored]);

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
      if (mode === VisualizerMode.SILK) return 1.2;
      if (mode === VisualizerMode.LIQUID) return 1.8;
      return 1.5;
  };

  // Optimization: Reduce DPR cap to 1.5 for mid/high to save fill-rate on high-res screens
  const dpr = settings.quality === 'low' ? 0.8 : settings.quality === 'med' ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
  const enableTiltShift = settings.quality === 'high' && (mode === VisualizerMode.LIQUID || mode === VisualizerMode.SILK);
  
  // Optimization: Cap multisampling at 4 (or 0 for performance). 8 is often unstable on WebGL.
  const multisampling = settings.quality === 'high' ? 4 : 0;

  return (
    <div className="w-full h-full">
      <Canvas 
        key={settings.quality} // Remount on quality change to reset context with new settings
        ref={canvasRef}
        camera={{ position: [0, 2, 16], fov: 55 }} 
        dpr={dpr} 
        shadows={false}
        gl={{ 
            antialias: settings.quality !== 'low', 
            alpha: false,
            stencil: false,
            depth: true,
            powerPreference: "default", // Changed from high-performance to default to be nicer to GPU
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
          // Update ref for the effect cleanup
          canvasRef.current = gl.domElement;
        }}
      >
        <Suspense fallback={null}>
            {renderScene()}
        </Suspense>
        
        {settings.glow && (
            <EffectComposer 
              multisampling={multisampling}
              enableNormalPass={false}
            >
                <Bloom 
                    luminanceThreshold={0.4} 
                    luminanceSmoothing={0.9} 
                    intensity={getBloomIntensity()} 
                    mipmapBlur={settings.quality !== 'low'}
                />
                {settings.quality === 'high' && (
                    <ChromaticAberration 
                        offset={new THREE.Vector2(0.0015 * settings.sensitivity, 0.0015)}
                        radialModulation={false}
                        modulationOffset={0}
                    />
                )}
                {enableTiltShift && (
                    <TiltShift blur={0.1} />
                )}
            </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default ThreeVisualizer;
