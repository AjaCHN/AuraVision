# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-10:** 歌词覆盖层 (`LyricsOverlay`)。
- **Z-20:** 歌曲信息徽章 (`SongOverlay`)。
- **Z-100:** 自定义文字层 (`CustomTextOverlay`)。
- **Z-110:** 迷你控制条 (`MiniControls`)。
- **Z-120:** 扩展设置面板 (`Controls Panel`)。
- **Z-200:** 首次引导页 (`OnboardingOverlay`)。
- **Z-210:** 帮助与信息模态框 (`HelpModal`)。

## 2. 交互状态与闲置检测
- **Idle Timeout:** 3000ms。
- **平板兼容:** 必须包含 `touchstart` 事件监听以重置计时器。
- **Mini Bar 转换:** 闲置时透明度降低至 `0.12`，并移除 `backdrop-blur` 以优化移动端性能。

## 3. 控制面板布局规范 (Panel Layouts)
所有扩展设置面板在 `lg` 屏幕下遵循三列式网格布局 (`grid-cols-3`)，`系统`面板除外。

### 3.1 视觉面板 (Visual Panel)
1.  **智能预设 (Smart Presets):** 顶部设有下拉菜单，一键应用模式、主题、速度、光效。
2.  **视觉模式 (Visualizer Mode):** 采用卡片式预览布局。
3.  **渲染画质:** 位于第二栏底部，提供 `[低, 中, 高]` 切换。
4.  **特效与自动化:** 第三栏集中管理光晕、拖尾、自动旋转等。

### 3.2 自定义文字面板 (Custom Text Panel)
1.  **第一列 (Content):** **紧凑型开关**与内容输入框并排，下方为字体与基础排版。
2.  **第二列 (Style):** 颜色选择器、预设色块与不透明度滑块。
3.  **第三列 (Layout):** 位置九宫格，底部对齐“重置”按钮。

### 3.3 音频面板 (Audio Panel)
1.  **输入源 (Input Source):** 设备选择与启/停按钮。
2.  **核心参数 (Processing):** 包含 `灵敏度`、`平滑度` 及 `频域分辨率 (FFT)`。
3.  **高级信息:** 第三栏提供 FFT 性能提示，底部对齐“重置”按钮。

### 3.4 AI 识别面板 (AI Panel)
1.  **第一列 (Core):** 识别开关、AI 供应商、区域选择。
2.  **第二列 (Style):** 歌词展示风格主题、字体家族与大小。
3.  **第三列 (Position):** 歌词位置九宫格，底部对齐“重置”按钮。

## 4. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings`
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics`
- `H`: `toggleExpanded`
- `G`: `toggleGlow`
- `T`: `toggleTrails`

---
*Aura Vision Interface - Version 0.5.5*