# OpenSpec: 渲染规范

## 1. 2D 策略模式渲染器
所有 2D 渲染器实现 `IVisualizerRenderer` 接口，支持实时切换。

- **PlasmaFlow:** 
  - 逻辑：通过 `Math.sin/cos` 混合生成多层径向渐变，速度受 `settings.speed` 线性缩放。
- **Starfield (星际穿越):** 
  - 逻辑：通过一个缓慢漂移的引力中心点 (Lissajous 曲线) 引导粒子，生成优雅的弧线飞行轨迹。
- **Nebula (深空星云):** 
  - 逻辑：采用多层粒子系统与 Sprite 贴图混合，通过视差效果创造深度。引入全局“宇宙风”力场，驱动粒子形成动态漩涡。
- **Fluid Curves (极光之舞):**
  - 逻辑：叠加多层不同频率与相位的正弦波，模拟极光的流动感。
  - **优化 (v0.7.0):** 基础波形频率降低约 30%（即波长拉长 50%），配合增强的视差速度差异，营造更宏大的视觉广度。
- **Macro Bubbles (微观液泡):**
  - 逻辑：模拟**景深 (Depth of Field)** 效果。泡泡的清晰度、边缘光及高光散景均基于其虚拟半径（深度）动态计算。

## 2. 3D WebGL 渲染
- **通用优化:**
  - **DPR Cap:** 低画质锁定 0.8x，中画质 1.2x，高画质上限 2.0x。
  - **Asset Policy (v0.7.1):** 移除外部 HDR 环境贴图依赖，改为本地多点光源系统，确保 100% 离线可靠性。

- **Silk Waves (流光绸缎):** 
  - 逻辑：通过 `MeshPhysicalMaterial` 材质，精调 `sheen` 和 `clearcoat` 参数。
- **Liquid Sphere (液态星球):**
  - 逻辑：采用多层分形噪声对顶点位移，模拟液态金属表面张力。
- **Low-Poly Terrain (低多边形山脉):**
  - 逻辑：分形噪声生成地形，通过动态雾效营造飞行史诗感。

## 3. 后期处理管道 (Post-Processing)
根据 `settings.quality` 动态挂载 Pass：
- **High:** Bloom + Chromatic Aberration。模式为 `LIQUID` 或 `SILK` 时额外应用 `TiltShift`。
- **Low:** 仅 Bloom (禁用 Mipmap Blur 以加速)。

## 4. 动态演化与稳定性 (v0.7.5)
- **色彩平滑过渡:** 采用线性插值 (Lerp)，插值系数 `0.05`，确保 1 秒内完成主题变换。
- **颜色数组对齐:** 防止在主题颜色数量变化时产生 `undefined` 导致的黑屏。

---
*Aura Vision Rendering - Version 0.7.5*