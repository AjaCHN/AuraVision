
# OpenSpec: 渲染规范

## 1. 2D 策略模式渲染器
所有 2D 渲染器实现 `IVisualizerRenderer` 接口，支持实时切换。

- **PlasmaFlow:** 
  - 逻辑：通过 `Math.sin/cos` 混合生成多层径向渐变，速度受 `settings.speed` 线性缩放。
- **Starfield:** 
  - 逻辑：3D 透视投影粒子系统，采用线性轨迹（Linear Trajectory）。
  - 优化：粒子上限根据画质分级 (High: 200, Med: 120, Low: 60)。低画质下放大粒子尺寸以补偿数量减少。
- **Nebula:** 
  - 逻辑：Sprite 贴图混合。使用离屏 Canvas 预烘焙高斯模糊粒子。
  - 混合：`screen` 模式。
  - 优化：高画质 60 粒子，低画质 25 粒子。低画质禁用额外的高频闪烁层。
- **Ethereal Smoke:**
  - 逻辑：双流发射系统。
  - 优化：粒子生命周期在低画质下缩短 40%，最大粒子数限制为 60（高画质 200）。

## 2. 3D WebGL 渲染
- **通用优化:**
  - **DPR Cap:** 低画质锁定 0.8x，中画质 1.2x，高画质上限 2.0x。
  - **Flat Shading:** 低画质下启用平面着色，减少光照计算开销。

- **Silk Waves (Vertex Displacement):** 
  - 几何体精度分级：
    - High: 50x50 segments (2500 vertices)
    - Med: 35x35 segments (1225 vertices)
    - Low: 24x24 segments (576 vertices)
  - 位移函数：`z = sin(x * freq + time) * cos(y * freq + time) * amplitude`。低画质下跳过高频细节计算。

- **Liquid Sphere (Dynamic Distortion):** 
  - 几何体精度分级：
    - High: Icosahedron Detail 3
    - Med: Icosahedron Detail 2
    - Low: Icosahedron Detail 1 (Low Poly 风格)
  - 响应：基于法线方向的位移。低画质下禁用第二层噪声计算。

## 3. 后期处理管道 (Post-Processing)
根据 `settings.quality` 动态挂载 Pass：
- **High:** Bloom + Chromatic Aberration + TiltShift (仅 Silk/Liquid)。
- **Med:** Bloom + Chromatic Aberration。
- **Low:** 仅 Bloom (禁用 Mipmap Blur 以加速)。
- **Motion Blur:** 通过 `globalAlpha` 控制 2D Canvas 的清除强度实现视觉持久。

## 4. 动态演化 (Dynamic Evolution)
- **色彩过渡:** 采用线性插值 (Lerp) 算法，系数设定为 `0.005`，消除颜色循环时的突变跳动，实现呼吸般的平滑过渡。
