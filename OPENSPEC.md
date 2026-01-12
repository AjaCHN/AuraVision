# SonicVision AI - OpenSpec 规范文档

## 1. 项目概述
SonicVision AI 是一款高端、沉浸式的实时音乐可视化 Web 应用。它结合了高精度频谱分析技术与 Google Gemini 3 系列模型的 AI 识别能力，将麦克风捕捉的音频转化为极具艺术感的生成式视觉景观。

## 2. 视觉语言 (Visual Language)
### 2.1 设计哲学
*   **深空极简 (Deep Space Minimalism):** 采用全黑背景 (`#000000`)，消除物理边界感，让视觉特效成为核心。
*   **玻璃拟态 (Glassmorphism):** UI 容器使用极高透明度 (`bg-black/20` 或 `bg-[#060608]/90`) 结合深层背景模糊 (`backdrop-blur-3xl`)。
*   **霓虹美学 (Neon Aesthetics):** 核心视觉元素支持发光效果 (Bloom)，色彩源自精心挑选的 28 套高饱和度配色方案。

### 2.2 交互动态
*   **闲置逻辑 (Idle Logic):** 当用户无操作超过 3 秒，迷你交互栏会自动淡出至 `15%` 不透明度。设置面板在展开状态下保持恒定可见。
*   **微动效 (Micro-interactions):** 按钮 hover 时伴随 `scale-105` 的弹性缩放及边框光晕强化。
*   **进入动画:** 应用启动时使用 `fadeInUp` 动画平滑引入核心元素。

## 3. 核心功能模块
### 3.1 渲染引擎 (Rendering Engines)
*   **2D Canvas 模式:**
    *   **等离子流 (Plasma):** 基于正弦函数叠加的流体渐变。
    *   **速激星空 (Particles):** 受高频信号加速的粒子系统，支持长拖尾 (`alpha: 0.06`)。
    *   **舞台激光 (Lasers):** 多源发射的线性光束，随低音脉冲产生震荡。
*   **3D WebGL 模式 (React Three Fiber):**
    *   **流光绸缎 (Silk):** 使用物理材质与置换贴图模拟真实织物感。
    *   **液态星球 (Liquid):** 变形球体，受低音频率影响产生实时形变。

### 3.2 AI 歌曲识别 (Intelligence Loop)
*   **模型:** 使用 `gemini-3-flash-preview`。
*   **指纹识别 (Fingerprinting):** 识别前生成声学特征码，优先与本地 `localStorage` 缓存匹配，减少 API 调用。
*   **搜索增强 (Search Grounding):** 调用 `googleSearch` 工具进行实时联网验证，确保歌词与元数据的准确性（支持中、英、日、韩等多语种）。
*   **自动步进:** 每 45 秒自动触发一次环境采样识别，静音状态下自动挂起。

### 3.3 歌词呈现 (Lyrics Presentation)
*   **卡拉OK模式:** 字体权重 `900`，支持随低音振幅产生的 `scale` 缩放效果（0.2s 平滑过渡）。
*   **极简模式:** `monospace` 字体，超宽字符间距，半透明呼吸感效果。

## 4. 技术规范
### 4.1 状态持久化 (Persistence)
*   **存储机制:** 使用 `localStorage` 进行分块存储，前缀为 `sv_v6_`。
*   **持久化内容:** 渲染模式、颜色主题、灵敏度、平滑度、采样分辨率 (FFT Size)、UI 语言及区域设置。

### 4.2 音频处理
*   **采样:** 实时 `AnalyserNode` 监听，默认 `fftSize: 512`，可扩展至 `4096`。
*   **信号优化:** 自动尝试关闭系统级的噪声抑制与回声消除，获取原始全频段信号。

## 5. 辅助功能与多语言
*   **多语言支持:** 完整支持 `zh` (简体中文), `en` (英语), `ja` (日语)。
*   **无障碍:** 为所有控制元素提供 ARIA 标签，滑块支持键盘微调。

---
*SonicVision AI Project Specification - Version 0.2.3*
