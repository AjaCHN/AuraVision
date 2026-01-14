
# OpenSpec: 系统架构规范

## 1. 核心技术栈
- **Build System:** Vite 5.2 (Rollup)
- **Runtime:** React 18.3+
- **Language:** TypeScript 5.4
- **Styling:** Tailwind CSS 3.4 (PostCSS)
- **Engine:** 
  - 2D: Canvas 2D API (策略模式封装)
  - 3D: Three.js (r164) / @react-three/fiber
- **Intelligence:** Google Gemini 3 (Flash Preview)
- **Audio:** Web Audio API (实时分析 + 离线解码)

## 2. 目录结构 (Directory Structure)
```
/
├── assets/                # 静态资源
│   ├── styles/            # 样式文件 (index.css)
│   ├── locales/           # 语言文件
│   └── images/            # 应用截图与图标 (preview_*.png)
├── components/
│   ├── App.tsx            # 应用主组件 (原根目录 App.tsx)
│   ├── controls/          # UI 控制层
│   │   ├── panels/        # 设置面板子组件
│   │   ├── Controls.tsx   # 主控制栏容器
│   │   └── ControlWidgets.tsx
│   ├── visualizers/       # 核心渲染层
│   │   ├── scenes/        # Three.js 场景组件
│   │   ├── VisualizerCanvas.tsx
│   │   ├── ThreeVisualizer.tsx
│   │   └── ThreeScenes.tsx
│   ├── ui/                # 界面覆盖层
│   │   ├── SongOverlay.tsx
│   │   ├── LyricsOverlay.tsx
│   │   ├── CustomTextOverlay.tsx
│   │   └── HelpModal.tsx
├── services/              # 业务逻辑服务
├── hooks/                 # React Hooks
├── types/                 # 全局类型定义
│   └── index.ts
├── constants/             # 常量配置
│   └── index.ts
├── i18n/                  # 国际化入口
│   └── index.ts
└── index.tsx              # 应用入口
```

## 3. 应用生命周期
1. **Bootstrap:** 检测浏览器权限，初始化 `AudioContext`。
2. **Context Management:** 采用 Ref 追踪实例，执行清理（Cleanup）或切换设备时严格检查 `state !== 'closed'`，防止 "Cannot close a closed AudioContext" 错误。
3. **Idle State:** 保持低功耗监听，等待 `analyser` 激活。
4. **Main Loop:** 
   - 采样: 每帧通过 `getByteFrequencyData` 获取 8 位数据。
   - 渲染: 将数据注入当前活动的 `IVisualizerRenderer`。
   - 识别: 每 45 秒或切歌检测触发音频快照识别。

## 4. 模块依赖图
- **App:** 状态中枢 (State Source of Truth)，管理 AudioContext 与 MediaStream 生命周期。
- **Components:**
  - `visualizers/`: 负责所有 Canvas/WebGL 绘图逻辑。
  - `controls/`: 负责用户交互与状态变更。
  - `ui/`: 负责信息展示（如歌词、提示）。
- **Visualizers:** 纯渲染函数集合，解耦业务逻辑。
- **Services:** 包含 `fingerprintService` (特征工程) 与 `geminiService` (网络通信)。
