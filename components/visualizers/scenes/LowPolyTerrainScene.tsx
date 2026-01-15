import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { VisualizerSettings } from '../../../core/types';
import { useAudioReactive } from '../../../core/hooks/useAudioReactive';

interface SceneProps {
  analyser: AnalyserNode;
  colors: string[];
  settings: VisualizerSettings;
}

// 自定义星空组件，支持独立闪烁和漂移
const DynamicStarfield = ({ treble, speed }: { treble: number; speed: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const count = 6000;
  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 在一个巨大的球体内随机分布
      const r = 100 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      s[i] = Math.random() * 1000; // 随机种子用于闪烁相位
    }
    return [pos, s];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTreble: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') }
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // 整体随机漂移与缓慢旋转
      pointsRef.current.rotation.y = t * 0.02 * speed;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
      pointsRef.current.position.x = Math.sin(t * 0.2) * 2;
      
      // 更新着色器参数
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTreble.value = treble;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-seed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float seed;
          varying float vTwinkle;
          uniform float uTime;
          uniform float uTreble;
          void main() {
            // 计算独立闪烁：基础频率 + 随高音变化的动态频率
            float twinkle = sin(uTime * (1.5 + uTreble * 5.0) + seed) * 0.5 + 0.5;
            vTwinkle = twinkle;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (2.0 + vTwinkle * 2.0) * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vTwinkle;
          uniform vec3 uColor;
          void main() {
            // 柔和的圆形粒子
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.2, dist) * (0.3 + vTwinkle * 0.7);
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
};

export const LowPolyTerrainScene: React.FC<SceneProps> = ({ analyser, colors, settings }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const fogRef = useRef<THREE.Fog>(null);

  const { bass, mids, treble, smoothedColors } = useAudioReactive({ analyser, colors, settings });
  const [c0, c1, c2] = smoothedColors;

  const geometry = useMemo(() => {
    const segments = settings.quality === 'high' ? 50 : settings.quality === 'med' ? 35 : 25;
    return new THREE.PlaneGeometry(80, 80, segments, segments);
  }, [settings.quality]);

  useFrame(({ clock }) => {
     const time = clock.getElapsedTime() * settings.speed * 0.2;

     if (materialRef.current) materialRef.current.color = c1;
     if (sunRef.current) {
        (sunRef.current.material as THREE.MeshBasicMaterial).color = c0;
        const sunScale = 1.0 + bass * 0.5;
        sunRef.current.scale.set(sunScale, sunScale, sunScale);
        sunRef.current.position.y = 10 + Math.cos(time * 0.2) * 5;
     }
     if (fogRef.current) {
        fogRef.current.color = c2;
        fogRef.current.near = 10 - bass * 5;
        fogRef.current.far = 40 + mids * 15;
     }

     if (!meshRef.current) return;
     const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;

     for(let i=0; i<positions.count; i++) {
         const x = positions.getX(i);
         const y = positions.getY(i);

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

  return (
      <>
        <color attach="background" args={[c2.getStyle()]} /> 
        <fog ref={fogRef} attach="fog" args={[c2.getStyle(), 10, 40]} />
        
        {/* 使用增强版的动态星空 */}
        <DynamicStarfield treble={treble} speed={settings.speed} />
        
        <mesh ref={sunRef} position={[0, 10, -30]}>
            <circleGeometry args={[8, 32]} />
            <meshBasicMaterial color={c0} toneMapped={false} />
        </mesh>
        
        <mesh ref={meshRef} rotation={[-Math.PI/2.2, 0, 0]} position={[0, -5, 0]}>
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial 
                ref={materialRef}
                flatShading={true} 
                roughness={0.9}
                metalness={0.1}
            />
        </mesh>
        
        <ambientLight intensity={0.6} color={c1} />
        <directionalLight 
            color={c0} 
            intensity={2.5} 
            position={[10, 20, -20]}
        />
      </>
  );
};