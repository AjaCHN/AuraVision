
# OpenSpec: 系统架构规范

## 1. 核心技术栈
- **Runtime:** React 19 (ESM)
- **Engine:** 
  - 2D: Canvas 2D API (策略模式封装)
  - 3D: Three.js / @react-three/fiber
- **Intelligence:** Google Gemini 3 (Flash Preview)
- **Audio:** Web Audio API (实时分析 + 离线解码)

## 2. 应用生命周期
1. **Bootstrap:** 检测浏览器权限，初始化 `AudioContext`。
2. **Context Management:** 采用 Ref 追踪实例，执行清理（Cleanup）或切换设备时严格检查 `state !== 'closed'`，防止 "Cannot close a closed AudioContext" 错误。
3. **Idle State:** 保持低功耗监听，等待 `analyser` 激活。
4. **Main Loop:** 
   - 采样: 每帧通过 `getByteFrequencyData` 获取 8 位数据。
   - 渲染: 将数据注入当前活动的 `IVisualizerRenderer`。
   - 识别: 每 45 秒或切歌检测触发音频快照识别。

## 3. 模块依赖图
- **App:** 状态中枢 (State Source of Truth)，管理 AudioContext 与 MediaStream 生命周期。
- **Components:**
  - `VisualizerCanvas` / `ThreeVisualizer`: 渲染入口。
  - `Controls` + `ControlWidgets`: UI 交互层，组件拆分以提升复用性。
- **Visualizers:** 纯渲染函数集合，解耦业务逻辑。
- **Services:** 包含 `fingerprintService` (特征工程) 与 `geminiService` (网络通信)。