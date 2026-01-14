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
1.  **智能预设 (Smart Presets):** 顶部设有下拉菜单，提供 `[催眠舒缓, 动感派对]` 等预设选项，一键应用模式、主题、速度、光效的组合。
2.  **视觉模式 (Visualizer Mode):** 采用**卡片式预览**布局，每个模式均配有动态风格化预览图，直观展示视觉风格。
3.  **视觉主题 (Visual Theme):** 采用 `36x36px` 色块网格，展示线性渐变预览。
4.  **核心参数 (Core Parameters):** `速度` 与 `灵敏度` 滑块。
5.  **特效开关 (FX Toggles):** `光晕`、`拖尾`、`自动循环`等开关及关联设置。

### 3.2 自定义文字面板 (Custom Text Panel)
1.  **第一列 (Content):** 文字内容输入、字体选择、显示开关。
2.  **第二列 (Style):** 颜色选择器与预设色块。
3.  **第三列 (Layout):** 缩放、旋转、不透明度及位置九宫格。

### 3.3 音频面板 (Audio Panel)
1.  **输入源 (Input Source):** 设备选择下拉菜单及启/停按钮。
2.  **核心参数 (Core Parameters):** `灵敏度` 与 `平滑度` 滑块。
3.  **频谱分辨率 (FFT):** 采用**分步滑块 (Stepped Slider)**，在 `[512, 1024, 2048, 4096]` 固定档位间选择，以统一数值输入体验。

### 3.4 AI 识别面板 (AI Panel)
1.  **第一列 (Core):** 识别开关、AI 供应商、区域选择。
2.  **第二列 (Style):** 歌词展示风格主题。
3.  **第三列 (Position):** 歌词位置九宫格及重置按钮。

### 3.5 系统面板与帮助中心 (System Panel & Help Center)
- **系统面板 (System Panel):** 经过重构，现仅包含“界面语言”、“禁止屏幕休眠”、“重置应用”等纯粹的系统级配置。采用单列布局以聚焦核心功能。
- **帮助与信息模态框 (Help & Info Modal):**
  - **触发:** 通过主控制条的 `?` 图标按钮调用。
  - **内容:** 整合了原“系统”面板中的静态信息，通过标签页清晰组织“使用指南”、“快捷键”和“关于应用”。
  - **安全:** “重置应用”按钮增加了二次确认步骤，防止误触。

## 4. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings` (随机美学组合)
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics` (开启曲目识别)
- `H`: `toggleExpanded` (隐藏/显示面板)
- `G`: `toggleGlow` (光晕效果)
- `T`: `toggleTrails` (拖尾效果)

## 5. 触控优化
- 点击区域 (Hit Targets): 最小 `44x44px`。
- 滑块 (Sliders): 支持连续拖拽且在移动端禁用页面回弹。

---
*Aura Vision Interface - Version 0.5.3*