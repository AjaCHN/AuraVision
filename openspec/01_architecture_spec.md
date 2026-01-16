# OpenSpec: 系统架构规范

## 1. 核心技术栈
- **Build System:** Vite 5.2 (Rollup)
- **Runtime:** React 18.3.1 (Strictly Locked)
- **Language:** TypeScript 5.4
- **Styling:** 
  - Tailwind CSS 3.4 (PostCSS)
  - **Compatibility Fix:** 预览环境采用 HTML `<link>` 标签引入原生 CSS，并结合 Tailwind Play CDN 进行实时解析。
- **Engine:** 
  - 2D: Canvas 2D API (策略模式封装)
  - 3D: Three.js (r160) / @react-three/fiber / @react-three/postprocessing
- **Intelligence:** Google Gemini 3 (Flash Preview)
- **Audio:** Web Audio API (实时分析)

## 2. 目录结构 (Directory Structure)
```
/
├── assets/                # 静态资源 (Styles, Locales)
├── components/            # UI 组件层
│   ├── controls/          # UI 控制面板 (含三列式 Panel)
│   ├── visualizers/       # 渲染容器 (2D/3D)
│   └── ui/                # 信息覆盖层 (歌词, 文字, 提示)
├── core/                  # 核心业务逻辑
│   ├── hooks/             # 自定义 Hooks (Audio, ID, Idle)
│   ├── services/          # 渲染策略、AI 服务、指纹算法
│   └── types/             # 全局类型定义
├── openspec/              # OpenSpec 系统规范文档
└── index.tsx              # 应用挂载点
```

## 3. 应用生命周期
1. **Bootstrap:** 检测浏览器权限，初始化 `AudioContext`。
2. **Context Management:** 严格执行 React 18 运行时环境下的实例清理，防止内存泄漏。
3. **Main Loop:** 
   - 采样: 每帧通过 `getByteFrequencyData` 获取频域数据。
   - 渲染: 数据注入当前活动的渲染策略 (2D) 或传参给 Three.js 组件 (3D)。

## 4. 容错与稳定性 (v0.7.5 更新)
- **Error Boundary:** 全局错误拦截器必须显式声明 `state` 和 `props` 成员属性，以确保在严格型 TypeScript 环境下对 `React.Component` 的继承行为符合预期。
- **Auto-Recovery:** 捕获渲染引擎异常后，提供“出厂重置 (Factory Reset)”选项以清除可能导致崩溃的 LocalStorage 脏数据。

---
*Aura Vision Architecture - Version 0.7.5*