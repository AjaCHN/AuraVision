# OpenSpec: 渲染规范

## 1. 2D 策略模式渲染器
所有 2D 渲染器实现 `IVisualizerRenderer` 接口，支持实时切换。

- **PlasmaFlow:** 
  - 逻辑：通过 `Math.sin/cos` 混合生成多层径向渐变，速度受 `settings.speed` 线性缩放。
- **Starfield (速激星空):** 
  - 逻辑：通过一个缓慢漂移的引力中心点引导粒子，生成优雅的弧线飞行轨迹，取代了原有的僵硬直线。
- **Nebula (深空星云):** 
  - 逻辑：采用多层粒子系统与 Sprite 贴图混合，通过视差效果创造深度。引入全局“宇宙风”力场，驱动粒子形成动态漩涡。
- **Kaleidoscope (万花筒):**
  - 逻辑：使用平滑的贝塞尔曲线替代直线，形成有机的触手状形态。中心设有一个随低音脉动的“宝石”核心作为视觉焦点。
- **Lasers (激光矩阵):**
  - 逻辑：模拟带有体积光效果的大气辉光，并通过复杂的扫描路径算法，实现专业级的灯光秀动态。

## 2. 3D WebGL 渲染
- **通用优化:**
  - **DPR Cap:** 低画质锁定 0.8x，中画质 1.2x，高画质上限 2.0x。
  - **Flat Shading:** 低画质下启用平面着色，减少光照计算开销。

- **Silk Waves (流光绸缎):** 
  - 逻辑：通过 `MeshPhysicalMaterial` 材质，精调 `sheen` (光泽) 和 `clearcoat` (清漆) 参数以模拟丝绸质感。场景光源进行优雅的轨道运动，创造流动的光影。
- **Liquid Sphere (液态星球):**
  - 逻辑：采用多层分形噪声对 Icosahedron (二十面体) 进行顶点位移，模拟液态金属的表面张力。场景采用 `RectAreaLight` (矩形区域光) 营造柔和高光。
- **Low-Poly Terrain (低多边形山脉):**
  - 逻辑：使用分形噪声算法生成自然起伏的地形。通过动态雾效和远景天体（日月星辰）来营造宏大的飞行史诗感。

## 3. 后期处理管道 (Post-Processing)
根据 `settings.quality` 动态挂载 Pass：
- **High:** Bloom + Chromatic Aberration。若模式为 `LIQUID` 或 `SILK`，则额外应用 `TiltShift`。
- **Low:** 仅 Bloom (禁用 Mipmap Blur 以加速)。

## 4. 动态演化与稳定性 (Evolution & Stability)
- **色彩平滑过渡:** 采用线性插值 (Lerp) 算法，插值系数设定为 `0.05`（针对 60FPS 深度优化），确保 0.5-1 秒内完成主题变换。
- **颜色数组对齐 (Array Sync):** 为了防止在主题颜色数量变化（如从 3 色变为 2 色）时产生 `undefined` 导致的黑屏，渲染器在执行插值前必须：
  1. 检查 `currentColors` 与 `targetColors` 长度。
  2. 若长度不一，使用当前数组的末位颜色填充或裁剪 `currentColors` 至目标长度。
  3. 确保所有渲染逻辑引用合法的颜色索引。

---
*Aura Vision Rendering - Version 0.4.3*