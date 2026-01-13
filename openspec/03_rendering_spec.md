
# OpenSpec: 渲染规范

## 1. 2D 策略模式渲染器
所有 2D 渲染器实现 `IVisualizerRenderer` 接口，支持实时切换。

- **PlasmaFlow:** 
  - 逻辑：通过 `Math.sin/cos` 混合生成多层径向渐变，速度受 `settings.speed` 线性缩放。
- **Starfield:** 
  - 逻辑：3D 透视投影粒子系统，`warpSpeed` 与中高频振幅正相关。
- **Nebula:** 
  - 逻辑：Sprite 贴图混合。使用离屏 Canvas 预烘焙高斯模糊粒子。
- **Ethereal Smoke:**
  - 逻辑：双流发射系统（顶部下沉/底部上升），粒子受向心力场驱动向屏幕中心汇聚。
  - 混合：使用 `globalCompositeOperation = 'screen'` 实现烟雾叠加质感。
  - 响应：低频 (Bass) 控制发射率与粒子大小，中频 (Mids) 控制流动速度与湍流。

## 2. 3D WebGL 渲染
- **Silk Waves (Vertex Displacement):** 
  - `PlaneGeometry(60, 60, 160, 160)`。
  - 位移函数：`z = sin(x * freq + time) * cos(y * freq + time) * amplitude`。
  - 响应：Bass 驱动大幅度波纹，Treble 驱动表面微细节震动。
- **Liquid Sphere (Dynamic Distortion):** 
  - 基于法线方向的位移。利用 `bassNormalized` 实时调整置换强度，模拟液态金属表面张力。

## 3. 后期处理管道
- **Post-Effects:** Bloom (发光), Chromatic Aberration (色散), TiltShift (景深)。
- **Motion Blur:** 通过 `globalAlpha` 控制 2D Canvas 的清除强度实现视觉持久。